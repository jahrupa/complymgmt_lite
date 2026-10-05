import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { X } from "lucide-react";
import { errorStatus, formatIsoDate, formatRawValue } from "./dashboardUtils";

const ERROR_TEXT = {
    403: "You don't have access to this record.",
    404: "This record was not found.",
};

// stepKinds maps a timeline key to "deadline" (e.g. due date) or "marker" (an event outside the
// process sequence); both have days_from_previous = null and are drawn differently
const stepClass = (step, kind) => {
    if (kind) return kind;
    if (!step.date) return "pending";
    if (step.days_from_previous !== null && step.days_from_previous < 0) return "out-of-order";
    return "";
};

const stepMeta = (step, kind) => {
    if (kind === "deadline") return step.date ? `Deadline · ${formatIsoDate(step.date)}` : "No deadline recorded";
    if (!step.date) return "Not recorded";
    const date = formatIsoDate(step.date);
    const gap = step.days_from_previous;
    if (kind || gap === null || gap === undefined) return date;
    if (gap < 0) return `${date} · ${Math.abs(gap)} days before the previous step (out of order)`;
    return `${date} · ${gap === 0 ? "same day" : `+${gap} day${gap === 1 ? "" : "s"}`}`;
};

/**
 * Record detail for any table row: exceptions, data issues, process timeline and the record
 * grouped in sections. `fetchRecord(id, companyName)` returns { data: { sections, timeline, computed, record } }.
 */
const RecordDetailDrawer = ({ recordId, companyName, fetchRecord, title, subtitle, badges, stepKinds = {}, onClose }) => {
    const [detail, setDetail] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!recordId) return;
        let cancelled = false;
        setDetail(null);
        setError("");
        fetchRecord(recordId, companyName)
            .then((res) => !cancelled && setDetail(res?.data || null))
            .catch((err) => {
                if (cancelled) return;
                setError(ERROR_TEXT[errorStatus(err)] || err?.response?.data?.message || "Could not load this record.");
            });
        return () => {
            cancelled = true;
        };
    }, [recordId, companyName, fetchRecord]);

    const computed = detail?.computed;

    return (
        <Drawer anchor="right" open={Boolean(recordId)} onClose={onClose}>
            <Box sx={{ width: 640, maxWidth: "100vw", p: 2 }} role="presentation">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <div className="fw-600 fs-5">{(detail && title(detail)) || "Record"}</div>
                        <div className="text-muted small">{detail && subtitle(detail)}</div>
                        <div className="mt-2">{detail && badges(computed)}</div>
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
                                        <span key={text} className="dw-badge exception">{text}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {computed?.data_issues?.length > 0 && (
                            <div className="mb-3">
                                <div className="small fw-600 mb-1">Data issues (dates out of order, not a compliance problem)</div>
                                <div className="d-flex flex-wrap gap-1">
                                    {computed.data_issues.map((text) => (
                                        <span key={text} className="dw-badge data-issue">{text}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {detail.timeline?.length > 0 && (
                            <div className="mb-3">
                                <div className="fw-600 mb-2" style={{ color: "#0f766e" }}>Timeline</div>
                                <ol className="dw-timeline">
                                    {detail.timeline.map((step) => (
                                        <li key={step.key} className={stepClass(step, stepKinds[step.key])}>
                                            <span className="dot" />
                                            <div className="step-label">{step.label}</div>
                                            <div className="step-meta">{stepMeta(step, stepKinds[step.key])}</div>
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
                                                <td>{formatRawValue(field.value)}</td>
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
