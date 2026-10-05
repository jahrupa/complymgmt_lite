import React from "react";
import Chart from "react-apexcharts";
import DashboardCard from "../common/DashboardCard";
import { VALIDITY } from "./licenseUtils";

// A month overlaps the expiring window when it starts on or before today + window days
const startsWithinWindow = (month, windowDays) => {
    const [y, m] = month.split("-").map(Number);
    const windowEnd = new Date();
    windowEnd.setDate(windowEnd.getDate() + windowDays);
    return new Date(y, m - 1, 1) <= windowEnd;
};

// LC-5: active + expiring licenses by end month from this month, for renewal planning
const ExpiryTimelineWidget = ({ loading, timeline, expiringWindow = 60, onDrill }) => {
    const t = timeline || {};
    const months = t.timeline || [];
    const total = months.reduce((sum, m) => sum + m.count, 0);

    const chart = {
        series: [{ name: "Licenses ending", data: months.map((m) => m.count) }],
        options: {
            chart: {
                type: "bar",
                toolbar: { show: false },
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        const month = months[dataPointIndex]?.month;
                        if (month) onDrill({ expiry_month_from: month, expiry_month_to: month });
                    },
                },
            },
            // Months overlapping the expiring window get the expiring colour
            colors: [
                ({ dataPointIndex }) =>
                    months[dataPointIndex] && startsWithinWindow(months[dataPointIndex].month, expiringWindow)
                        ? VALIDITY.expiring.color
                        : VALIDITY.active.color,
            ],
            states: { active: { filter: { type: "none" } } },
            plotOptions: { bar: { columnWidth: "55%" } },
            dataLabels: { enabled: true, formatter: (v) => (v ? v : "") },
            xaxis: { categories: months.map((m) => m.label) },
            // whole-number ticks; small counts would otherwise repeat after rounding
            yaxis: { min: 0, tickAmount: Math.min(Math.max(...months.map((m) => m.count), 1), 5), labels: { formatter: (v) => Math.round(v) } },
            tooltip: {
                y: {
                    formatter: (val, { dataPointIndex }) => {
                        const types = months[dataPointIndex]?.license_types || [];
                        return types.length ? `${val} (${types.join(", ")})` : `${val}`;
                    },
                },
            },
        },
    };

    const callouts = [
        { key: "expired", label: "Already expired", count: t.expired, color: VALIDITY.expired.color, drill: { validity: ["expired"] } },
        { key: "later", label: "Ending later", count: t.later },
        { key: "lifetime", label: "Lifetime", count: t.lifetime, color: VALIDITY.lifetime.color, drill: { validity: ["lifetime"] } },
        { key: "in_progress", label: "No end date yet", count: t.in_progress, color: VALIDITY.in_progress.color, drill: { validity: ["in_progress"] } },
    ];

    return (
        <DashboardCard
            title="Expiry Timeline"
            subtitle={`Active and expiring licenses by end month (amber: within ${expiringWindow} days); click a month to see them`}
            loading={loading}
            isEmpty={total === 0 && !t.expired && !t.later && !t.lifetime && !t.in_progress}
        >
            <div className="d-flex flex-wrap gap-2 mb-2">
                {callouts.map((c) => (
                    <span
                        key={c.key}
                        className={`dw-badge ${c.drill && c.count ? "clickable" : ""}`}
                        style={c.color && c.count ? { background: c.color, color: "white" } : { background: "#f3f4f6", color: "#374151" }}
                        onClick={
                            c.drill && c.count
                                ? (e) => {
                                      e.stopPropagation();
                                      onDrill(c.drill);
                                  }
                                : undefined
                        }
                    >
                        {c.label}: {c.count ?? 0}
                    </span>
                ))}
            </div>
            <Chart options={chart.options} series={chart.series} type="bar" height={300} />
        </DashboardCard>
    );
};

export default ExpiryTimelineWidget;
