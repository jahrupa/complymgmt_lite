import React, { useCallback, useMemo, useRef, useState } from "react";
import "../../style/dashboardWidgets.css";
import {
    fetchLicenseDashCompanyWise,
    fetchLicenseDashExceptions,
    fetchLicenseDashExpiryTimeline,
    fetchLicenseDashFilters,
    fetchLicenseDashLocationWise,
    fetchLicenseDashRecordById,
    fetchLicenseDashRecords,
    fetchLicenseDashSummary,
    fetchLicenseDashTrend,
    fetchLicenseDashTurnaround,
} from "../../api/service";
import Snackbars from "../../component/Snackbars";
import { decryptData } from "../../page/utils/encrypt";
import { useDashboardData, useDashboardFilters, useFilterOptions } from "../common/useDashboard";
import { formatPercent, withoutKeys } from "../common/dashboardUtils";
import AccessState from "../common/AccessState";
import TurnaroundCard from "../common/TurnaroundCard";
import RecordsTable from "../common/RecordsTable";
import RecordDetailDrawer from "../common/RecordDetailDrawer";
import ExceptionsCard from "../common/ExceptionsCard";
import GroupTableCard from "../common/GroupTableCard";
import LicenseFilterBar from "./LicenseFilterBar";
import SummaryWidget from "./SummaryWidget";
import BreakdownWidget from "./BreakdownWidget";
import LocationWidget from "./LocationWidget";
import ExpiryTimelineWidget from "./ExpiryTimelineWidget";
import TrendWidget from "./TrendWidget";
import { LicenseBadges } from "./LicenseBadges";
import { COMPANY_TABLE_COLUMNS, exceptionColumns, exceptionRow } from "./licenseColumns";
import {
    COMPUTED_RECORD_COLUMNS,
    DEFAULT_BREAKDOWN,
    DEFAULT_RECORD_COLUMNS,
    EXPIRY_TIMELINE_MONTHS,
    HIDDEN_RECORD_COLUMNS,
    MULTI_FILTER_KEYS,
    NO_DEFAULT_PERIOD,
    SINGLE_FILTER_KEYS,
    SORT_BY_FOR_COLUMN,
    TIMELINE_STEP_KINDS,
    WIDGET_ONLY_KEYS,
} from "./licenseUtils";

const renderStatus = (computed) => <LicenseBadges computed={computed} />;

/**
 * License Dashboard. Overall mode when no company is selected; company-wise mode calls the same
 * endpoints with company_name. Filters live in the URL query string so views are shareable.
 */
