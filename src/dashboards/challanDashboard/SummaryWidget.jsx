import React from "react";
import Chart from "react-apexcharts";
import { Tooltip } from "@mui/material";
import ChallanCard from "./ChallanCard";
import { formatINR, formatINRShort, formatPercent } from "./challanUtils";

const STATUS_COLORS = ["#14b8a6", "#f87171", "#fbbf24", "#99f6e4"];

// CH-1: KPI tiles, compliance status donut and a separate data quality badge
const SummaryWidget = ({ selection, loading, summary, onDrill }) => {
    const s = summary || {};
    const byStatus = s.by_status || [];
    const isEmpty = !s.total;

    const tiles = [
        {
            label: "Compliance",
            value: formatPercent(s.compliance_score),
            hint: `${s.complied ?? 0} of ${s.total ?? 0} challans complied`,
        },
        {
            label: "Paid On Time",
            value: formatPercent(s.on_time_percent),
            hint: `${s.paid_on_time ?? 0} on time, ${s.paid_late ?? 0} late (avg ${s.avg_days_late ?? 0}, max ${s.max_days_late ?? 0} days)`,
            drill: s.paid_late ? { paid_on_time: "N" } : null,
        },
        { label: "Total Amount", value: formatINRShort(s.amount), hint: formatINR(s.amount) },
        {
            label: "Estimated Penalty",
            value: formatINRShort(s.estimated_penalty),
            hint: formatINR(s.estimated_penalty),
            tone: s.estimated_penalty ? "danger" : "",
        },
        {
            label: "Overdue",
            value: s.overdue ?? 0,
            hint: "Unpaid and past the due date",
            tone: s.overdue ? "danger" : "",
            drill: s.overdue ? { overdue: "true" } : null,
        },
        {
            label: "Exceptions",
            value: s.exceptions ?? 0,
            hint: "Non-complied, paid late, overdue, skipped employees or penalty",
            tone: s.exceptions ? "warning" : "",
            drill: s.exceptions ? { exceptions_only: "true" } : null,
        },
        {
            label: "Skipped Employees",
            value: s.skipped_employees ?? 0,
            hint: `${s.rows_with_skipped_employees ?? 0} challans with skipped employees`,
        },
    ];

    const donut = {
        series: byStatus.map((i) => i.count),
        options: {
            chart: {
                type: "donut",
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        const name = byStatus[dataPointIndex]?.name;
                        if (name) onDrill({ compliance_status: [name] });
                    },
                },
            },
            colors: STATUS_COLORS,
            labels: byStatus.map((i) => i.name),
            legend: { position: "bottom" },
            dataLabels: { enabled: false },
            states: { active: { filter: { type: "none" } } },
            plotOptions: {
                pie: {
                    donut: {
                        size: "65%",
                        labels: { show: true, total: { show: true, label: "Challans", formatter: () => s.total ?? 0 } },
                    },
                },
            },
        },
    };

    const scope = [
        s.companies > 1 ? `${s.companies} companies` : null,
        `${s.states ?? 0} states`,
        `${s.locations ?? 0} locations`,
        `${s.registrations ?? 0} registrations`,
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <ChallanCard
            selection={selection}
            title="Challan Summary"
            subtitle={isEmpty ? "" : scope}
            loading={loading}
            isEmpty={isEmpty}
            minHeight={200}
            actions={
                s.data_issues > 0 && (
                    <Tooltip title="Process dates entered out of order, e.g. checklist prepared before data received. This is a data quality problem, not non-compliance. Click to view these rows.">
                        <span className="challan-badge data-issue clickable" onClick={() => onDrill({ data_issues_only: "true" })}>
                            Data quality: {s.data_issues} rows with data issues
                        </span>
                    </Tooltip>
                )
            }
        >
            <div className="row g-3 align-items-center">
                <div className="col-lg-9">
                    <div className="challan-kpi-grid">
                        {tiles.map((t) => (
                            <Tooltip key={t.label} title={t.hint || ""}>
                                <div
                                    className={`challan-kpi ${t.drill ? "clickable" : ""}`}
                                    onClick={
                                        t.drill
                                            ? (e) => {
                                                  e.stopPropagation();
                                                  onDrill(t.drill);
                                              }
                                            : undefined
                                    }
                                >
                                    <div className="challan-kpi-label">{t.label}</div>
                                    <div className={`challan-kpi-value ${t.tone || ""}`}>{t.value}</div>
                                </div>
                            </Tooltip>
                        ))}
                    </div>
                </div>
                <div className="col-lg-3">
                    {byStatus.length > 0 && <Chart options={donut.options} series={donut.series} type="donut" height={220} />}
                </div>
            </div>
        </ChallanCard>
    );
};

export default SummaryWidget;
