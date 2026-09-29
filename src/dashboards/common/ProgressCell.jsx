import React from "react";
import { formatPercent } from "./dashboardUtils";

// Percentage with a small bar, for table cells; `emptyText` replaces the bar when there is no value
const ProgressCell = ({ value, color = "#14b8a6", emptyText }) => {
    if (emptyText) return <span className="text-muted small">{emptyText}</span>;
    const pct = Math.max(0, Math.min(100, Number(value) || 0));
    return (
        <div className="dw-progress">
            <div className="dw-progress-track">
                <span style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="dw-progress-label">{formatPercent(value)}</span>
        </div>
    );
};

export default ProgressCell;
