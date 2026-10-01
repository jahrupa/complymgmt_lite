import React from "react";
import { Tooltip } from "@mui/material";
import DashboardCard from "../common/DashboardCard";
import ShareBar from "../common/ShareBar";
import { formatINR, formatPercent } from "../common/dashboardUtils";
import { COVERAGE_STATUSES, hasApplicableLocations } from "./returnsUtils";

// RT-1: KPI tiles, location coverage bar, transaction-only data gap and data quality badges
const SummaryWidget = ({ loading, summary, statusFiltersActive, onDrill, onCoverageDrill }) => {
    const s = summary || {};
    const coverage = s.coverage;
    const isEmpty = !s.total && !s.applicable_returns;

    const tiles = [
        {
            label: "Coverage",
            value: hasApplicableLocations(coverage) ? formatPercent(coverage.coverage_percent) : "No data",
            hint: hasApplicableLocations(coverage)
                ? `${coverage.covered} of ${coverage.applicable_locations} applicable locations have at least one filing`
                : "No applicable locations for the selected filters",
        },
        { label: "Filing Rate", value: formatPercent(s.filing_rate), hint: `${s.filed ?? 0} of ${s.total ?? 0} returns filed` },
        {
            label: "On Time",
            value: formatPercent(s.on_time_percent),
            hint: `${s.on_time ?? 0} on time, ${s.late ?? 0} late (avg ${s.avg_days_late ?? 0}, max ${s.max_days_late ?? 0} days late)`,
            drill: s.late ? { on_time: "N" } : null,
        },
        {
            label: "Compliance",
            value: formatPercent(s.compliance_rate),
            hint: `${s.compliant ?? 0} compliant, ${s.non_compliant ?? 0} non-compliant, ${s.partial ?? 0} partial`,
            drill: s.non_compliant || s.partial ? { compliance_status: ["non_compliant", "partial"] } : null,
        },
        {
            label: "Overdue",
            value: s.overdue ?? 0,
            hint: "Not filed and the due date has passed",
            tone: s.overdue ? "danger" : "",
            drill: s.overdue ? { overdue: "true" } : null,
        },
        {
            label: "Exceptions",
            value: s.exceptions ?? 0,
            hint: "Non / partially compliant, overdue, filed late, at risk or escalated",
            tone: s.exceptions ? "warning" : "",
            drill: s.exceptions ? { exceptions_only: "true" } : null,
        },
        {
            label: "At Risk / Escalated",
            value: `${s.at_risk ?? 0} / ${s.escalations ?? 0}`,
            hint: `Compliance or fine risk; estimated fines ${formatINR(s.fine_estimated)}`,
            tone: s.at_risk || s.escalations ? "danger" : "",
            drill: s.at_risk ? { at_risk: "true" } : s.escalations ? { escalation: "Y" } : null,
        },
    ];

    const scope = [
        s.companies > 1 ? `${s.companies} companies` : null,
        `${s.returns ?? 0} returns filed`,
        `${s.applicable_returns ?? 0} applicable returns`,
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <DashboardCard
            title="Returns Summary"
            subtitle={isEmpty ? "" : scope}
            loading={loading}
            isEmpty={isEmpty}
            minHeight={200}
            actions={
                s.data_issues > 0 && (
                    <Tooltip title="Dates out of order, or marked Compliant with no filed date. This is a data quality problem, not non-compliance. Click to view these rows.">
                        <span className="dw-badge data-issue clickable" onClick={() => onDrill({ data_issues_only: "true" })}>
                            Data quality: {s.data_issues} rows with data issues
                        </span>
                    </Tooltip>
                )
            }
        >
            <div className="dw-kpi-grid">
                {tiles.map((t) => (
                    <Tooltip key={t.label} title={t.hint || ""}>
                        <div
                            className={`dw-kpi ${t.drill ? "clickable" : ""}`}
                            onClick={
                                t.drill
                                    ? (e) => {
                                          e.stopPropagation();
                                          onDrill(t.drill);
                                      }
                                    : undefined
                            }
                        >
                            <div className="dw-kpi-label">{t.label}</div>
                            <div className={`dw-kpi-value ${t.tone || ""}`}>{t.value}</div>
                        </div>
                    </Tooltip>
                ))}
            </div>
            <div className="mt-3">
                <div className="d-flex flex-wrap align-items-center gap-2 fw-600 small mb-2">
                    <span>Coverage: applicable locations with at least one filing</span>
                    {statusFiltersActive && <span className="text-muted fw-normal">(status filters don't apply to coverage)</span>}
                    {coverage?.transaction_only > 0 && (
                        <Tooltip title="Locations with filings but nothing marked applicable. This is a data gap and is not part of the coverage %. Click to list them.">
                            <span className="dw-badge neutral clickable ms-auto" onClick={() => onCoverageDrill("transaction_only")}>
                                Data gap: {coverage.transaction_only} transaction-only locations
                            </span>
                        </Tooltip>
                    )}
                </div>
                {hasApplicableLocations(coverage) ? (
                    <ShareBar
                        segments={["covered", "not_covered"].map((key) => ({
                            key,
                            label: COVERAGE_STATUSES[key].label,
                            color: COVERAGE_STATUSES[key].color,
                            count: coverage[key] || 0,
                        }))}
                        total={coverage.applicable_locations}
                        caption={`${formatPercent(coverage.coverage_percent)} of ${coverage.applicable_locations} applicable locations covered`}
                        onSegmentClick={onCoverageDrill}
                    />
                ) : (
                    <div className="text-muted small">No applicable locations for the selected filters</div>
                )}
            </div>
        </DashboardCard>
    );
};

export default SummaryWidget;