const LicenseDashboard = ({
    selectedCompany,
    setSelectedCompany,
    current,
    selectedCharts,
    setSelectedCharts,
    shouldShow,
    isActive,
}) => {
    const isCompanyMode = Boolean(selectedCompany);
    const [recordId, setRecordId] = useState(null);
    const recordsRef = useRef(null);

    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        message: "",
        severityType: "",
    });
    const showSnackbar = useCallback(
        (message, severityType) => setIsSnackbarsOpen((prev) => ({ ...prev, open: true, message, severityType })),
        []
    );

    const { filters, updateFilters, resetFilters, activated, ready } = useDashboardFilters({
        multiKeys: MULTI_FILTER_KEYS,
        singleKeys: SINGLE_FILTER_KEYS,
        isActive,
        defaultPeriod: NO_DEFAULT_PERIOD,
    });

    const { options: filterOptions, accessError: optionsAccessError } = useFilterOptions(
        fetchLicenseDashFilters,
        selectedCompany,
        activated
    );

    // Every widget gets the same filter set; the breakdown dimension stays with its widget
    const params = useMemo(
        () => ({ ...withoutKeys(filters, WIDGET_ONLY_KEYS), company_name: selectedCompany }),
        [filters, selectedCompany]
    );

    const { data, loading, accessError: dataAccessError } = useDashboardData({
        fetchers: {
            summary: { fetch: fetchLicenseDashSummary, fallback: {} },
            companyWise: { fetch: fetchLicenseDashCompanyWise, fallback: [], skip: isCompanyMode },
            locationWise: { fetch: fetchLicenseDashLocationWise, fallback: {} },
            expiryTimeline: {
                fetch: (p) => fetchLicenseDashExpiryTimeline({ ...p, months: EXPIRY_TIMELINE_MONTHS }),
                fallback: {},
            },
            trend: { fetch: fetchLicenseDashTrend, fallback: [] },
            turnaround: { fetch: fetchLicenseDashTurnaround, fallback: {} },
        },
        params,
        enabled: ready,
        isCompanyMode,
        onError: (message) => showSnackbar(message, "error"),
    });
    const accessError = optionsAccessError || dataAccessError;

    /* ---------- widget selection (same rules as the other dashboards) ---------- */

    const userRole = decryptData(localStorage.getItem("user_role"));
    const canSelect = userRole === "Admin" || userRole === "Super-Admin";

    const toggleChartSelection = (chartId) => {
        if (!current?.user_name) {
            showSnackbar("First you need to select a user", "warning");
            return;
        }
        setSelectedCharts((prev) => (prev.includes(chartId) ? prev.filter((id) => id !== chartId) : [...prev, chartId]));
    };

    const cardSelection = (id) => ({
        id,
        canSelect,
        selected: selectedCharts.includes(id),
        disabled: !current?.user_name,
        onSelect: (chartId) => canSelect && toggleChartSelection(chartId),
        onToggle: toggleChartSelection,
    });

    /* ---------- drill downs ---------- */

    const showRecords = shouldShow("lc-9");

    const onDrill = useCallback(
        (patch) => {
            updateFilters(patch);
            if (showRecords) recordsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        },
        [updateFilters, showRecords]
    );

    const onOpenCompany = (companyName) => {
        if (!companyName) return;
        setSelectedCompany(companyName);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onView = useCallback((id) => setRecordId(id), []);
    const exceptionLeadColumns = useMemo(() => exceptionColumns(isCompanyMode), [isCompanyMode]);

    // The raw "Days to Expire" column is never shown; computed.days_to_expire replaces it
    const recordColumns = useMemo(
        () => (filterOptions?.columns || []).filter((col) => !HIDDEN_RECORD_COLUMNS.includes(col.key)),
        [filterOptions]
    );

    const fetchRecordsPage = (page, limit, sort) => fetchLicenseDashRecords({ ...params, page, limit, ...sort });

    const summary = data.summary || {};
    const turnaround = data.turnaround || {};
    const breakdownBy = filters.breakdown_by || DEFAULT_BREAKDOWN;

    /* ---------- render ---------- */

    return (
        <div>
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />

            {isCompanyMode && !accessError && (
                <div className="d-flex align-items-center gap-2 mb-2 small">
                    <span className="text-muted">Company-wise view:</span>
                    <span className="fw-600">{selectedCompany}</span>
                    <button className="btn btn-link btn-sm p-0" onClick={() => setSelectedCompany("")}>
                        View all companies
                    </button>
                </div>
            )}

            {accessError ? (
                <AccessState
                    status={accessError}
                    companyName={selectedCompany}
                    dataLabel="license data"
                    onShowAll={() => setSelectedCompany("")}
                />
            ) : (
                <>
                    <LicenseFilterBar filterOptions={filterOptions} filters={filters} onChange={updateFilters} onClear={resetFilters} />

                    {shouldShow("lc-1") && (
                        <SummaryWidget selection={cardSelection("lc-1")} loading={loading} summary={summary} onDrill={onDrill} />
                    )}

                    {!isCompanyMode && shouldShow("lc-2") && (
                        <GroupTableCard
                            selection={cardSelection("lc-2")}
                            loading={loading}
                            title="Company-wise Licenses"
                            subtitle="Lowest valid % first. Click a company to open its dashboard"
                            rows={data.companyWise}
                            columnDefs={COMPANY_TABLE_COLUMNS}
                            rowId={(row) => row.name}
                            onRowClick={(row) => onOpenCompany(row.name)}
                        />
                    )}

                    <div className="charts-grid">
                        {shouldShow("lc-5") && (
                            <ExpiryTimelineWidget
                                selection={cardSelection("lc-5")}
                                loading={loading}
                                timeline={data.expiryTimeline}
                                expiringWindow={summary.expiring_window ?? filterOptions?.expiring_window ?? 60}
                                onDrill={onDrill}
                            />
                        )}
                        {shouldShow("lc-3") && (
                            <BreakdownWidget
                                selection={cardSelection("lc-3")}
                                enabled={ready}
                                params={params}
                                by={breakdownBy}
                                dimensions={filterOptions?.breakdowns}
                                onByChange={(by) => updateFilters({ breakdown_by: by === DEFAULT_BREAKDOWN ? "" : by })}
                                onDrill={onDrill}
                            />
                        )}
                    </div>

                    {shouldShow("lc-4") && (
                        <LocationWidget
                            selection={cardSelection("lc-4")}
                            loading={loading}
                            locationWise={data.locationWise}
                            isCompanyMode={isCompanyMode}
                            onDrill={onDrill}
                            onView={onView}
                        />
                    )}

                    {shouldShow("lc-6") && (
                        <TrendWidget selection={cardSelection("lc-6")} loading={loading} trend={data.trend} onDrill={onDrill} />
                    )}

                    {shouldShow("lc-7") && (
                        <TurnaroundCard
                            selection={cardSelection("lc-7")}
                            loading={loading}
                            stages={turnaround.stages}
                            endToEnd={turnaround.end_to_end}
                            footer={
                                <div className="small mt-2">
                                    SLA breached:{" "}
                                    {turnaround.sla_breach ? (
                                        <span
                                            role="button"
                                            className="dw-badge exception clickable"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDrill({ sla_breach: "Y" });
                                            }}
                                        >
                                            {turnaround.sla_breach} licenses ({formatPercent(turnaround.sla_breach_percent)})
                                        </span>
                                    ) : (
                                        <span className="text-muted">none</span>
                                    )}
                                </div>
                            }
                        />
                    )}

                    {ready && shouldShow("lc-8") && (
                        <ExceptionsCard
                            selection={cardSelection("lc-8")}
                            loading={loading}
                            subtitle={`${summary.exceptions ?? 0} exceptions: expired, expiring, SLA breached, follow-up overdue, document not uploaded, or billing not triggered`}
                            total={summary.exceptions}
                            fetchPage={(page, limit) => fetchLicenseDashExceptions({ ...params, page, limit })}
                            gridKey={JSON.stringify(params)}
                            leadColumns={exceptionLeadColumns}
                            mapRow={exceptionRow}
                            renderStatus={renderStatus}
                            statusWidth={260}
                            onView={onView}
                        />
                    )}

                    {ready && showRecords && (
                        <RecordsTable
                            ref={recordsRef}
                            selection={cardSelection("lc-9")}
                            loading={loading}
                            title="License Records"
                            subtitle={`${summary.total ?? 0} licenses match the filters · soonest expiry first`}
                            isEmpty={!summary.total}
                            columns={recordColumns}
                            computedColumns={COMPUTED_RECORD_COLUMNS}
                            defaultColumns={DEFAULT_RECORD_COLUMNS}
                            storageKey="licenseRecordColumns"
                            sortByForColumn={SORT_BY_FOR_COLUMN}
                            renderStatus={renderStatus}
                            statusHeader="Validity"
                            fetchPage={fetchRecordsPage}
                            gridKey={JSON.stringify(params)}
                            onView={onView}
                        />
                    )}
                </>
            )}

            <RecordDetailDrawer
                recordId={recordId}
                companyName={selectedCompany}
                fetchRecord={fetchLicenseDashRecordById}
                title={(d) => [d.record?.license_applicable, d.record?.license_number].filter((v) => v && v !== "-").join(" · ") || "License"}
                subtitle={(d) => [d.record?.company_name, d.record?.location, d.record?.state].filter((v) => v && v !== "-").join(" · ")}
                badges={renderStatus}
                stepKinds={TIMELINE_STEP_KINDS}
                onClose={() => setRecordId(null)}
            />
        </div>
    );
};

export default LicenseDashboard;
