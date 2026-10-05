import React from "react";
import Chart from "react-apexcharts";
import DashboardCard from "../common/DashboardCard";
import { formatINR, formatINRShort } from "../common/dashboardUtils";

// Distinct hues so acts are told apart in the stacked bars
const ACT_COLORS = ["#14b8a6", "#6366f1", "#f59e0b", "#ec4899", "#64748b"];

// CH-2: compliance % / on-time % lines and amount by act stacked bars
const TrendWidget = ({ loading, trend, onDrill }) => {
    // "Unspecified" (month "") has no place on a time axis
    const rows = (trend || []).filter((r) => r.month);
    const labels = rows.map((r) => r.label);
    const acts = [...new Set(rows.flatMap((r) => Object.keys(r.amount_by_act || {})))];

    const drillMonth = (event, dataPointIndex) => {
        event?.stopPropagation?.();
        const month = rows[dataPointIndex]?.month;
        if (month) onDrill({ month_from: month, month_to: month, wage_month: [] });
    };

    const percentChart = {
        series: [
            { name: "Compliance %", data: rows.map((r) => r.compliance_score) },
            { name: "On-time %", data: rows.map((r) => r.on_time_percent) },
        ],
        options: {
            chart: {
                type: "line",
                toolbar: { show: false },
                zoom: { enabled: false },
                events: { markerClick: (event, ctx, { dataPointIndex }) => drillMonth(event, dataPointIndex) },
            },
            colors: ["#14b8a6", "#f59e0b"],
            stroke: { width: 3, curve: "smooth" },
            markers: { size: 5 },
            dataLabels: { enabled: false },
            xaxis: { categories: labels },
            yaxis: { min: 0, max: 100, labels: { formatter: (v) => `${Math.round(v)}%` } },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (val, { dataPointIndex }) => {
                        const r = rows[dataPointIndex];
                        return `${val}% (${r?.complied ?? 0}/${r?.total ?? 0} complied)`;
                    },
                },
            },
            legend: { position: "top", horizontalAlign: "left" },
        },
    };

    const amountChart = {
        series: acts.map((act) => ({ name: act, data: rows.map((r) => r.amount_by_act?.[act] || 0) })),
        options: {
            chart: {
                type: "bar",
                stacked: true,
                toolbar: { show: false },
                events: { dataPointSelection: (event, ctx, { dataPointIndex }) => drillMonth(event, dataPointIndex) },
            },
            colors: ACT_COLORS,
            states: { active: { filter: { type: "none" } } },
            plotOptions: { bar: { columnWidth: "45%" } },
            dataLabels: { enabled: false },
            xaxis: { categories: labels },
            yaxis: { labels: { formatter: (v) => formatINRShort(v) } },
            tooltip: { y: { formatter: (v) => formatINR(v) } },
            legend: { position: "top", horizontalAlign: "left" },
        },
    };

    return (
        <DashboardCard
            title="Monthly Trend"
            subtitle="Click a month to see its records"
            loading={loading}
            isEmpty={rows.length === 0}
        >
            <Chart options={percentChart.options} series={percentChart.series} type="line" height={240} />
            <div className="fw-600 small text-muted mt-2">Challan amount by act</div>
            <Chart options={amountChart.options} series={amountChart.series} type="bar" height={240} />
        </DashboardCard>
    );
};

export default TrendWidget;
