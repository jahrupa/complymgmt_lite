import React from "react";
import Chart from "react-apexcharts";
import { ArrowUpRight } from "lucide-react";
import DashboardCard from "../common/DashboardCard";
import { DebouncedSearch, MultiFilter, PeriodFilter } from "../common/FilterControls";
import { formatPercent, locationOptionsFor } from "../common/dashboardUtils";
import { MODULES, MODULE_ORDER, modulesAvailableText, periodLabel, scoreBand } from "./cockpitUtils";

/* ---------- filters ---------- */

// State, location, month range and search. The range is kept valid (from <= to) as it is picked.
export const CockpitFilterBar = ({ filterOptions, filters, onChange, onClear }) => {
    const opts = filterOptions || {};
    const set = (key) => (value) => onChange({ [key]: value });

    const onPeriodChange = (patch) => {
        const next = { month_from: filters.month_from, month_to: filters.month_to, ...patch };
        if (next.month_from && next.month_to && next.month_from > next.month_to) {
            // keep the end the user just picked and move the other one to match
            if ("month_from" in patch) next.month_to = next.month_from;
            else next.month_from = next.month_to;
        }
        onChange(next);
    };

    return (
        <div className="dw-filter-bar">
            <div className="d-flex flex-wrap gap-2 align-items-center">
                <PeriodFilter months={opts.months} monthFrom={filters.month_from} monthTo={filters.month_to} onChange={onPeriodChange} />
                <MultiFilter label="State" value={filters.state} options={opts.states} onChange={set("state")} />
                <MultiFilter
                    label="Location"
                    value={filters.location}
                    options={locationOptionsFor(opts.locations, filters.state)}
                    onChange={set("location")}
                    width={220}
                />
                <DebouncedSearch value={filters.search} onChange={set("search")} placeholder="Search every module…" width={300} />
                <button className="btn btn-outline-secondary btn-sm ms-auto" onClick={onClear}>
                    Reset filters
                </button>
            </div>
            <div className="small text-muted mt-2">
                Month range: challans by wage month, registers by register month, returns by due month; licenses switch to
                coverage in the period. No range shows current status.
            </div>
        </div>
    );
};

/* ---------- score pieces ---------- */

// Score with its band colour, or "No data" for an unavailable module
export const ScoreCell = ({ score }) => {
    if (score === null || score === undefined) return <span className="text-muted small">No data</span>;
    const band = scoreBand(score);
    return (
        <span className="dw-badge" style={{ background: band.soft, color: band.color }}>
            {formatPercent(score)}
        </span>
    );
};

// CC-6 / CCBC-1: overall score gauge, labelled with how many modules it averages
export const OverallScoreCard = ({ loading, summary, title }) => {
    const available = summary?.modules_available ?? 0;
    const score = available ? summary.overall_score : null;
    const band = scoreBand(score);
    const period = periodLabel(summary?.period);

    const gauge = {
        series: [score ?? 0],
        options: {
            chart: { type: "radialBar", sparkline: { enabled: true } },
            colors: [band.color],
            plotOptions: {
                radialBar: {
                    startAngle: -110,
                    endAngle: 110,
                    hollow: { size: "62%" },
                    track: { background: "#f3f4f6" },
                    dataLabels: {
                        name: { show: true, offsetY: 26, fontSize: "13px", color: "#6b7280" },
                        value: {
                            offsetY: -12,
                            fontSize: "30px",
                            fontWeight: 700,
                            formatter: () => (score === null ? "No data" : formatPercent(score)),
                        },
                    },
                },
            },
            labels: [modulesAvailableText(available)],
        },
    };

    return (
        <DashboardCard
            title={title}
            subtitle={period ? `Period: ${period}` : "Current status (no month range)"}
            loading={loading}
            isEmpty={!summary?.modules}
            minHeight={220}
        >
            <Chart options={gauge.options} series={gauge.series} type="radialBar" height={250} />
            <div className="text-center small text-muted">
                Plain average of the modules that have data; modules without data are not counted as 0.
            </div>
        </DashboardCard>
    );
};

