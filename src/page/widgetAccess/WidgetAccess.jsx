import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Checkbox, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Eye } from "lucide-react";
import "../../style/widgetAccess.css";
// These came with the old Widget Mappings page; other pages (modals, notifications, password
// forms) rely on classes they define, so they stay globally loaded through this page
import "../../style/widgetMappings.css";
import "../../style/widgetMappingForm.css";
import {
    createOrUpdateWidgetMapping,
    deleteWidgetMappingById,
    fetchAllCompanies,
    fetchAllUser,
    fetchAllWidgetMappings,
    fetchWidgetMappingById,
} from "../../api/service";
import Snackbars from "../../component/Snackbars";
import { decryptData } from "../utils/encrypt";
import WidgetPreview from "./WidgetPreview";
import { COMPANY_SCOPED_PREFIXES, groupCatalog, normalizeId, titleCase, widgetPrefix } from "./widgetCatalog";

/**
 * Widget Access: choose which dashboard widgets each user sees. Pick a user, tick widgets (grouped
 * by dashboard) and save; the preview panel shows a live snapshot of the focused widget.
 */
const WidgetAccess = () => {
    const adminId = decryptData(localStorage.getItem("user_id"));

    const [users, setUsers] = useState([]);
    const [mappings, setMappings] = useState([]);
    const [catalog, setCatalog] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loadingPage, setLoadingPage] = useState(true);

    const [userSearch, setUserSearch] = useState("");
    const [widgetSearch, setWidgetSearch] = useState("");
    const [targetId, setTargetId] = useState("");
    const [initial, setInitial] = useState(new Set());
    const [selected, setSelected] = useState(new Set());
    const [loadingUser, setLoadingUser] = useState(false);
    const [saving, setSaving] = useState(false);
    const [confirmRemove, setConfirmRemove] = useState(false);

    const [previewId, setPreviewId] = useState("");
    const [previewCompany, setPreviewCompany] = useState("");

    // Each preview loads a whole dashboard, so hovering only switches it after the pointer rests
    const hoverTimerRef = useRef();
    const hoverPreview = (id) => {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => setPreviewId(id), 250);
    };
    const cancelHoverPreview = () => clearTimeout(hoverTimerRef.current);
    useEffect(() => () => clearTimeout(hoverTimerRef.current), []);

    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        message: "",
        severityType: "",
    });
    const notify = useCallback(
        (message, severityType) => setIsSnackbarsOpen((prev) => ({ ...prev, open: true, message, severityType })),
        []
    );

    /* ---------- load users, current mappings, the widget catalog and companies ---------- */

    const loadMappings = useCallback(async () => {
        try {
            const data = await fetchAllWidgetMappings(adminId);
            setMappings(Array.isArray(data) ? data : []);
        } catch {
            setMappings([]);
        }
    }, [adminId]);

    useEffect(() => {
        const load = async () => {
            const [usersRes, catalogRes, companiesRes] = await Promise.allSettled([
                fetchAllUser(),
                // The signed-in admin's own list is the catalog of widgets they can grant
                fetchWidgetMappingById(adminId),
                fetchAllCompanies(),
            ]);
            setUsers(usersRes.status === "fulfilled" && Array.isArray(usersRes.value) ? usersRes.value : []);
            setCatalog(catalogRes.status === "fulfilled" ? catalogRes.value?.widgets || [] : []);
            const companyList = companiesRes.status === "fulfilled" && Array.isArray(companiesRes.value) ? companiesRes.value : [];
            setCompanies(companyList.map((c) => c.company_name).filter(Boolean));
            setPreviewCompany((prev) => prev || companyList[0]?.company_name || "");
            if (catalogRes.status === "rejected") notify("Could not load the widget list", "error");
            await loadMappings();
            setLoadingPage(false);
        };
        load();
    }, [adminId, loadMappings, notify]);

    const groups = useMemo(() => groupCatalog(catalog), [catalog]);
    const catalogIds = useMemo(() => new Set(groups.flatMap((g) => g.widgets.map((w) => w.widget_id))), [groups]);

    // Focus the first widget once the catalog is known
    useEffect(() => {
        if (!previewId && groups[0]?.widgets[0]) setPreviewId(groups[0].widgets[0].widget_id);
    }, [groups, previewId]);

    const widgetCountByUser = useMemo(
        () => Object.fromEntries(mappings.map((m) => [m.user_id, (m.widgets || []).length])),
        [mappings]
    );

    /* ---------- selected user ---------- */

    const targetUser = users.find((u) => u._id === targetId);
    const isSuperAdminTarget = targetUser?.user_role === "Super-Admin";

    const selectUser = async (userId) => {
        setTargetId(userId);
        setLoadingUser(true);
        try {
            const res = await fetchWidgetMappingById(userId);
            // Only widgets that are still in the catalog (retired ones are dropped on save)
            const ids = new Set((res?.widgets || []).map((w) => normalizeId(w.widget_id)).filter((wid) => catalogIds.has(wid)));
            setInitial(ids);
            setSelected(new Set(ids));
        } catch {
            setInitial(new Set());
            setSelected(new Set());
        } finally {
            setLoadingUser(false);
        }
    };

    const added = [...selected].filter((id) => !initial.has(id));
    const removed = [...initial].filter((id) => !selected.has(id));
    const dirty = added.length > 0 || removed.length > 0;

    const toggle = (id) =>
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const toggleGroup = (group, checked) =>
        setSelected((prev) => {
            const next = new Set(prev);
            group.widgets.forEach((w) => (checked ? next.add(w.widget_id) : next.delete(w.widget_id)));
            return next;
        });

    const save = async () => {
        if (!targetId) return;
        setSaving(true);
        try {
            let response;
            if (selected.size === 0) {
                response = await deleteWidgetMappingById(adminId, targetId);
            } else {
                response = await createOrUpdateWidgetMapping({ user_id: targetId, widget_ids: [...selected] }, adminId);
            }
            notify(response?.message || "Widget access saved", "success");
            setInitial(new Set(selected));
            await loadMappings();
        } catch (error) {
            notify(error?.response?.data?.message || "Could not save widget access", "error");
        } finally {
            setSaving(false);
        }
    };

    const removeAll = async () => {
        setConfirmRemove(false);
        setSaving(true);
        try {
            const response = await deleteWidgetMappingById(adminId, targetId);
            notify(response?.message || "Widget access removed", "success");
            setInitial(new Set());
            setSelected(new Set());
            await loadMappings();
        } catch (error) {
            notify(error?.response?.data?.message || "Could not remove widget access", "error");
        } finally {
            setSaving(false);
        }
    };

    /* ---------- filtering ---------- */

    const visibleUsers = users.filter((u) => {
        const term = userSearch.trim().toLowerCase();
        return !term || [u.full_name, u.email, u.user_role].some((v) => String(v || "").toLowerCase().includes(term));
    });

    const term = widgetSearch.trim().toLowerCase();
    const visibleGroups = groups
        .map((g) => ({
            ...g,
            widgets: g.widgets.filter(
                (w) => !term || [w.widget_id, w.widget_name, g.label].some((v) => String(v).toLowerCase().includes(term))
            ),
        }))
        .filter((g) => g.widgets.length);

    const previewWidget = groups.flatMap((g) => g.widgets.map((w) => ({ ...w, group: g.label }))).find((w) => w.widget_id === previewId);
    const needsCompany = previewWidget && COMPANY_SCOPED_PREFIXES.includes(widgetPrefix(previewWidget.widget_id));

    return (
        <div className="widget-access-page">
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />

            <div className="service-tracker-inner-page-header d-lg-flex d-md-flex align-items-center">
                <div className="notification-page-title">
                    <h1>Widget Access</h1>
                </div>
                <div className="text-muted small ms-lg-3">
                    Choose which dashboard widgets each user sees. Hover or focus a widget to preview it with live data.
                </div>
            </div>

            {loadingPage ? (
                <div className="no-data" style={{ minHeight: 400 }}>
                    Loading...
                </div>
            ) : (
                <div className="widget-access-layout">
                    {/* Users */}
                    <div className="widget-access-panel widget-access-users">
                        <TextField size="small" fullWidth label="Search users" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                        <div className="widget-access-user-list">
                            {visibleUsers.length === 0 && <div className="text-muted small p-2">No users found</div>}
                            {visibleUsers.map((u) => {
                                const count = widgetCountByUser[u._id];
                                return (
                                    <button
                                        key={u._id}
                                        type="button"
                                        className={`widget-access-user ${u._id === targetId ? "active" : ""}`}
                                        onClick={() => selectUser(u._id)}
                                        disabled={saving}
                                    >
                                        <span className="fw-600">{u.full_name || u.username}</span>
                                        <span className="text-muted small">{u.email}</span>
                                        <span className="d-flex gap-1 mt-1">
                                            <span className="dw-badge pending">{u.user_role || "User"}</span>
                                            {u.user_role === "Super-Admin" ? (
                                                <span className="dw-badge complied">All widgets</span>
                                            ) : count ? (
                                                <span className="dw-badge complied">{count} widgets</span>
                                            ) : (
                                                <span className="dw-badge neutral">No mapping</span>
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Widget catalog */}
                    <div className="widget-access-panel widget-access-catalog">
                        {!targetId ? (
                            <div className="no-data" style={{ minHeight: 300 }}>
                                Select a user to manage their widgets
                            </div>
                        ) : (
                            <>
                                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                                    <div className="me-auto">
                                        <div className="fw-600">{targetUser?.full_name}</div>
                                        <div className="text-muted small">
                                            {selected.size} of {catalogIds.size} widgets
                                            {dirty && ` · ${added.length} to add, ${removed.length} to remove`}
                                        </div>
                                    </div>
                                    <button className="btn btn-sm btn-outline-secondary" disabled={!dirty || saving} onClick={() => setSelected(new Set(initial))}>
                                        Reset
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        disabled={saving || initial.size === 0}
                                        onClick={() => setConfirmRemove(true)}
                                    >
                                        Remove all
                                    </button>
                                    <button className="btn btn-sm btn-primary" disabled={!dirty || saving} onClick={save}>
                                        {saving ? "Saving…" : "Save access"}
                                    </button>
                                </div>

                                {isSuperAdminTarget && (
                                    <div className="alert alert-info py-2 small">Super admins see every widget regardless of this mapping.</div>
                                )}

                                {confirmRemove && (
                                    <div className="alert alert-warning py-2 small d-flex align-items-center gap-2">
                                        <span className="me-auto">Remove all widget access for {targetUser?.full_name}?</span>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setConfirmRemove(false)}>
                                            Cancel
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={removeAll}>
                                            Remove
                                        </button>
                                    </div>
                                )}

                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Search widgets"
                                    placeholder="Name, id or dashboard"
                                    value={widgetSearch}
                                    onChange={(e) => setWidgetSearch(e.target.value)}
                                    className="mb-2"
                                />

                                {loadingUser ? (
                                    <div className="d-flex justify-content-center p-4">
                                        <CircularProgress size={26} />
                                    </div>
                                ) : (
                                    <div className="widget-access-groups">
                                        {visibleGroups.map((g) => {
                                            const chosen = g.widgets.filter((w) => selected.has(w.widget_id)).length;
                                            return (
                                                <div key={g.name} className="widget-access-group">
                                                    <label className="widget-access-group-header">
                                                        <Checkbox
                                                            size="small"
                                                            checked={chosen === g.widgets.length}
                                                            indeterminate={chosen > 0 && chosen < g.widgets.length}
                                                            onChange={(e) => toggleGroup(g, e.target.checked)}
                                                        />
                                                        <span className="fw-600">{g.label}</span>
                                                        <span className="text-muted small ms-auto">
                                                            {chosen}/{g.widgets.length}
                                                        </span>
                                                    </label>
                                                    {g.widgets.map((w) => (
                                                        <div
                                                            key={w.widget_id}
                                                            className={`widget-access-row ${w.widget_id === previewId ? "focused" : ""}`}
                                                            onMouseEnter={() => hoverPreview(w.widget_id)}
                                                            onMouseLeave={cancelHoverPreview}
                                                            onFocus={() => setPreviewId(w.widget_id)}
                                                        >
                                                            <Checkbox
                                                                size="small"
                                                                checked={selected.has(w.widget_id)}
                                                                onChange={() => toggle(w.widget_id)}
                                                                inputProps={{ "aria-label": `${w.widget_id} ${w.widget_name}` }}
                                                            />
                                                            <span className="widget-access-name">{titleCase(w.widget_name)}</span>
                                                            <span className="dw-badge pending">{w.widget_id}</span>
                                                            {added.includes(w.widget_id) && <span className="dw-badge complied">+ add</span>}
                                                            {removed.includes(w.widget_id) && <span className="dw-badge exception">− remove</span>}
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-link p-0 ms-1"
                                                                title="Preview"
                                                                onClick={() => setPreviewId(w.widget_id)}
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                        {visibleGroups.length === 0 && <div className="text-muted small p-2">No widgets match the search</div>}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Preview */}
                    <div className="widget-access-panel widget-access-preview">
                        {previewWidget ? (
                            <>
                                <div className="d-flex align-items-start gap-2 mb-2">
                                    <div className="me-auto">
                                        <div className="fw-600">{titleCase(previewWidget.widget_name)}</div>
                                        <div className="text-muted small">
                                            {previewWidget.group} · {previewWidget.widget_id} · live data,{" "}
                                            {needsCompany ? previewCompany || "pick a company" : "all companies"}
                                        </div>
                                    </div>
                                    {needsCompany && (
                                        <FormControl size="small" sx={{ minWidth: 220 }}>
                                            <InputLabel>Preview company</InputLabel>
                                            <Select
                                                label="Preview company"
                                                value={previewCompany}
                                                onChange={(e) => setPreviewCompany(e.target.value)}
                                            >
                                                {companies.map((c) => (
                                                    <MenuItem key={c} value={c}>
                                                        {c}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                </div>
                                {needsCompany && !previewCompany ? (
                                    <div className="widget-preview-empty">Pick a company to preview this widget.</div>
                                ) : (
                                    <WidgetPreview
                                        key={`${previewWidget.widget_id}|${needsCompany ? previewCompany : ""}`}
                                        widgetId={previewWidget.widget_id}
                                        companyName={previewCompany}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="widget-preview-empty">Hover a widget to preview it.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WidgetAccess;
