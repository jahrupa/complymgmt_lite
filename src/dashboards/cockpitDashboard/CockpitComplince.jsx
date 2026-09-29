import React, { useCallback, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
// cockpitComplinceByCompany.css also holds the global .chart-card / .selected-card styles
import "../../style/cockpitComplinceByCompany.css";
import "../../style/dashboardWidgets.css";
import { fetchCockpitClients, fetchCockpitCompanyWise, fetchCockpitStateWise, fetchCockpitSummary } from "../../api/service";
import Snackbars from "../../component/Snackbars";
import { decryptData } from "../../page/utils/encrypt";
import { useDashboardData } from "../common/useDashboard";
import DashboardCard from "../common/DashboardCard";
import GroupTableCard from "../common/GroupTableCard";
import { CockpitFilterBar, CompletionStatusCard, ModuleTile, OverallScoreCard, ScoreCell } from "./CockpitWidgets";
import { useCockpit } from "./useCockpit";
import { MODULES, MODULE_ORDER, distributionColor, periodLabel } from "./cockpitUtils";

// Tiles in the order of their widget ids: CC-2 Licenses, CC-3 Registers, CC-4 Returns, CC-5 Challans
const TILE_ORDER = ["license", "registers", "returns", "challan"];

const moduleScoreColumn = (key) => ({
    headerName: MODULES[key].label,
    colId: key,
    minWidth: 120,
    // unavailable modules sort below every score
    valueGetter: (p) => p.data?.modules?.[key]?.score ?? -1,
    cellRenderer: (p) => <ScoreCell score={p.data?.modules?.[key] ? p.data.modules[key].score : null} />,
    tooltipValueGetter: (p) => {
        const m = p.data?.modules?.[key];
        return m ? `${m.completed} of ${m.total} · ${m.exceptions} need attention` : "No data for this module";
    },
});

const overallColumn = {
    headerName: "Overall",
    field: "overall_score",
    minWidth: 150,
    sort: "asc",
    cellRenderer: (p) => (
        <span className="d-inline-flex align-items-center gap-1">
            <ScoreCell score={p.data?.modules_available ? p.value : null} />
            <span className="text-muted small">of {p.data?.modules_available ?? 0}</span>
        </span>
    ),
};

const groupColumns = (nameHeader) => [
    { headerName: nameHeader, field: "name", minWidth: 230, flex: 2, cellStyle: { fontWeight: 600 } },
    overallColumn,
    ...MODULE_ORDER.map(moduleScoreColumn),
    { headerName: "Exceptions", field: "exceptions", maxWidth: 120 },
];
const COMPANY_COLUMNS = groupColumns("Company");
const STATE_COLUMNS = groupColumns("State");

const CLIENT_COLUMNS = [
    { headerName: "Company", field: "name", minWidth: 230, flex: 2, cellStyle: { fontWeight: 600 } },
    overallColumn,
    { headerName: "Modules with Data", field: "modules_available", maxWidth: 160, valueFormatter: (p) => `${p.value ?? 0} of 4` },
    { headerName: "Locations", field: "location_count", maxWidth: 110 },
    { headerName: "States", field: "states_text", minWidth: 160 },
    {
        headerName: "Modules Subscribed",
        field: "modules_subscribed",
        minWidth: 220,
        flex: 2,
        sortable: false,
        cellRenderer: (p) =>
            p.value?.length ? (
                <div className="d-flex gap-1 flex-wrap">
                    {p.value.map((m) => (
                        <span key={m} className="dw-badge neutral">{m}</span>
                    ))}
                </div>
            ) : (
                <span className="text-muted small">–</span>
            ),
    },
    { headerName: "Exceptions", field: "exceptions", maxWidth: 120 },
];

/**
 * Compliance Cockpit, overall (no company). Compiles the four module dashboards; every figure comes
 * from the cockpit API and equals the module dashboard's number for the same filters.
 */
const CockpitComplince = ({
    setSelectedCompany,
    current,
    selectedCharts,
    setSelectedCharts,
    shouldShow,
    isActive,
    openTab,
}) => {
    const [groupBy, setGroupBy] = useState("company");
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

    const { filters, updateFilters, resetFilters, ready, filterOptions, params, openModule, loadError, setLoadError } = useCockpit({
        selectedCompany: "",
        isActive,
        openTab,
    });

    const { data, loading } = useDashboardData({
        fetchers: {
            summary: { fetch: fetchCockpitSummary, fallback: {} },
            companyWise: { fetch: fetchCockpitCompanyWise, fallback: [] },
            stateWise: { fetch: fetchCockpitStateWise, fallback: [] },
            clients: { fetch: () => fetchCockpitClients(), fallback: [] },
        },
        params,
        enabled: ready,
        isCompanyMode: false,
        onError: setLoadError,
    });

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

    // Company rows joined with the client master (names compared ignoring case)
    const clientRows = useMemo(() => {
        const clients = new Map((data.clients || []).map((c) => [String(c.company_name).toLowerCase(), c]));
        return (data.companyWise || []).map((row) => {
            const client = clients.get(String(row.name).toLowerCase());
            return {
                ...row,
                location_count: client ? client.locations?.length ?? 0 : null,
                states_text: client?.states?.join(", ") || "–",
                modules_subscribed: client?.modules_subscribed || [],
            };
        });
    }, [data.companyWise, data.clients]);

    // Opening a company keeps the current filters (they stay in the URL on this tab)
    const openCompany = (name) => {
        if (!name) return;
        setSelectedCompany(name);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const distribution = summary.score_distribution || [];
    const distributionChart = {
        series: [{ name: "Companies", data: distribution.map((d) => d.count) }],
        options: {
            chart: { type: "bar", toolbar: { show: false } },
            colors: distribution.map((d) => distributionColor(d.name)),
            plotOptions: { bar: { distributed: true, columnWidth: "55%" } },
            legend: { show: false },
            dataLabels: { enabled: true },
            xaxis: { categories: distribution.map((d) => `${d.name}%`), title: { text: "Overall score" } },
            // whole-number ticks; small counts would otherwise repeat after rounding
            yaxis: { min: 0, tickAmount: Math.min(Math.max(...distribution.map((d) => d.count), 1), 5), labels: { formatter: (v) => Math.round(v) } },
        },
    };

    const kpis = [
        { label: "Companies in Scope", value: summary.companies ?? 0 },
        { label: "Needs Attention", value: summary.exceptions ?? 0, tone: summary.exceptions ? "warning" : "" },
        { label: "Modules with Data", value: `${summary.modules_available ?? 0} of 4` },
    ];

    return (
        <div>
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />

            <div className="d-flex align-items-center gap-2 mb-2 small">
                <span className="text-muted">Showing:</span>
                <span className="fw-600">{period || "Current status"}</span>
                <span className="text-muted">· all companies you can access</span>
            </div>

            <CockpitFilterBar filterOptions={filterOptions} filters={filters} onChange={updateFilters} onClear={resetFilters} />

            {loadError && <div className="alert alert-danger">{loadError}</div>}

            <div className="charts-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
                {shouldShow("cc-6") && (
                    <OverallScoreCard selection={cardSelection("cc-6")} loading={loading} summary={data.summary} title="Overall Compliance Score" />
                )}
                {shouldShow("cc-9") && (
                        <DashboardCard
                            selection={cardSelection("cc-9")}
                            title="Analytics Summary"
                            subtitle="Companies by overall score"
                            loading={loading}
                            isEmpty={!summary.modules}
                            minHeight={220}
                        >
                            <div className="dw-kpi-grid mb-2" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                                {kpis.map((k) => (
                                    <div key={k.label} className="dw-kpi">
                                        <div className="dw-kpi-label">{k.label}</div>
                                        <div className={`dw-kpi-value ${k.tone || ""}`}>{k.value}</div>
                                    </div>
                                ))}
                            </div>
                            <Chart options={distributionChart.options} series={distributionChart.series} type="bar" height={200} />
                        </DashboardCard>
                )}
            </div>

            <div className="charts-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                {TILE_ORDER.filter((key) => shouldShow(MODULES[key].widgetId)).map((key) => (
                    <ModuleTile
                        key={key}
                        selection={cardSelection(MODULES[key].widgetId)}
                        loading={loading}
                        module={moduleByKey[key]}
                        onOpen={openModule}
                    />
                ))}
            </div>

            {shouldShow("cc-7") && (
                <CompletionStatusCard selection={cardSelection("cc-7")} loading={loading} modules={modules} onOpen={openModule} />
            )}

            {shouldShow("cc-1") && (
                <GroupTableCard
                    selection={cardSelection("cc-1")}
                    loading={loading}
                    title="Multi-Client Compliance Analytics"
                    subtitle={
                        groupBy === "company"
                            ? "Lowest overall score first. Click a company to open its cockpit"
                            : "Lowest overall score first. Click a state to filter to it"
                    }
                    note={
                        <div className="d-flex justify-content-between align-items-center">
                            <span>Overall = average of the modules with data (count shown after the score); "No data" is not 0%.</span>
                            <ToggleButtonGroup size="small" exclusive value={groupBy} onChange={(e, v) => v && setGroupBy(v)}>
                                <ToggleButton value="company" sx={{ py: 0.25, textTransform: "none" }}>Companies</ToggleButton>
                                <ToggleButton value="state" sx={{ py: 0.25, textTransform: "none" }}>States</ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                    }
                    rows={groupBy === "company" ? data.companyWise : data.stateWise}
                    columnDefs={groupBy === "company" ? COMPANY_COLUMNS : STATE_COLUMNS}
                    rowId={(row) => `${groupBy}|${row.name}`}
                    onRowClick={(row) => (groupBy === "company" ? openCompany(row.name) : updateFilters({ state: [row.name] }))}
                    maxHeight={520}
                />
            )}

            {shouldShow("cc-8") && (
                <GroupTableCard
                    selection={cardSelection("cc-8")}
                    loading={loading}
                    title="Client Performance Overview"
                    subtitle="Overall score with onboarding details from the client master. Click a company to open its cockpit"
                    note={
                        (data.clients || []).length === 0
                            ? "No client master records were returned, so locations, states and subscribed modules are blank."
                            : ""
                    }
                    rows={clientRows}
                    columnDefs={CLIENT_COLUMNS}
                    rowId={(row) => row.name}
                    onRowClick={(row) => openCompany(row.name)}
                    maxHeight={520}
                />
            )}
        </div>
    );
};

export default CockpitComplince;
