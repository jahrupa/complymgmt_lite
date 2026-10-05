import React, { useState } from "react";
import Chart from "react-apexcharts";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import DashboardCard from "../common/DashboardCard";

// Breakdown -> filter applied when a bar is clicked (flagged_by has no filter param)
const BREAKDOWNS = [
    { key: "by_type", label: "Type", drill: (name) => ({ variance_type: [name] }) },
    { key: "by_raw_data_type", label: "Raw data", drill: (name) => ({ raw_data_type: [name] }) },
    { key: "by_company", label: "Company", company: true },
    { key: "by_flagged_by", label: "Flagged by" },
];

// RG-8: flagged / open / corrected variances with a breakdown chart
const VarianceWidget = ({ loading, variance, isCompanyMode, onDrill, onOpenCompany }) => {
    const [breakdownKey, setBreakdownKey] = useState("by_type");
    const v = variance || {};
    const breakdowns = BREAKDOWNS.filter((b) => !(b.company && isCompanyMode));
    const breakdown = breakdowns.find((b) => b.key === breakdownKey) || breakdowns[0];
    const rows = v[breakdown.key] || [];

    const onBarClick = (index) => {
        const name = rows[index]?.name;
        if (!name) return;
        if (breakdown.company) onOpenCompany(name);
        else if (breakdown.drill) onDrill(breakdown.drill(name));
    };

    const chart = {
        series: [
            { name: "Open", data: rows.map((r) => r.open) },
            { name: "Corrected", data: rows.map((r) => r.corrected) },
        ],
        options: {
            chart: {
                type: "bar",
                stacked: true,
                toolbar: { show: false },
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        onBarClick(dataPointIndex);
                    },
                },
            },
            colors: ["#f87171", "#14b8a6"],
            states: { active: { filter: { type: "none" } } },
            plotOptions: { bar: { horizontal: true, barHeight: "55%" } },
            xaxis: { categories: rows.map((r) => r.name) },
            yaxis: { labels: { maxWidth: 240 } },
            legend: { position: "top", horizontalAlign: "left" },
        },
    };

    const kpis = [
        { label: "Flagged", value: v.flagged ?? 0 },
        { label: "Open", value: v.open ?? 0, tone: v.open ? "danger" : "", drill: v.open ? { variance_open: "true" } : null },
        { label: "Corrected", value: v.corrected ?? 0 },
    ];

    return (
        <DashboardCard
            title="Variance Analysis"
            subtitle="Open = corrected file not received and register not completed"
            loading={loading}
            isEmpty={!v.flagged}
            emptyText="No variances flagged for the selected filters"
            actions={
                <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={breakdown.key}
                    onChange={(e, val) => val && setBreakdownKey(val)}
                >
                    {breakdowns.map((b) => (
                        <ToggleButton key={b.key} value={b.key} sx={{ py: 0.25, textTransform: "none" }}>
                            {b.label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            }
        >
            <div className="dw-kpi-grid mb-2" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {kpis.map((k) => (
                    <div
                        key={k.label}
                        className={`dw-kpi ${k.drill ? "clickable" : ""}`}
                        onClick={
                            k.drill
                                ? (e) => {
                                      e.stopPropagation();
                                      onDrill(k.drill);
                                  }
                                : undefined
                        }
                    >
                        <div className="dw-kpi-label">{k.label}</div>
                        <div className={`dw-kpi-value ${k.tone || ""}`}>{k.value}</div>
                    </div>
                ))}
            </div>
            <Chart options={chart.options} series={chart.series} type="bar" height={Math.max(220, rows.length * 48 + 70)} />
        </DashboardCard>
    );
};

export default VarianceWidget;
