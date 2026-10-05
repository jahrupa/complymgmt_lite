import React from "react";
import Chart from "react-apexcharts";
import DashboardCard from "../common/DashboardCard";
import { VALIDITY, VALIDITY_ORDER } from "./licenseUtils";

// LC-6: license requests per month split by current validity, with average days to grant
const TrendWidget = ({ loading, trend, onDrill }) => {
    // "Unspecified" (request_month "") has no place on a time axis
    const rows = (trend || []).filter((r) => r.request_month);

    // Only validity states that occur get a series, so the legend stays short
    const validities = VALIDITY_ORDER.filter((key) => rows.some((r) => r[key] > 0));
    const maxRequests = Math.max(...rows.map((r) => r.total || 0), 1);

    const chart = {
        series: [
            ...validities.map((key) => ({ name: VALIDITY[key].label, type: "column", data: rows.map((r) => r[key] || 0) })),
            { name: "Avg days to grant", type: "line", data: rows.map((r) => r.avg_days_to_grant ?? null) },
        ],
        options: {
            chart: {
                type: "line",
                stacked: true,
                toolbar: { show: false },
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        const month = rows[dataPointIndex]?.request_month;
                        if (month) onDrill({ request_month_from: month, request_month_to: month });
                    },
                },
            },
            colors: [...validities.map((key) => VALIDITY[key].color), "#111827"],
            states: { active: { filter: { type: "none" } } },
            stroke: { width: [...validities.map(() => 0), 3] },
            markers: { size: [...validities.map(() => 0), 5] },
            plotOptions: { bar: { columnWidth: "50%" } },
            dataLabels: { enabled: false },
            xaxis: { categories: rows.map((r) => r.label) },
            yaxis: [
                {
                    // one axis shared by every validity series
                    seriesName: validities.map((key) => VALIDITY[key].label),
                    min: 0,
                    tickAmount: Math.min(maxRequests, 5),
                    title: { text: "Requests" },
                    labels: { formatter: (v) => Math.round(v) },
                },
                { seriesName: "Avg days to grant", opposite: true, min: 0, title: { text: "Avg days to grant" }, labels: { formatter: (v) => Math.round(v) } },
            ],
            tooltip: {
                shared: true,
                intersect: false,
                y: { formatter: (val, { seriesIndex }) => (seriesIndex === validities.length ? `${val ?? "–"} days` : val) },
            },
            legend: { position: "top", horizontalAlign: "left" },
        },
    };

    return (
        <DashboardCard
            title="Requests Over Time"
            subtitle="By client request month; line: average days from request to validity start"
            loading={loading}
            isEmpty={rows.length === 0}
        >
            <Chart options={chart.options} series={chart.series} type="line" height={340} />
        </DashboardCard>
    );
};

export default TrendWidget;
