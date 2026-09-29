import React, { useCallback, useState } from "react";
import Chart from "react-apexcharts";
// cockpitComplinceByCompany.css also holds the global .chart-card / .selected-card styles
import "../../style/cockpitComplinceByCompany.css";
import "../../style/dashboardWidgets.css";
import { fetchCockpitClients, fetchCockpitSummary } from "../../api/service";
import Snackbars from "../../component/Snackbars";
import { decryptData } from "../../page/utils/encrypt";
import { useDashboardData } from "../common/useDashboard";
import DashboardCard from "../common/DashboardCard";
import AccessState from "../common/AccessState";
import { formatPercent } from "../common/dashboardUtils";
import { CockpitFilterBar, CompletionStatusCard, ModuleTile, OverallScoreCard } from "./CockpitWidgets";
import CompanyAttentionWidget from "./CompanyAttentionWidget";
import { useCockpit } from "./useCockpit";
import { MODULES, MODULE_ORDER, modulesAvailableText, periodLabel, scoreBand } from "./cockpitUtils";

// Tiles in the order of their widget ids: CCBC-2 Licenses, CCBC-3 Registers, CCBC-4 Returns, CCBC-5 Challans
const TILE_ORDER = ["license", "registers", "returns", "challan"];

/**
 * Compliance Cockpit for one company (company_name on every call). Module tiles link to the module
 * dashboards with the company and month range.
 */
