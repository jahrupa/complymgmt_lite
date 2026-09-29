import React from "react";
import Chart from "react-apexcharts";
import DashboardCard from "../common/DashboardCard";
import { formatPercent } from "../common/dashboardUtils";
import { hasApplicability } from "./registerUtils";

// RG-5: coverage and completion % per act
const ActWiseWidget = ({ loading, actWise, onDrill }) => {
    const rows = actWise || [];

    const chart = {
        series: [
            { name: "Coverage %", data: rows.map((r) => (hasApplicability(r.coverage) ? r.coverage.coverage_percent : 0)) },
            { name: "Completion %", data: rows.map((r) => r.completion_rate) },
        ],
        options: {
            chart: {
                type: "bar",
                toolbar: { show: false },
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        const act = rows[dataPointIndex]?.applicable_act;
                        if (act) onDrill({ act: [act] });
                    },
                },
            },
            colors: ["#14b8a6", "#6366f1"],
            states: { active: { filter: { type: "none" } } },
            plotOptions: { bar: { horizontal: true, barHeight: "70%" } },
            dataLabels: { enabled: false },
            xaxis: { categories: rows.map((r) => r.applicable_act), max: 100, labels: { formatter: (v) => `${Math.round(v)}%` } },
            yaxis: { labels: { maxWidth: 220 } },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (val, { seriesIndex, dataPointIndex }) => {
                        const r = rows[dataPointIndex];
                        if (seriesIndex === 0) {
                            return hasApplicability(r?.coverage)
                                ? `${formatPercent(val)} (${r.coverage.completed}/${r.coverage.applicable} applicable)`
                                : "No applicability data";
                        }
                        return `${formatPercent(val)} (${r?.completed ?? 0}/${r?.executed ?? 0} executed)`;
                    },
                },
            },
            legend: { position: "top", horizontalAlign: "left" },
        },
    };

    return (
        <DashboardCard
            title="Act-wise Coverage & Completion"
            subtitle="Click an act to filter to it"
            loading={loading}
            isEmpty={rows.length === 0}
        >
            <Chart options={chart.options} series={chart.series} type="bar" height={Math.max(260, rows.length * 52 + 70)} />
        </DashboardCard>
    );
};

export default ActWiseWidget;
