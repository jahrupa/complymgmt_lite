import React from "react";
import { Tooltip } from "@mui/material";
import DashboardCard from "./DashboardCard";

/**
 * Location x month grid. Rows are locations grouped by state (the backend sorts by state, then
 * location), columns are months; a missing month key renders an empty cell.
 *
 * - statuses              { [status]: { label, bg, color } } for cell colours and the legend
 * - cellText(cell)        text inside a cell
 * - cellTooltip(cell)     tooltip content
 * - stateText(state)      summary next to a state heading (state summary row from the API)
 * - overallText(loc)      last column
 * - onCellClick(loc, month) / onLocationClick(loc)
 */
const LocationMonthGrid = ({
    selection,
    loading,
    title,
    subtitle,
    note,
    months = [],
    locations = [],
    states = [],
    statuses,
    cellText,
    cellTooltip,
    stateText,
    overallText,
    onCellClick,
    onLocationClick,
}) => {
    const stateSummary = Object.fromEntries(states.map((s) => [s.state, s]));

    const groups = [];
    locations.forEach((loc) => {
        const last = groups[groups.length - 1];
        if (last?.state === loc.state) last.rows.push(loc);
        else groups.push({ state: loc.state, rows: [loc] });
    });

    return (
        <DashboardCard
            selection={selection}
            title={title}
            subtitle={subtitle}
            loading={loading}
            isEmpty={locations.length === 0}
            actions={
                <div className="dw-legend">
                    {Object.entries(statuses).map(([key, s]) => (
                        <span key={key} style={{ "--swatch": s.bg }}>{s.label}</span>
                    ))}
                    <span style={{ "--swatch": "#f3f4f6" }}>No row</span>
                </div>
            }
        >
            {note && <div className="text-muted small mb-2">{note}</div>}
            <div className="dw-loc-grid-wrap" onClick={(e) => e.stopPropagation()}>
                <table className="dw-loc-grid">
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
                        {groups.map((group) => (
                            <React.Fragment key={group.state}>
                                <tr className="state-row">
                                    <td colSpan={months.length + 2}>
                                        {group.state}
                                        {stateSummary[group.state] && (
                                            <span className="text-muted fw-normal ms-2 small">{stateText(stateSummary[group.state])}</span>
                                        )}
                                    </td>
                                </tr>
                                {group.rows.map((loc) => (
                                    <tr key={`${loc.state}|${loc.location}`}>
                                        <td>
                                            <span role="button" className="text-decoration-underline" onClick={() => onLocationClick(loc)}>
                                                {loc.location}
                                            </span>
                                        </td>
                                        {months.map((m) => {
                                            const cell = loc.months?.[m.month];
                                            if (!cell) return <td key={m.month} className="dw-loc-cell empty" />;
                                            const style = statuses[cell.status] || { bg: "#e5e7eb", color: "#374151" };
                                            return (
                                                <Tooltip key={m.month} title={cellTooltip(cell)}>
                                                    <td
                                                        className="dw-loc-cell clickable"
                                                        style={{ background: style.bg, color: style.color }}
                                                        onClick={() => onCellClick(loc, m.month)}
                                                    >
                                                        {cellText(cell)}
                                                    </td>
                                                </Tooltip>
                                            );
                                        })}
                                        <td className="text-center small">{overallText(loc)}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};

export default LocationMonthGrid;
