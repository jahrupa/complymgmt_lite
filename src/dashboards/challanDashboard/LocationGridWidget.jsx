import React from "react";
import { Tooltip } from "@mui/material";
import ChallanCard from "./ChallanCard";
import { formatINR, formatPercent } from "./challanUtils";

const STATUS_LABEL = { complied: "Complied", partial: "Partially complied", non_complied: "Non-complied" };

// CH-4: rows = locations grouped by state, columns = months, cell colour by status
const LocationGridWidget = ({ selection, loading, locationWise, onDrill }) => {
    const months = locationWise?.months || [];
    const locations = locationWise?.locations || [];
    const stateSummary = Object.fromEntries((locationWise?.states || []).map((s) => [s.state, s]));

    // Backend sorts by state then location, so grouping keeps that order
    const groups = [];
    locations.forEach((loc) => {
        const last = groups[groups.length - 1];
        if (last?.state === loc.state) last.rows.push(loc);
        else groups.push({ state: loc.state, rows: [loc] });
    });

    const drill = (loc, month) =>
        onDrill({
            state: [loc.state],
            location: [loc.location],
            ...(month ? { month_from: month, month_to: month, wage_month: [] } : {}),
        });

    return (
        <ChallanCard
            selection={selection}
            title="Location-wise Compliance by Month"
            subtitle="Click a cell to see that location's records for the month"
            loading={loading}
            isEmpty={locations.length === 0}
            actions={
                <div className="challan-legend">
                    <span style={{ "--swatch": "#14b8a6" }}>Complied</span>
                    <span style={{ "--swatch": "#fbbf24" }}>Partial</span>
                    <span style={{ "--swatch": "#f87171" }}>Non-complied</span>
                    <span style={{ "--swatch": "#f3f4f6" }}>No challan</span>
                </div>
            }
        >
            <div className="challan-loc-grid-wrap" onClick={(e) => e.stopPropagation()}>
                <table className="challan-loc-grid">
                    <thead>
                        <tr>
                            <th>Location</th>
                            {months.map((m) => (
                                <th key={m.month}>{m.label}</th>
                            ))}
                            <th>Overall</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((group) => {
                            const summary = stateSummary[group.state];
                            return (
                                <React.Fragment key={group.state}>
                                    <tr className="state-row">
                                        <td colSpan={months.length + 2}>
                                            {group.state}
                                            {summary && (
                                                <span className="text-muted fw-normal ms-2 small">
                                                    {summary.locations} locations · {formatPercent(summary.compliance_score)} complied ·{" "}
                                                    {formatINR(summary.amount)}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                    {group.rows.map((loc) => (
                                        <tr key={`${loc.state}|${loc.location}`}>
                                            <td>
                                                <span role="button" className="text-decoration-underline" onClick={() => drill(loc)}>
                                                    {loc.location}
                                                </span>
                                            </td>
                                            {months.map((m) => {
                                                const cell = loc.months?.[m.month];
                                                if (!cell) return <td key={m.month} className="challan-loc-cell empty" />;
                                                return (
                                                    <Tooltip
                                                        key={m.month}
                                                        title={
                                                            <div>
                                                                <div className="fw-600">{STATUS_LABEL[cell.status] || cell.status}</div>
                                                                <div>Acts: {(cell.acts || []).join(", ") || "–"}</div>
                                                                <div>
                                                                    Complied: {cell.complied}/{cell.total}
                                                                </div>
                                                                <div>Amount: {formatINR(cell.amount)}</div>
                                                                {cell.exceptions > 0 && <div>Exceptions: {cell.exceptions}</div>}
                                                            </div>
                                                        }
                                                    >
                                                        <td className={`challan-loc-cell ${cell.status}`} onClick={() => drill(loc, m.month)}>
                                                            {cell.complied}/{cell.total}
                                                        </td>
                                                    </Tooltip>
                                                );
                                            })}
                                            <td className="text-center small">{formatPercent(loc.compliance_score)}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </ChallanCard>
    );
};

export default LocationGridWidget;