/**
 * CC-2…5 / CCBC-2…5: one module's score. Copy is "completed of total unit completed_as"; the
 * license wording comes from the API because it changes with the month range.
 */
export const ModuleTile = ({ loading, module, onOpen }) => {
    const meta = MODULES[module?.module] || {};
    const available = Boolean(module?.available);
    const band = scoreBand(available ? module.score : null);

    return (
        <DashboardCard
            title={module?.label || meta.label}
            loading={loading}
            isEmpty={!module}
            minHeight={160}
            actions={
                <button
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 py-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen(meta.tab);
                    }}
                    title={`Open the ${meta.label} dashboard with these filters`}
                >
                    Open <ArrowUpRight size={14} />
                </button>
            }
        >
            {available ? (
                <>
                    <div className="d-flex align-items-baseline gap-2">
                        <span style={{ fontSize: 30, fontWeight: 700, color: band.color }}>{formatPercent(module.score)}</span>
                        <span className="dw-badge" style={{ background: band.soft, color: band.color }}>{band.label}</span>
                    </div>
                    <div className="small mt-1">
                        {module.completed} of {module.total} {module.unit} {module.completed_as}
                    </div>
                    <div className="dw-progress-track mt-2" style={{ height: 8 }}>
                        <span style={{ width: `${Math.min(100, module.score)}%`, background: band.color }} />
                    </div>
                    <div className="d-flex flex-wrap gap-2 mt-3 small">
                        {module.exceptions > 0 && <span className="dw-badge exception">{module.exceptions} need attention</span>}
                        {module.details &&
                            meta.details?.(module.details).map(([label, value]) => (
                                <span key={label} className="dw-badge pending">
                                    {label}: {value ?? 0}
                                </span>
                            ))}
                    </div>
                </>
            ) : (
                <div className="py-3">
                    <div style={{ fontSize: 26, fontWeight: 700, color: "#9ca3af" }}>No data</div>
                    <div className="small text-muted">
                        No {module?.unit || "items"} for the selected filters; not counted in the overall score.
                    </div>
                </div>
            )}
        </DashboardCard>
    );
};

// CC-7 / CCBC-7: completed vs pending per module; unavailable modules are labelled, not zeroed
export const CompletionStatusCard = ({ loading, modules, onOpen }) => {
    const rows = MODULE_ORDER.map((key) => (modules || []).find((m) => m.module === key)).filter(Boolean);
    const categories = rows.map((m) => (m.available ? m.label : `${m.label} (no data)`));

    const chart = {
        series: [
            { name: "Completed", data: rows.map((m) => (m.available ? m.completed : 0)) },
            { name: "Pending", data: rows.map((m) => (m.available ? m.pending : 0)) },
        ],
        options: {
            chart: {
                type: "bar",
                stacked: true,
                stackType: "100%",
                toolbar: { show: false },
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        const tab = MODULES[rows[dataPointIndex]?.module]?.tab;
                        if (tab) onOpen(tab);
                    },
                },
            },
            colors: ["#16a34a", "#f87171"],
            states: { active: { filter: { type: "none" } } },
            plotOptions: { bar: { horizontal: true, barHeight: "55%" } },
            dataLabels: { enabled: true, formatter: (val, { seriesIndex, dataPointIndex, w }) => w.config.series[seriesIndex].data[dataPointIndex] || "" },
            xaxis: { categories, labels: { formatter: (v) => `${Math.round(v)}%` } },
            tooltip: {
                y: {
                    formatter: (val, { dataPointIndex, seriesIndex }) => {
                        const m = rows[dataPointIndex];
                        if (!m?.available) return "No data";
                        return `${seriesIndex === 0 ? m.completed : m.pending} of ${m.total} ${m.unit}`;
                    },
                },
            },
            legend: { position: "top", horizontalAlign: "left" },
        },
    };

    return (
        <DashboardCard
            title="Completion Status Across All Modules"
            subtitle="Completed vs pending in each module; click a bar to open that dashboard"
            loading={loading}
            isEmpty={!rows.length}
        >
            <Chart options={chart.options} series={chart.series} type="bar" height={260} />
        </DashboardCard>
    );
};
