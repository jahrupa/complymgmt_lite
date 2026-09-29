import React from "react";
import { Tooltip } from "@mui/material";
import DashboardCard from "../common/DashboardCard";
import { formatPercent } from "../common/dashboardUtils";
import CoverageBar from "./CoverageBar";
import { hasApplicability } from "./registerUtils";

// RG-1: KPI tiles, coverage bar and a separate data quality badge
const SummaryWidget = ({ selection, loading, summary, executionFiltersActive, onDrill, onCoverageDrill }) => {
    const s = summary || {};
    const coverage = s.coverage;
    const isEmpty = !s.executed && !s.applicable_registers;

    const tiles = [
        {
            label: "Coverage",
            value: hasApplicability(coverage) ? formatPercent(coverage.coverage_percent) : "No data",
            hint: hasApplicability(coverage)
                ? `${coverage.completed} of ${coverage.applicable} applicable registers completed`
                : "No applicability data for the selected period",
        },
        {
            label: "Completion",
            value: formatPercent(s.completion_rate),
            hint: `${s.completed ?? 0} of ${s.executed ?? 0} execution rows completed`,
        },
        {
            label: "SLA Met",
            value: formatPercent(s.sla_met_percent),
            hint: `${s.sla_met ?? 0} met, ${s.sla_missed ?? 0} missed (avg ${s.avg_days_late ?? 0}, max ${s.max_days_late ?? 0} days late)`,
            drill: s.sla_missed ? { sla_met: "N" } : null,
        },
        {
            label: "Overdue",
            value: s.overdue ?? 0,
            hint: "Not completed and the planned date has passed",
            tone: s.overdue ? "danger" : "",
            drill: s.overdue ? { overdue: "true" } : null,
        },
        {
            label: "Open Variances",
            value: s.variance_open ?? 0,
            hint: `${s.variance_flagged ?? 0} flagged; open = corrected file not received and not completed`,
            tone: s.variance_open ? "warning" : "",
            drill: s.variance_open ? { variance_open: "true" } : null,
        },
        {
            label: "Exceptions",
            value: s.exceptions ?? 0,
            hint: "Overdue, SLA missed or variance open",
            tone: s.exceptions ? "warning" : "",
            drill: s.exceptions ? { exceptions_only: "true" } : null,
        },
        {
            label: "Applicable Registers",
            value: s.applicable_registers ?? 0,
            hint: "Applicability rows for the selected months",
        },
    ];

    const scope = [
        s.companies > 1 ? `${s.companies} companies` : null,
        `${s.locations ?? 0} locations`,
        `${s.registers ?? 0} registers`,
        `${s.acts ?? 0} acts`,
        `${s.hod_signed_off ?? 0} HOD signed off`,
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <DashboardCard
            selection={selection}
            title="Register Summary"
            subtitle={isEmpty ? "" : scope}
            loading={loading}
            isEmpty={isEmpty}
            minHeight={200}
            actions={
                s.data_issues > 0 && (
                    <Tooltip title="Process dates entered out of order. This is a data quality problem, not non-compliance. Click to view these rows.">
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
                <div className="fw-600 small mb-2">
                    Coverage: applicable registers completed
                    {executionFiltersActive && (
                        <span className="text-muted fw-normal ms-2">(execution filters don't apply to coverage)</span>
                    )}
                </div>
                <CoverageBar coverage={coverage} onSegmentClick={onCoverageDrill} />
            </div>
        </DashboardCard>
    );
};

export default SummaryWidget;
