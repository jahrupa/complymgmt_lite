import React from "react";
import DashboardCard from "../common/DashboardCard";
import ShareBar from "../common/ShareBar";
import { formatPercent } from "../common/dashboardUtils";
import { LicenseChip, ValidityBar } from "./LicenseBadges";
import { VALIDITY, VALIDITY_ORDER } from "./licenseUtils";

const validitySegments = (stats) =>
    VALIDITY_ORDER.map((key) => ({ key, label: VALIDITY[key].label, color: VALIDITY[key].color, count: stats?.[key] || 0 }));

/**
 * LC-4: state totals as validity bars, then each location with its licenses as chips coloured by
 * validity. A chip opens that license; a state bar segment filters by state + validity.
 */
const LocationWidget = ({ loading, locationWise, isCompanyMode, onDrill, onView }) => {
    const locations = locationWise?.locations || [];
    const states = locationWise?.states || [];

    const groups = [];
    locations.forEach((loc) => {
        const last = groups[groups.length - 1];
        if (last?.state === loc.state) last.rows.push(loc);
        else groups.push({ state: loc.state, rows: [loc] });
    });
    const stateSummary = Object.fromEntries(states.map((s) => [s.state, s]));

    return (
        <DashboardCard
            title="Location-wise Licenses"
            subtitle="Each chip is a license coloured by validity; click one to open it"
            loading={loading}
            isEmpty={locations.length === 0}
        >
            <div className="dw-loc-grid-wrap" onClick={(e) => e.stopPropagation()}>
                {groups.map((group) => {
                    const summary = stateSummary[group.state];
                    return (
                        <div key={group.state} className="mb-3">
                            <div className="d-flex align-items-baseline gap-2 mb-1">
                                <span
                                    role="button"
                                    className="fw-600 text-decoration-underline"
                                    style={{ color: "#0f766e" }}
                                    onClick={() => onDrill({ state: [group.state] })}
                                >
                                    {group.state}
                                </span>
                                {summary && (
                                    <span className="text-muted small">
                                        {summary.locations} locations · {summary.total} licenses · {formatPercent(summary.valid_percent)} valid
                                    </span>
                                )}
                            </div>
                            {summary && (
                                <ShareBar
                                    segments={validitySegments(summary)}
                                    total={summary.total}
                                    onSegmentClick={(validity) => onDrill({ state: [group.state], validity: [validity] })}
                                />
                            )}
                            <table className="table table-sm align-middle mt-2 mb-0 small">
                                <tbody>
                                    {group.rows.map((loc) => (
                                        <tr key={`${loc.company_name}|${loc.location}`}>
                                            <td style={{ width: "28%" }}>
                                                <span
                                                    role="button"
                                                    className="text-decoration-underline"
                                                    onClick={() => onDrill({ state: [loc.state], location: [loc.location] })}
                                                >
                                                    {loc.location}
                                                </span>
                                                {!isCompanyMode && <div className="text-muted" style={{ fontSize: 11 }}>{loc.company_name}</div>}
                                            </td>
                                            <td style={{ width: "18%" }}>
                                                <ValidityBar stats={loc} />
                                            </td>
                                            <td>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {(loc.licenses || []).map((lic) => (
                                                        <LicenseChip key={lic._id} license={lic} onClick={onView} />
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
    );
};

export default LocationWidget;
