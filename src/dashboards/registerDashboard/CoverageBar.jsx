import React from "react";
import ShareBar from "../common/ShareBar";
import { formatPercent } from "../common/dashboardUtils";
import { COVERAGE_STATUSES, hasApplicability } from "./registerUtils";

// Completed / in progress / not started; onSegmentClick(status) drills into the coverage list
const CoverageBar = ({ coverage, onSegmentClick }) => {
    if (!hasApplicability(coverage)) {
        return <div className="text-muted small">No applicability data for the selected period</div>;
    }
    return (
        <ShareBar
            segments={Object.entries(COVERAGE_STATUSES).map(([key, s]) => ({ key, label: s.label, color: s.color, count: coverage[key] || 0 }))}
            total={coverage.applicable}
            caption={`${formatPercent(coverage.coverage_percent)} of ${coverage.applicable} applicable registers completed`}
            onSegmentClick={onSegmentClick}
        />
    );
};

export default CoverageBar;
