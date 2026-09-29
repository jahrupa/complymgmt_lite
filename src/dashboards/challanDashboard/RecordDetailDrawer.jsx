import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { X } from "lucide-react";
import { fetchChallanRecordById } from "../../api/service";
import StatusBadges from "./StatusBadges";
import { ACT_KEY, DATE_COLUMNS, errorStatus, formatIsoDate, formatRawDate } from "./challanUtils";

const ERROR_TEXT = {
    403: "You don't have access to this record.",
    404: "This record was not found.",
};

const stepClass = (step) => {
    if (step.key === "due_date") return "deadline";
    if (!step.date) return "pending";
    if (step.days_from_previous !== null && step.days_from_previous < 0) return "out-of-order";
    return "";
};

const stepMeta = (step) => {
    if (step.key === "due_date") return `Deadline · ${formatIsoDate(step.date)}`;
    if (!step.date) return "Not recorded";
    const date = formatIsoDate(step.date);
    const gap = step.days_from_previous;
    if (gap === null || gap === undefined) return date;
    if (gap < 0) return `${date} · ${Math.abs(gap)} days before the previous step (out of order)`;
    return `${date} · ${gap === 0 ? "same day" : `+${gap} day${gap === 1 ? "" : "s"}`}`;
};

// Record detail for any table row: exceptions, process timeline and the record grouped in sections
const RecordDetailDrawer = ({ recordId, companyName, onClose }) => {
    const [detail, setDetail] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!recordId) return;
        let cancelled = false;
        setDetail(null);
        setError("");
        fetchChallanRecordById(recordId, companyName)
            .then((res) => !cancelled && setDetail(res?.data || null))
            .catch((err) => {
                if (cancelled) return;
                setError(ERROR_TEXT[errorStatus(err)] || err?.response?.data?.message || "Could not load this record.");
            });
        return () => {
            cancelled = true;
        };
    }, [recordId, companyName]);

    const record = detail?.record || {};
    const computed = detail?.computed;

    return (
        <Drawer anchor="right" open={Boolean(recordId)} onClose={onClose}>
            <Box sx={{ width: 640, maxWidth: "100vw", p: 2 }} role="presentation">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <div className="fw-600 fs-5">
                            {[record[ACT_KEY], record.location].filter(Boolean).join(" · ") || "Challan record"}
                        </div>
                        <div className="text-muted small">
                            {[record.company_name, record.state, computed?.month_label].filter(Boolean).join(" · ")}
                        </div>
                        <div className="mt-2">
                            <StatusBadges computed={computed} />
                        </div>
                    </div>
                    <div className="dashboard-icon" style={{ cursor: "pointer" }} onClick={onClose}>
                        <X />
                    </div>
                </div>

                <Divider className="my-3" />

                {error && <div className="alert alert-danger">{error}</div>}
                {!error && !detail && <div className="no-data" style={{ minHeight: 300 }}>Loading...</div>}

                {detail && (
                    <>
                        {computed?.exceptions?.length > 0 && (
                            <div className="mb-3">
                                <div className="small fw-600 mb-1">Exceptions</div>
                                <div className="d-flex flex-wrap gap-1">
                                    {computed.exceptions.map((text) => (
                                        <span key={text} className="challan-badge exception">{text}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {computed?.data_issues?.length > 0 && (
                            <div className="mb-3">
                                <div className="small fw-600 mb-1">Data issues (dates out of order, not a compliance problem)</div>
                                <div className="d-flex flex-wrap gap-1">
                                    {computed.data_issues.map((text) => (
                                        <span key={text} className="challan-badge data-issue">{text}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {detail.timeline?.length > 0 && (
                            <div className="mb-3">
                                <div className="fw-600 mb-2" style={{ color: "#0f766e" }}>Timeline</div>
                                <ol className="challan-timeline">
                                    {detail.timeline.map((step) => (
                                        <li key={step.key} className={stepClass(step)}>
                                            <span className="dot" />
                                            <div className="step-label">{step.label}</div>
                                            <div className="step-meta">{stepMeta(step)}</div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {(detail.sections || []).map((section) => (
                            <div key={section.title} className="mb-3">
                                <div className="fw-600 mb-2" style={{ color: "#0f766e" }}>{section.title}</div>
                                <table className="table table-sm mb-0 small">
                                    <tbody>
                                        {section.fields.map((field) => (
                                            <tr key={field.key}>
                                                <td className="text-muted" style={{ width: "45%" }}>{field.label}</td>
                                                <td>
                                                    {field.value === "" || field.value === null || field.value === undefined
                                                        ? "–"
                                                        : DATE_COLUMNS.has(field.key)
                                                          ? formatRawDate(field.value)
                                                          : String(field.value)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </>
                )}
            </Box>
        </Drawer>
    );
};

export default RecordDetailDrawer;
