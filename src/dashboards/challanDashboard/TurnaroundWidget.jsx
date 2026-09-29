import React from "react";
import Chart from "react-apexcharts";
import ChallanCard from "./ChallanCard";

const DELAY_COLORS = ["#14b8a6", "#fbbf24", "#fb923c", "#f87171", "#dc2626", "#6b7280"];

// payment_delays comes in a fixed order: on/before due, 1-3, 4-7, 8-15, >15 days late, Not paid
const delayDrill = (index, total) => {
    if (index === 0) return { paid_on_time: "Y", overdue: "" };
    if (index === total - 1) return { paid_on_time: "", overdue: "true" };
    return { paid_on_time: "N", overdue: "" };
};

// CH-5: average days per process stage and payment delay buckets
const TurnaroundWidget = ({ selection, loading, turnaround, onDrill }) => {
    const stages = turnaround?.stages || [];
    const endToEnd = turnaround?.end_to_end;
    const delays = turnaround?.payment_delays || [];
    const anomalyStages = stages.filter((s) => s.anomalies > 0);

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
                        return `${val} days avg · min ${s?.min_days ?? 0} · max ${s?.max_days ?? 0} · ${s?.count ?? 0} challans`;
                    },
                },
            },
        },
    };

    const delayChart = {
        series: [{ name: "Challans", data: delays.map((d) => d.count) }],
        options: {
            chart: {
                type: "bar",
                toolbar: { show: false },
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        onDrill(delayDrill(dataPointIndex, delays.length));
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
        <ChallanCard
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
                    {(anomalyStages.length > 0 || endToEnd?.anomalies > 0) && (
                        <div className="text-muted small">
                            Excluded because dates are out of order:{" "}
                            {[...anomalyStages, ...(endToEnd?.anomalies ? [endToEnd] : [])]
                                .map((s) => `${s.label} (${s.anomalies})`)
                                .join(", ")}
                        </div>
                    )}
                </div>
                <div className="col-lg-5">
                    <div className="fw-600 small text-muted">Payment timing vs due date</div>
                    <Chart options={delayChart.options} series={delayChart.series} type="bar" height={300} />
                </div>
            </div>
        </ChallanCard>
    );
};

export default TurnaroundWidget;
