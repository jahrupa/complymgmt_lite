import React from "react";
import Chart from "react-apexcharts";
import DashboardCard from "../common/DashboardCard";
import { hasApplicability } from "./registerUtils";

// RG-3: completion / SLA / coverage % lines and executed vs completed bars per month
const TrendWidget = ({ loading, trend, onDrill }) => {
    // "Unspecified" (month "") has no place on a time axis
    const rows = (trend || []).filter((r) => r.month);
    const labels = rows.map((r) => r.label);

    const drillMonth = (event, dataPointIndex) => {
        event?.stopPropagation?.();
        const month = rows[dataPointIndex]?.month;
        if (month) onDrill({ month_from: month, month_to: month });
    };

    const percentChart = {
        series: [
            { name: "Completion %", data: rows.map((r) => r.completion_rate) },
            { name: "SLA met %", data: rows.map((r) => r.sla_met_percent) },
            // Only months with applicability data have a coverage value
            { name: "Coverage %", data: rows.map((r) => (hasApplicability(r.coverage) ? r.coverage.coverage_percent : null)) },
        ],
        options: {
            chart: {
                type: "line",
                toolbar: { show: false },
                zoom: { enabled: false },
                events: { markerClick: (event, ctx, { dataPointIndex }) => drillMonth(event, dataPointIndex) },
            },
            colors: ["#6366f1", "#f59e0b", "#14b8a6"],
            stroke: { width: 3, curve: "smooth" },
            markers: { size: 5 },
            dataLabels: { enabled: false },
            xaxis: { categories: labels },
            yaxis: { min: 0, max: 100, labels: { formatter: (v) => `${Math.round(v)}%` } },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (val, { seriesIndex, dataPointIndex }) => {
                        const r = rows[dataPointIndex];
                        if (seriesIndex === 2 && !hasApplicability(r?.coverage)) return "No applicability data";
                        return val === null || val === undefined ? "–" : `${val}%`;
                    },
                },
            },
            legend: { position: "top", horizontalAlign: "left" },
        },
    };

    const countChart = {
        series: [
            { name: "Executed", data: rows.map((r) => r.executed) },
            { name: "Completed", data: rows.map((r) => r.completed) },
        ],
        options: {
            chart: {
                type: "bar",
                toolbar: { show: false },
                events: { dataPointSelection: (event, ctx, { dataPointIndex }) => drillMonth(event, dataPointIndex) },
            },
            colors: ["#c7d2fe", "#6366f1"],
            states: { active: { filter: { type: "none" } } },
            plotOptions: { bar: { columnWidth: "55%" } },
            dataLabels: { enabled: false },
            xaxis: { categories: labels },
            legend: { position: "top", horizontalAlign: "left" },
        },
    };

    return (
        <DashboardCard
            title="Monthly Trend"
            subtitle="Click a month to filter to it"
            loading={loading}
            isEmpty={rows.length === 0}
        >
            <Chart options={percentChart.options} series={percentChart.series} type="line" height={240} />
            <div className="fw-600 small text-muted mt-2">Registers executed vs completed</div>
            <Chart options={countChart.options} series={countChart.series} type="bar" height={220} />
        </DashboardCard>
    );
};

export default TrendWidget;
