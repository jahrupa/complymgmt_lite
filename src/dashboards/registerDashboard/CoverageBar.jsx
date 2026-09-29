import React from "react";
import { Tooltip } from "@mui/material";
import { COVERAGE_STATUSES, hasApplicability } from "./registerUtils";
import { formatPercent } from "../common/dashboardUtils";

// Stacked completed / in progress / not started bar; onSegmentClick(status) drills into the coverage list
const CoverageBar = ({ coverage, onSegmentClick }) => {
    if (!hasApplicability(coverage)) {
        return <div className="text-muted small">No applicability data for the selected period</div>;
    }
    const segments = Object.entries(COVERAGE_STATUSES).map(([key, s]) => ({ key, ...s, count: coverage[key] || 0 }));

    return (
        <div>
            <div className={`dw-share-bar ${onSegmentClick ? "clickable" : ""}`}>
                {segments
                    .filter((s) => s.count > 0)
                    .map((s) => (
                        <Tooltip key={s.key} title={`${s.label}: ${s.count} of ${coverage.applicable}`}>
                            <span
                                style={{ width: `${(s.count / coverage.applicable) * 100}%`, background: s.color }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSegmentClick?.(s.key);
                                }}
                            />
                        </Tooltip>
                    ))}
            </div>
            <div className="d-flex flex-wrap gap-3 mt-2 small">
                {segments.map((s) => (
                    <span key={s.key} className="dw-legend">
                        <span style={{ "--swatch": s.color }}>
                            {s.label}: <strong>{s.count}</strong>
                        </span>
                    </span>
                ))}
                <span className="text-muted">
                    {formatPercent(coverage.coverage_percent)} of {coverage.applicable} applicable registers completed
                </span>
            </div>
        </div>
    );
};

export default CoverageBar;
