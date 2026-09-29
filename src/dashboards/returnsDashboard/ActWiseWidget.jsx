import React from "react";
import Chart from "react-apexcharts";
import DashboardCard from "../common/DashboardCard";
import { formatPercent } from "../common/dashboardUtils";

// RT-6: filing outcome per act (transactions)
const ActWiseWidget = ({ selection, loading, actWise, onDrill }) => {
    const rows = (actWise || []).filter((r) => r.total > 0);

    const chart = {
        series: [
            { name: "Filed on time", data: rows.map((r) => r.on_time) },
            { name: "Filed late", data: rows.map((r) => r.late) },
            { name: "Not filed", data: rows.map((r) => r.not_filed) },
        ],
        options: {
            chart: {
                type: "bar",
                stacked: true,
                toolbar: { show: false },
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        const act = rows[dataPointIndex]?.act;
                        if (act) onDrill({ act: [act] });
                    },
                },
            },
            colors: ["#14b8a6", "#fbbf24", "#f87171"],
            states: { active: { filter: { type: "none" } } },
            plotOptions: {
                bar: {
                    horizontal: true,
                    barHeight: "60%",
                    dataLabels: { total: { enabled: true, style: { fontSize: "12px", fontWeight: 700 } } },
                },
            },
            dataLabels: { enabled: false },
            xaxis: { categories: rows.map((r) => r.act) },
            yaxis: { labels: { maxWidth: 240 } },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (val, { seriesIndex, dataPointIndex }) => {
                        const r = rows[dataPointIndex];
                        return seriesIndex === 0 ? `${val} (compliance ${formatPercent(r?.compliance_rate)})` : `${val}`;
                    },
                },
            },
            legend: { position: "top", horizontalAlign: "left" },
        },
    };

    return (
        <DashboardCard
            selection={selection}
            title="Act-wise Filings"
            subtitle="Click an act to filter to it"
            loading={loading}
            isEmpty={rows.length === 0}
        >
            <Chart options={chart.options} series={chart.series} type="bar" height={Math.max(260, rows.length * 50 + 70)} />
        </DashboardCard>
    );
};

export default ActWiseWidget;
