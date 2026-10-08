import React, { useState } from "react";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { LEVELS, downloadBlob, errorsToCsv, totalCreated } from "./onboardingUtils";

/**
 * Result of a preview (dry run) or a real import: per-level counts, the names of new
 * records, and the rows the server skipped.
 */
const OnboardingResults = ({ result, mode }) => {
    const [expanded, setExpanded] = useState({});

    const summary = result?.summary || {};
    const toCreate = result?.to_create || {};
    const errors = result?.errors || [];
    const created = totalCreated(summary);
    const isPreview = mode === "preview";
    const newLevels = LEVELS.filter(({ key }) => toCreate[key]?.length);

    const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

    const downloadErrors = () => {
        const blob = new Blob([errorsToCsv(errors)], { type: "text/csv;charset=utf-8" });
        downloadBlob(blob, "client_onboarding_errors.csv");
    };

    return (
        <div className="client-onboarding-panel client-onboarding-results">
            <div className={`alert ${isPreview ? "alert-info" : "alert-success"} py-2 mb-3`}>
                <strong>{isPreview ? "Preview — nothing has been saved yet" : "Import completed"}</strong>
                {result?.message && <div className="small">{result.message}</div>}
            </div>

            {created === 0 && errors.length === 0 && (
                <div className="alert alert-secondary py-2 mb-3">
                    Everything in this file already exists — nothing to import
                </div>
            )}

            <table className="table table-sm table-hover align-middle mb-3 client-onboarding-summary">
                <thead>
                    <tr>
                        <th>Level</th>
                        <th className="text-end">{isPreview ? "Will be created" : "New"}</th>
                        <th className="text-end">Already exists</th>
                    </tr>
                </thead>
                <tbody>
                    {LEVELS.map(({ key, label }) => (
                        <tr key={key}>
                            <td>{label}</td>
                            <td className="text-end fw-semibold">{summary[key]?.created ?? 0}</td>
                            <td className="text-end text-muted">{summary[key]?.existing ?? 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {newLevels.length > 0 && (
                <div className="mb-3">
                    <div className="client-onboarding-section-title">New records</div>
                    {newLevels.map(({ key, label }) => (
                        <div key={key} className="client-onboarding-expander">
                            <button
                                type="button"
                                className="client-onboarding-expander-toggle"
                                onClick={() => toggle(key)}
                                aria-expanded={!!expanded[key]}
                            >
                                <span>
                                    {label} ({toCreate[key].length})
                                </span>
                                {expanded[key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {expanded[key] && (
                                <ul className="client-onboarding-name-list">
                                    {toCreate[key].map((name, i) => (
                                        <li key={i}>{name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {errors.length > 0 && (
                <div className="alert alert-warning mb-0">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <strong>
                            {errors.length} {errors.length === 1 ? "row was" : "rows were"} skipped because of errors
                        </strong>
                        <button type="button" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={downloadErrors}>
                            <Download size={14} /> Download errors as CSV
                        </button>
                    </div>
                    <div className="client-onboarding-errors">
                        <table className="table table-sm mb-0 small">
                            <thead>
                                <tr>
                                    <th style={{ width: 80 }}>Row</th>
                                    <th>Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {errors.map((e, i) => (
                                    <tr key={i}>
                                        <td>{e.row}</td>
                                        <td>{e.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnboardingResults;