const CockpitComplinceByCompany = ({
    companyName,
    setSelectedCompany,
    current,
    selectedCharts,
    setSelectedCharts,
    isActive,
    openTab,
}) => {
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        message: "",
        severityType: "",
    });
    const showSnackbar = useCallback(
        (message, severityType) => setIsSnackbarsOpen((prev) => ({ ...prev, open: true, message, severityType })),
        []
    );

    const { filters, updateFilters, resetFilters, ready, filterOptions, optionsAccessError, params, openModule, loadError, setLoadError } =
        useCockpit({ selectedCompany: companyName, isActive, openTab });

    const { data, loading, accessError: dataAccessError } = useDashboardData({
        fetchers: {
            summary: { fetch: fetchCockpitSummary, fallback: {} },
            clients: { fetch: (p) => fetchCockpitClients(p.company_name), fallback: [] },
        },
        params,
        enabled: ready,
        isCompanyMode: true,
        onError: setLoadError,
    });
    const accessError = optionsAccessError || dataAccessError;

    /* ---------- widget selection (same rules as the other dashboards) ---------- */

    const userRole = decryptData(localStorage.getItem("user_role"));
    const canSelect = userRole === "Admin" || userRole === "Super-Admin";

    const toggleChartSelection = (chartId) => {
        if (!current?.user_name) {
            showSnackbar("First you need to select a user", "warning");
            return;
        }
        setSelectedCharts((prev) => (prev.includes(chartId) ? prev.filter((id) => id !== chartId) : [...prev, chartId]));
    };

    const cardSelection = (id) => ({
        id,
        canSelect,
        selected: selectedCharts.includes(id),
        disabled: !current?.user_name,
        onSelect: (chartId) => canSelect && toggleChartSelection(chartId),
        onToggle: toggleChartSelection,
    });

    /* ---------- data ---------- */

    const summary = data.summary || {};
    const modules = summary.modules || [];
    const moduleByKey = Object.fromEntries(modules.map((m) => [m.module, m]));
    const period = periodLabel(summary.period);
    const client = (data.clients || [])[0];

    // CCBC-6: the four module scores; unavailable modules are labelled "No data" rather than 0
    const ordered = MODULE_ORDER.map((key) => moduleByKey[key]).filter(Boolean);
    const scoreChart = {
        series: [{ name: "Score", data: ordered.map((m) => (m.available ? m.score : 0)) }],
        options: {
            chart: {
                type: "bar",
                toolbar: { show: false },
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        const tab = MODULES[ordered[dataPointIndex]?.module]?.tab;
                        if (tab) openModule(tab);
                    },
                },
            },
            colors: ordered.map((m) => scoreBand(m.available ? m.score : null).color),
            plotOptions: { bar: { distributed: true, columnWidth: "50%", dataLabels: { position: "top" } } },
            legend: { show: false },
            dataLabels: {
                enabled: true,
                formatter: (val, { dataPointIndex }) => (ordered[dataPointIndex]?.available ? `${Math.round(val)}%` : "No data"),
                style: { colors: ["#374151"] },
                offsetY: -18,
            },
            xaxis: { categories: ordered.map((m) => m.label) },
            yaxis: { min: 0, max: 100, labels: { formatter: (v) => `${Math.round(v)}%` } },
            tooltip: {
                y: {
                    formatter: (val, { dataPointIndex }) => {
                        const m = ordered[dataPointIndex];
                        return m?.available ? `${formatPercent(val)} · ${m.completed} of ${m.total} ${m.unit} ${m.completed_as}` : "No data";
                    },
                },
            },
        },
    };

    const totals = ordered
        .filter((m) => m.available)
        .reduce((acc, m) => ({ total: acc.total + m.total, completed: acc.completed + m.completed, pending: acc.pending + m.pending }), {
            total: 0,
            completed: 0,
            pending: 0,
        });

    return (
        <div>
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />

            <div className="d-flex flex-wrap align-items-center gap-2 mb-2 small">
                <span className="text-muted">Company-wise view:</span>
                <span className="fw-600">{companyName}</span>
                <span className="text-muted">· {period || "Current status"}</span>
                <button className="btn btn-link btn-sm p-0" onClick={() => setSelectedCompany("")}>
                    View all companies
                </button>
            </div>

            {accessError ? (
                <AccessState status={accessError} companyName={companyName} dataLabel="compliance data" onShowAll={() => setSelectedCompany("")} />
            ) : (
                <>
                    <CockpitFilterBar filterOptions={filterOptions} filters={filters} onChange={updateFilters} onClear={resetFilters} />

                    {loadError && <div className="alert alert-danger">{loadError}</div>}

                    <div className="charts-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
                        <OverallScoreCard selection={cardSelection("ccbc-1")} loading={loading} summary={data.summary} title="Compliance Dashboard" />
                        <DashboardCard
                            selection={cardSelection("ccbc-6")}
                            title="Compliance Score Distribution"
                            subtitle="Score of each module; click a bar to open that dashboard"
                            loading={loading}
                            isEmpty={!ordered.length}
                            minHeight={220}
                        >
                            <Chart options={scoreChart.options} series={scoreChart.series} type="bar" height={270} />
                        </DashboardCard>
                    </div>

                    <div className="charts-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                        {TILE_ORDER.map((key) => (
                            <ModuleTile
                                key={key}
                                selection={cardSelection(MODULES[key].companyWidgetId)}
                                loading={loading}
                                module={moduleByKey[key]}
                                onOpen={openModule}
                            />
                        ))}
                    </div>

                    <CompletionStatusCard selection={cardSelection("ccbc-7")} loading={loading} modules={modules} onOpen={openModule} />

                    {ready && (
                        <CompanyAttentionWidget
                            selection={cardSelection("ccbc-8")}
                            enabled={ready}
                            params={params}
                            companyName={companyName}
                            onOpenModule={openModule}
                        />
                    )}

                    <DashboardCard
                        selection={cardSelection("ccbc-9")}
                        title="Summary Statistics"
                        subtitle={`Totals across modules with data (${modulesAvailableText(summary.modules_available)})`}
                        loading={loading}
                        isEmpty={!summary.modules}
                        minHeight={160}
                    >
                        <div className="dw-kpi-grid">
                            {[
                                ["Overall Score", summary.modules_available ? formatPercent(summary.overall_score) : "No data"],
                                ["Items Tracked", totals.total],
                                ["Completed", totals.completed],
                                ["Pending", totals.pending],
                                ["Needs Attention", summary.exceptions ?? 0],
                                ["Locations", client ? client.locations?.length ?? 0 : "–"],
                                ["States", client ? client.states?.length ?? 0 : "–"],
                            ].map(([label, value]) => (
                                <div key={label} className="dw-kpi">
                                    <div className="dw-kpi-label">{label}</div>
                                    <div className="dw-kpi-value">{value}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 small">
                            {client ? (
                                <>
                                    <div className="mb-1">
                                        <span className="text-muted">Modules subscribed: </span>
                                        {client.modules_subscribed?.length
                                            ? client.modules_subscribed.map((m) => (
                                                  <span key={m} className="dw-badge neutral me-1">{m}</span>
                                              ))
                                            : "none"}
                                    </div>
                                    <div className="text-muted">
                                        {client.states?.join(", ")}
                                        {client.locations?.length
                                            ? ` · ${client.locations.map((l) => l.location).filter(Boolean).join(", ")}`
                                            : ""}
                                    </div>
                                </>
                            ) : (
                                <span className="text-muted">No client master record for this company.</span>
                            )}
                        </div>
                    </DashboardCard>
                </>
            )}
        </div>
    );
};

export default CockpitComplinceByCompany;
