import React from "react";
import Chart from "react-apexcharts";
import { Tooltip } from "@mui/material";
import DashboardCard from "../common/DashboardCard";
import { formatPercent, periodLabel } from "../common/dashboardUtils";
import { VALIDITY, validityLabel } from "./licenseUtils";

const Tile = ({ label, value, hint, tone, drill, onDrill }) => (
    <Tooltip title={hint || ""}>
        <div
            className={`dw-kpi ${drill ? "clickable" : ""}`}
            onClick={
                drill
                    ? (e) => {
                          e.stopPropagation();
                          onDrill(drill);
                      }
                    : undefined
            }
        >
            <div className="dw-kpi-label">{label}</div>
            {/* tone is a class ("warning", "danger") or a validity colour */}
            <div
                className={`dw-kpi-value ${tone && !tone.startsWith("#") ? tone : ""}`}
                style={tone?.startsWith("#") ? { color: tone } : undefined}
            >
                {value}
            </div>
        </div>
    </Tooltip>
);

// LC-1: KPI tiles, validity donut, application type bars and attention flags
const SummaryWidget = ({ selection, loading, summary, onDrill }) => {
    const s = summary || {};
    const windowDays = s.expiring_window ?? 60;
    const byValidity = (s.by_validity || []).filter((v) => v.count > 0);
    const byApplication = s.by_application_type || [];
    const notSurrendered = (s.total || 0) - (s.surrendered || 0);

    const tiles = [
        {
            label: "Valid",
            value: notSurrendered > 0 ? formatPercent(s.valid_percent) : "–",
            hint: `${s.valid ?? 0} of ${notSurrendered} licenses not surrendered are active, expiring or lifetime`,
        },
        // With a month range: licenses whose validity started in the range or is still valid at its end
        ...(s.period_coverage
            ? [
                  {
                      label: `Coverage for ${periodLabel(s.period_coverage)}`,
                      value: formatPercent(s.period_coverage.coverage_percent),
                      hint: `${s.period_coverage.covered} of ${s.period_coverage.applicable} licenses (excl. surrendered) covered in the period; ${s.period_coverage.not_covered} not covered. The period doesn't narrow the license list.`,
                  },
              ]
            : []),
        { label: "Active", value: s.active ?? 0, tone: VALIDITY.active.color, drill: s.active ? { validity: ["active"] } : null, hint: `Valid for more than ${windowDays} days` },
        {
            label: `Expiring in ${windowDays} days`,
            value: s.expiring ?? 0,
            tone: s.expiring ? VALIDITY.expiring.color : "",
            drill: s.expiring ? { validity: ["expiring"] } : null,
            hint: `Ends within the next ${windowDays} days`,
        },
        { label: "Expired", value: s.expired ?? 0, tone: s.expired ? VALIDITY.expired.color : "", drill: s.expired ? { validity: ["expired"] } : null, hint: "End date has passed" },
        {
            label: "In Progress",
            value: s.in_progress ?? 0,
            tone: s.in_progress ? VALIDITY.in_progress.color : "",
            drill: s.in_progress ? { validity: ["in_progress"] } : null,
            hint: "No end date yet (application in process)",
        },
        {
            label: "Exceptions",
            value: s.exceptions ?? 0,
            tone: s.exceptions ? "warning" : "",
            drill: s.exceptions ? { exceptions_only: "true" } : null,
            hint: "Expired, expiring, SLA breached, follow-up overdue, document not uploaded, or billing not triggered",
        },
    ];

    const flags = [
        { label: "SLA breach", count: s.sla_breach, drill: { sla_breach: "Y" } },
        { label: "Follow-up overdue", count: s.follow_up_overdue, drill: { follow_up_overdue: "true" } },
        { label: "Document not uploaded", count: s.document_missing, drill: { completed: "Y", document_uploaded: "N" } },
        { label: "Billing pending", count: s.billing_pending, drill: { billing_pending: "true" } },
    ];

    const donut = {
        series: byValidity.map((v) => v.count),
        options: {
            chart: {
                type: "donut",
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        const name = byValidity[dataPointIndex]?.name;
                        if (name) onDrill({ validity: [name] });
                    },
                },
            },
            colors: byValidity.map((v) => VALIDITY[v.name]?.color || "#d1d5db"),
            labels: byValidity.map((v) => validityLabel(v.name)),
            legend: { position: "bottom" },
            dataLabels: { enabled: false },
            states: { active: { filter: { type: "none" } } },
            plotOptions: {
                pie: { donut: { size: "65%", labels: { show: true, total: { show: true, label: "Licenses", formatter: () => s.total ?? 0 } } } },
            },
        },
    };

    const appChart = {
        series: [{ name: "Licenses", data: byApplication.map((a) => a.count) }],
        options: {
            chart: {
                type: "bar",
                toolbar: { show: false },
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        const name = byApplication[dataPointIndex]?.name;
                        if (name) onDrill({ application_type: [name] });
                    },
                },
            },
            colors: ["#6366f1"],
            states: { active: { filter: { type: "none" } } },
            plotOptions: { bar: { horizontal: true, barHeight: "55%" } },
            dataLabels: { enabled: true },
            xaxis: { categories: byApplication.map((a) => a.name) },
        },
    };

    const scope = [
        s.companies > 1 ? `${s.companies} companies` : null,
        `${s.locations ?? 0} locations`,
        `${s.license_types ?? 0} license types`,
        `${s.completed ?? 0} completed · ${s.open ?? 0} open`,
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <DashboardCard
            selection={selection}
            title="License Summary"
            subtitle={s.total ? scope : ""}
            loading={loading}
            isEmpty={!s.total}
            minHeight={200}
            actions={
                s.data_issues > 0 && (
                    <Tooltip title="Dates entered inconsistently (out of order, completed without validity, or ends before it starts). This is data quality. Click to view these rows.">
                        <span className="dw-badge data-issue clickable" onClick={() => onDrill({ data_issues_only: "true" })}>
                            Data quality: {s.data_issues} rows with data issues
                        </span>
                    </Tooltip>
                )
            }
        >
            <div className="row g-3 align-items-center">
                <div className="col-lg-6">
                    <div className="dw-kpi-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                        {tiles.map((t) => (
                            <Tile key={t.label} {...t} onDrill={onDrill} />
                        ))}
                    </div>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                        {flags.map((f) => (
                            <span
                                key={f.label}
                                className={`dw-badge ${f.count ? "exception clickable" : "pending"}`}
                                onClick={
                                    f.count
                                        ? (e) => {
                                              e.stopPropagation();
                                              onDrill(f.drill);
                                          }
                                        : undefined
                                }
                            >
                                {f.label}: {f.count ?? 0}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="fw-600 small text-muted">Validity</div>
                    {byValidity.length > 0 && <Chart options={donut.options} series={donut.series} type="donut" height={240} />}
                </div>
                <div className="col-lg-3">
                    <div className="fw-600 small text-muted">Application type</div>
                    <Chart options={appChart.options} series={appChart.series} type="bar" height={Math.max(160, byApplication.length * 44 + 50)} />
                </div>
            </div>
        </DashboardCard>
    );
};

export default SummaryWidget;
