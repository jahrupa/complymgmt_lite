import React, { useEffect, useRef, useState } from "react";
import {
    fetchChallanExceptions,
    fetchChallanRecordById,
    fetchLicenseDashExceptions,
    fetchLicenseDashRecordById,
    fetchRegisterDashExceptions,
    fetchRegisterDashRecordById,
    fetchReturnsDashExceptions,
    fetchReturnsDashRecordById,
} from "../../api/service";
import DashboardCard from "../common/DashboardCard";
import RecordDetailDrawer from "../common/RecordDetailDrawer";
import StatusBadges from "../challanDashboard/StatusBadges";
import { ACT_KEY, TIMELINE_STEP_KINDS as CHALLAN_STEPS } from "../challanDashboard/challanUtils";
import { ExecutionBadges } from "../registerDashboard/RegisterBadges";
import { TIMELINE_STEP_KINDS as REGISTER_STEPS } from "../registerDashboard/registerUtils";
import { ReturnBadges } from "../returnsDashboard/ReturnsBadges";
import { TIMELINE_STEP_KINDS as RETURNS_STEPS } from "../returnsDashboard/returnsUtils";
import { LicenseBadges } from "../licenseDashboard/LicenseBadges";
import { TIMELINE_STEP_KINDS as LICENSE_STEPS } from "../licenseDashboard/licenseUtils";
import { MODULES } from "./cockpitUtils";

const LIMIT = 5;
const join = (...parts) => parts.filter((p) => p && p !== "-" && p !== "Unspecified").join(" · ");

// Per module: exceptions call, how to describe a row, and how to show its record
const SOURCES = [
    {
        module: "challan",
        fetch: (params) => fetchChallanExceptions(params, 1, LIMIT),
        describe: (row) => join(row.record?.[ACT_KEY], row.record?.location, row.computed?.month_label),
        fetchRecord: fetchChallanRecordById,
        badges: (computed) => <StatusBadges computed={computed} />,
        steps: CHALLAN_STEPS,
        title: (d) => join(d.record?.[ACT_KEY], d.record?.location) || "Challan",
        subtitle: (d) => join(d.record?.company_name, d.record?.state, d.computed?.month_label),
    },
    {
        module: "registers",
        fetch: (params) => fetchRegisterDashExceptions({ ...params, page: 1, limit: LIMIT }),
        describe: (row) => join(row.record?.register_name, row.record?.location, row.computed?.month_label),
        fetchRecord: fetchRegisterDashRecordById,
        badges: (computed) => <ExecutionBadges computed={computed} />,
        steps: REGISTER_STEPS,
        title: (d) => join(d.record?.register_name, d.record?.form_id) || "Register",
        subtitle: (d) => join(d.record?.company_name, d.record?.location, d.computed?.month_label),
    },
    {
        module: "returns",
        fetch: (params) => fetchReturnsDashExceptions({ ...params, page: 1, limit: LIMIT }),
        describe: (row) => join(row.record?.return_name, row.record?.location_name, row.computed?.period_label),
        fetchRecord: fetchReturnsDashRecordById,
        badges: (computed) => <ReturnBadges computed={computed} />,
        steps: RETURNS_STEPS,
        title: (d) => d.record?.return_name || "Return",
        subtitle: (d) => join(d.record?.company_name, d.record?.location_name, d.computed?.period_label),
    },
    {
        module: "license",
        fetch: (params) => fetchLicenseDashExceptions({ ...params, page: 1, limit: LIMIT }),
        describe: (row) => join(row.record?.license_applicable, row.record?.location),
        fetchRecord: fetchLicenseDashRecordById,
        badges: (computed) => <LicenseBadges computed={computed} />,
        steps: LICENSE_STEPS,
        title: (d) => join(d.record?.license_applicable, d.record?.license_number) || "License",
        subtitle: (d) => join(d.record?.company_name, d.record?.location, d.record?.state),
    },
];

/**
 * CCBC-8: "Needs attention" for one company: the first few exceptions of each module (with the
 * same filters), each opening its record. Replaces the old recent documents list.
 */
const CompanyAttentionWidget = ({ selection, enabled, params, companyName, onOpenModule }) => {
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [openRow, setOpenRow] = useState(null); // { source, id }
    const requestIdRef = useRef(0);

    useEffect(() => {
        if (!enabled) return;
        const requestId = ++requestIdRef.current;
        setLoading(true);
        Promise.allSettled(SOURCES.map((s) => s.fetch(params))).then((settled) => {
            if (requestId !== requestIdRef.current) return;
            setResults(
                Object.fromEntries(
                    SOURCES.map((s, i) => [
                        s.module,
                        settled[i].status === "fulfilled"
                            ? { rows: settled[i].value?.data || [], total: settled[i].value?.total ?? 0 }
                            : { rows: [], total: 0, failed: true },
                    ])
                )
            );
            setLoading(false);
        });
    }, [enabled, params]);

    const total = SOURCES.reduce((sum, s) => sum + (results[s.module]?.total || 0), 0);
    const openSource = openRow && SOURCES.find((s) => s.module === openRow.module);

    return (
        <>
            <DashboardCard
                selection={selection}
                title="Needs Attention"
                subtitle={`${total} items across modules; the first ${LIMIT} of each are shown`}
                loading={loading}
                isEmpty={total === 0}
                emptyText="Nothing needs attention for the selected filters"
                minHeight={200}
            >
                <div onClick={(e) => e.stopPropagation()}>
                    {SOURCES.map((s) => {
                        const res = results[s.module];
                        if (!res?.total && !res?.failed) return null;
                        return (
                            <div key={s.module} className="mb-3">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <span className="fw-600">{MODULES[s.module].label}</span>
                                    <span className="text-muted small">{res.failed ? "could not be loaded" : `${res.total} need attention`}</span>
                                    {res.total > LIMIT && (
                                        <button
                                            className="btn btn-link btn-sm p-0 ms-auto"
                                            onClick={() => onOpenModule(MODULES[s.module].tab, { exceptions_only: "true" })}
                                        >
                                            View all {res.total}
                                        </button>
                                    )}
                                </div>
                                <table className="table table-sm table-hover align-middle mb-0 small">
                                    <tbody>
                                        {res.rows.map((row) => (
                                            <tr key={row._id} style={{ cursor: "pointer" }} onClick={() => setOpenRow({ module: s.module, id: row._id })}>
                                                <td style={{ width: "32%" }}>{s.describe(row) || "—"}</td>
                                                <td style={{ width: "26%" }}>{s.badges(row.computed)}</td>
                                                <td>
                                                    <div className="d-flex flex-wrap gap-1">
                                                        {(row.computed?.exceptions || []).map((text) => (
                                                            <span key={text} className="dw-badge exception">{text}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })}
                </div>
            </DashboardCard>

            <RecordDetailDrawer
                recordId={openRow?.id || null}
                companyName={companyName}
                fetchRecord={openSource?.fetchRecord || SOURCES[0].fetchRecord}
                title={(d) => openSource?.title(d)}
                subtitle={(d) => openSource?.subtitle(d)}
                badges={(computed) => openSource?.badges(computed)}
                stepKinds={openSource?.steps}
                onClose={() => setOpenRow(null)}
            />
        </>
    );
};

export default CompanyAttentionWidget;
