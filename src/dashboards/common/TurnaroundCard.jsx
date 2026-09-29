import React from "react";
import Chart from "react-apexcharts";
import DashboardCard from "./DashboardCard";

const DELAY_COLORS = ["#14b8a6", "#fbbf24", "#fb923c", "#f87171", "#dc2626", "#6b7280"];

/**
 * Process turnaround: average days per stage plus a delay bucket chart.
 * `delays` are { name, count } in the backend's fixed order; `onDelayClick(index, count)` drills down.
 */
const TurnaroundCard = ({ selection, loading, stages = [], endToEnd, delays = [], delaysTitle, onDelayClick }) => {
    const anomalyStages = [...stages, ...(endToEnd?.anomalies ? [endToEnd] : [])].filter((s) => s.anomalies > 0);

    const stageChart = {
        series: [{ name: "Avg days", data: stages.map((s) => s.avg_days) }],
        options: {
            chart: { type: "bar", toolbar: { show: false } },
            colors: ["#14b8a6"],
            states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } },
            plotOptions: { bar: { horizontal: true, barHeight: "55%" } },
            dataLabels: { enabled: true, formatter: (v) => `${v}d` },
            xaxis: { categories: stages.map((s) => s.label), title: { text: "Average days" } },
            yaxis: { labels: { maxWidth: 260 } },
            tooltip: {
                y: {
                    formatter: (val, { dataPointIndex }) => {
                        const s = stages[dataPointIndex];
                        return `${val} days avg · min ${s?.min_days ?? 0} · max ${s?.max_days ?? 0} · ${s?.count ?? 0} rows`;
                    },
                },
            },
        },
    };

    const delayChart = {
        series: [{ name: "Rows", data: delays.map((d) => d.count) }],
        options: {
            chart: {
                type: "bar",
                toolbar: { show: false },
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        onDelayClick(dataPointIndex, delays.length);
                    },
                },
            },
            colors: DELAY_COLORS,
            states: { active: { filter: { type: "none" } } },
            plotOptions: { bar: { distributed: true, columnWidth: "50%" } },
            legend: { show: false },
            xaxis: { categories: delays.map((d) => d.name) },
        },
    };

    return (
        <DashboardCard
            selection={selection}
            title="Turnaround Time"
            subtitle={
                endToEnd?.count
                    ? `${endToEnd.label}: ${endToEnd.avg_days} days on average (min ${endToEnd.min_days}, max ${endToEnd.max_days})`
                    : ""
            }
            loading={loading}
            isEmpty={stages.length === 0 && delays.length === 0}
        >
            <div className="row">
                <div className="col-lg-7">
                    <div className="fw-600 small text-muted">Average days per stage</div>
                    <Chart options={stageChart.options} series={stageChart.series} type="bar" height={300} />
                    {anomalyStages.length > 0 && (
                        <div className="text-muted small">
                            Excluded because dates are out of order:{" "}
                            {anomalyStages.map((s) => `${s.label} (${s.anomalies})`).join(", ")}
                        </div>
                    )}
                </div>
                <div className="col-lg-5">
                    <div className="fw-600 small text-muted">{delaysTitle}</div>
                    <Chart options={delayChart.options} series={delayChart.series} type="bar" height={300} />
                </div>
            </div>
        </DashboardCard>
    );
};

export default TurnaroundCard;
