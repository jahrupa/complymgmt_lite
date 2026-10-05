import React from "react";
import Chart from "react-apexcharts";
import DashboardCard from "../common/DashboardCard";

const FILING_COLORS = ["#14b8a6", "#fbbf24", "#f87171"];

// RT-3: filed on time vs late vs not filed per due month, with compliance %
const TrendWidget = ({ loading, trend, onDrill }) => {
    // "Unspecified" (due_month "") has no place on a time axis
    const rows = (trend || []).filter((r) => r.due_month);

    const chart = {
        series: [
            { name: "Filed on time", type: "column", data: rows.map((r) => r.on_time) },
            { name: "Filed late", type: "column", data: rows.map((r) => r.late) },
            { name: "Not filed", type: "column", data: rows.map((r) => r.not_filed) },
            { name: "Compliance %", type: "line", data: rows.map((r) => r.compliance_rate) },
        ],
        options: {
            chart: {
                type: "line",
                stacked: true,
                toolbar: { show: false },
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        const month = rows[dataPointIndex]?.due_month;
                        if (month) onDrill({ month_from: month, month_to: month });
                    },
                },
            },
            colors: [...FILING_COLORS, "#0f766e"],
            states: { active: { filter: { type: "none" } } },
            stroke: { width: [0, 0, 0, 3] },
            markers: { size: [0, 0, 0, 5] },
            plotOptions: { bar: { columnWidth: "50%" } },
            dataLabels: { enabled: false },
            xaxis: { categories: rows.map((r) => r.label) },
            yaxis: [
                { seriesName: "Filed on time", title: { text: "Returns" } },
                { seriesName: "Filed on time", show: false },
                { seriesName: "Filed on time", show: false },
                { opposite: true, min: 0, max: 100, title: { text: "Compliance %" }, labels: { formatter: (v) => `${Math.round(v)}%` } },
            ],
            tooltip: { shared: true, intersect: false },
            legend: { position: "top", horizontalAlign: "left" },
        },
    };

    return (
        <DashboardCard
            title="Filings by Due Month"
            subtitle="Click a month to filter to it"
            loading={loading}
            isEmpty={rows.length === 0}
        >
            <Chart options={chart.options} series={chart.series} type="line" height={360} />
        </DashboardCard>
    );
};

export default TrendWidget;
