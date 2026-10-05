import React, { useCallback, useMemo, useRef, useState } from "react";
import "../../style/dashboardWidgets.css";
import {
    fetchRegisterDashActWise,
    fetchRegisterDashCompanyWise,
    fetchRegisterDashExceptions,
    fetchRegisterDashFilters,
    fetchRegisterDashLocationWise,
    fetchRegisterDashRecordById,
    fetchRegisterDashRecords,
    fetchRegisterDashRegisterWise,
    fetchRegisterDashSummary,
    fetchRegisterDashTrend,
    fetchRegisterDashTurnaround,
    fetchRegisterDashVariance,
} from "../../api/service";
import Snackbars from "../../component/Snackbars";
import { useDashboardData, useDashboardFilters, useFilterOptions } from "../common/useDashboard";
import { defaultPeriod, formatPercent, withoutKeys } from "../common/dashboardUtils";
import AccessState from "../common/AccessState";
import LocationMonthGrid from "../common/LocationMonthGrid";
import TurnaroundCard from "../common/TurnaroundCard";
import RecordsTable from "../common/RecordsTable";
import RecordDetailDrawer from "../common/RecordDetailDrawer";
import ExceptionsCard from "../common/ExceptionsCard";
import GroupTableCard from "../common/GroupTableCard";
import SheetTabs from "../common/SheetTabs";
import RegisterFilterBar from "./RegisterFilterBar";
import SummaryWidget from "./SummaryWidget";
import TrendWidget from "./TrendWidget";
import ActWiseWidget from "./ActWiseWidget";
import VarianceWidget from "./VarianceWidget";
import CoverageWidget from "./CoverageWidget";
import { ExecutionBadges } from "./RegisterBadges";
import { COMPANY_TABLE_COLUMNS, REGISTER_TABLE_COLUMNS, exceptionColumns, exceptionRow } from "./registerColumns";
import {
    COMPUTED_RECORD_COLUMNS,
    DEFAULT_RECORD_COLUMNS,
    GRID_STATUSES,
    MASTER_FILTER_KEYS,
    MULTI_FILTER_KEYS,
    RECORD_SHEETS,
    SINGLE_FILTER_KEYS,
    SORT_BY_FOR_COLUMN,
    TIMELINE_STEP_KINDS,
    WIDGET_ONLY_KEYS,
    hasApplicability,
    hasExecutionFilters,
} from "./registerUtils";

// sla_delays comes in a fixed order: on/before planned, 1-3, 4-7, 8-15, >15 days late, Not completed
const slaDelayDrill = (index, total) => {
    if (index === 0) return { sla_met: "Y", completed: "" };
    if (index === total - 1) return { sla_met: "", completed: "N" };
    return { sla_met: "N", completed: "" };
};

const coverageText = (coverage) =>
    hasApplicability(coverage) ? `${formatPercent(coverage.coverage_percent)} coverage` : "No applicability data";

const renderExecutionStatus = (computed) => <ExecutionBadges computed={computed} />;

/**
 * Register Dashboard. Overall mode when no company is selected; company-wise mode calls the
 * same endpoints with company_name. Filters live in the URL query string so views are shareable.
 */
const RegisterDashboard = ({
    selectedCompany,
    setSelectedCompany,
    shouldShow,
    isActive,
}) => {
    const isCompanyMode = Boolean(selectedCompany);
    const [recordId, setRecordId] = useState(null);
    const recordsRef = useRef(null);
    const coverageRef = useRef(null);

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

    const [periodOptions, setPeriodOptions] = useState(null);
    const { filters, updateFilters, resetFilters, activated, ready } = useDashboardFilters({
        multiKeys: MULTI_FILTER_KEYS,
        singleKeys: SINGLE_FILTER_KEYS,
        isActive,
        defaultPeriod: periodOptions,
    });

    const { options: filterOptions, accessError: optionsAccessError } = useFilterOptions(
        fetchRegisterDashFilters,
        selectedCompany,
        activated
    );
    // The filters hook needs the default period, but the options load only once that hook reports
    // the tab activated; hand the value back with a render-phase update (React's derived-state pattern)
    const defaults = useMemo(() => (filterOptions ? defaultPeriod(filterOptions.months) : null), [filterOptions]);
    if (defaults !== periodOptions) setPeriodOptions(defaults);

    // Every widget gets the same filter set; widget-only params (coverage status, records sheet) stay out
    const params = useMemo(
        () => ({ ...withoutKeys(filters, WIDGET_ONLY_KEYS), company_name: selectedCompany }),
        [filters, selectedCompany]
    );
    const executionFiltersActive = hasExecutionFilters(filters);

    const { data, loading, accessError: dataAccessError } = useDashboardData({
        fetchers: {
            summary: { fetch: fetchRegisterDashSummary, fallback: {} },
            companyWise: { fetch: fetchRegisterDashCompanyWise, fallback: [], skip: isCompanyMode },
            trend: { fetch: fetchRegisterDashTrend, fallback: [] },
            registerWise: { fetch: fetchRegisterDashRegisterWise, fallback: [] },
            actWise: { fetch: fetchRegisterDashActWise, fallback: [] },
            locationWise: { fetch: fetchRegisterDashLocationWise, fallback: {} },
            turnaround: { fetch: fetchRegisterDashTurnaround, fallback: {} },
            variance: { fetch: fetchRegisterDashVariance, fallback: {} },
        },
        params,
        enabled: ready,
        isCompanyMode,
        onError: (message) => showSnackbar(message, "error"),
    });
    const accessError = optionsAccessError || dataAccessError;

    /* ---------- drill downs ---------- */

    const showCoverage = shouldShow("rg-10");
    const showRecords = shouldShow("rg-11");

    // Apply filters, then bring the matching list into view (coverage worklist or records)
    const onDrill = useCallback(
        (patch, target = "records") => {
            updateFilters(patch);
            const ref = target === "coverage" && showCoverage ? coverageRef : showRecords ? recordsRef : null;
            ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        },
        [updateFilters, showCoverage, showRecords]
    );

    const drillLocation = (loc, month) =>
        onDrill(
            {
                state: [loc.state],
                location: [loc.location],
                ...(month ? { month_from: month, month_to: month } : {}),
            },
            "coverage"
        );

    const onOpenCompany = (companyName) => {
        if (!companyName) return;
        setSelectedCompany(companyName);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onView = useCallback((id) => setRecordId(id), []);
    const exceptionLeadColumns = useMemo(() => exceptionColumns(isCompanyMode), [isCompanyMode]);

    /* ---------- records (sheet tabs) ---------- */

    const sheet = RECORD_SHEETS.some((s) => s.key === filters.sheet) ? filters.sheet : "execution";
    const isMaster = sheet === "master";

    const fetchRecordsPage = (page, limit, sort) => {
        // The master catalogue ignores company and execution filters
        const base = isMaster
            ? Object.fromEntries(MASTER_FILTER_KEYS.map((key) => [key, filters[key]]))
            : params;
        return fetchRegisterDashRecords({ ...base, sheet, page, limit, ...sort });
    };

    const locationWise = data.locationWise || {};
    const turnaround = data.turnaround || {};
    const summary = data.summary || {};

    /* ---------- render ---------- */

    return (
        <div>
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />

            {isCompanyMode && !accessError && (
                <div className="d-flex align-items-center gap-2 mb-2 small">
                    <span className="text-muted">Company-wise view:</span>
                    <span className="fw-600">{selectedCompany}</span>
                    <button className="btn btn-link btn-sm p-0" onClick={() => setSelectedCompany("")}>
                        View all companies
                    </button>
                </div>
            )}

            {accessError ? (
                <AccessState
                    status={accessError}
                    companyName={selectedCompany}
                    dataLabel="register data"
                    onShowAll={() => setSelectedCompany("")}
                />
            ) : (
                <>
                    <RegisterFilterBar filterOptions={filterOptions} filters={filters} onChange={updateFilters} onClear={resetFilters} />

                    {shouldShow("rg-1") && (
                        <SummaryWidget
                            loading={loading}
                            summary={summary}
                            executionFiltersActive={executionFiltersActive}
                            onDrill={onDrill}
                            onCoverageDrill={(status) => onDrill({ coverage_status: [status] }, "coverage")}
                        />
                    )}

                    {ready && showCoverage && (
                        <CoverageWidget
                            ref={coverageRef}
                            loading={loading}
                            params={params}
                            coverageStatus={filters.coverage_status}
                            coverage={summary.coverage}
                            executionFiltersActive={executionFiltersActive}
                            isCompanyMode={isCompanyMode}
                            onStatusChange={(status) => updateFilters({ coverage_status: status })}
                            onView={onView}
                        />
                    )}

                    {!isCompanyMode && shouldShow("rg-2") && (
                        <GroupTableCard
                            loading={loading}
                            title="Company-wise Registers"
                            subtitle="Lowest completion first. Click a company to open its dashboard"
                            rows={data.companyWise}
                            columnDefs={COMPANY_TABLE_COLUMNS}
                            rowId={(row) => row.company_name}
                            onRowClick={(row) => onOpenCompany(row.company_name)}
                        />
                    )}

                    <div className="charts-grid">
                        {shouldShow("rg-3") && (
                            <TrendWidget loading={loading} trend={data.trend} onDrill={onDrill} />
                        )}
                        {shouldShow("rg-5") && (
                            <ActWiseWidget loading={loading} actWise={data.actWise} onDrill={onDrill} />
                        )}
                    </div>

                    {shouldShow("rg-4") && (
                        <GroupTableCard
                            loading={loading}
                            title="Register-wise Status"
                            subtitle="Click a register to filter to it"
                            rows={data.registerWise}
                            columnDefs={REGISTER_TABLE_COLUMNS}
                            rowId={(row) => `${row.register_name}|${row.applicable_act}`}
                            onRowClick={(row) => onDrill({ register_name: [row.register_name] })}
                        />
                    )}

                    {shouldShow("rg-6") && (
                        <LocationMonthGrid
                            loading={loading}
                            title="Location-wise Coverage by Month"
                            subtitle="Cells show applicable registers completed; click one to open its coverage worklist"
                            note={
                                executionFiltersActive
                                    ? "Execution filters don't apply to coverage; cells still count every applicable register."
                                    : ""
                            }
                            months={locationWise.months}
                            locations={locationWise.locations}
                            states={locationWise.states}
                            statuses={GRID_STATUSES}
                            cellText={(cell) =>
                                hasApplicability(cell.coverage)
                                    ? `${cell.coverage.completed}/${cell.coverage.applicable}`
                                    : `${cell.completed}/${cell.executed} done`
                            }
                            cellTooltip={(cell) => (
                                <div>
                                    <div className="fw-600">{GRID_STATUSES[cell.status]?.label || cell.status}</div>
                                    {hasApplicability(cell.coverage) ? (
                                        <div>
                                            Coverage: {cell.coverage.completed}/{cell.coverage.applicable} applicable ·{" "}
                                            {cell.coverage.not_started} not started
                                        </div>
                                    ) : (
                                        <div>No applicability data for this month</div>
                                    )}
                                    <div>Executed: {cell.executed}, completed: {cell.completed}</div>
                                    {cell.overdue > 0 && <div>Overdue: {cell.overdue}</div>}
                                    {cell.variance_open > 0 && <div>Open variances: {cell.variance_open}</div>}
                                </div>
                            )}
                            stateText={(s) =>
                                `${s.locations} locations · ${coverageText(s.coverage)} · ${formatPercent(s.completion_rate)} completion`
                            }
                            overallText={(loc) =>
                                hasApplicability(loc.coverage) ? formatPercent(loc.coverage.coverage_percent) : "No data"
                            }
                            onCellClick={drillLocation}
                            onLocationClick={(loc) => drillLocation(loc)}
                        />
                    )}

                    {shouldShow("rg-7") && (
                        <TurnaroundCard
                            loading={loading}
                            stages={turnaround.stages}
                            endToEnd={turnaround.end_to_end}
                            delays={turnaround.sla_delays}
                            delaysTitle="Completion vs planned date"
                            onDelayClick={(index, total) => onDrill(slaDelayDrill(index, total))}
                        />
                    )}

                    {shouldShow("rg-8") && (
                        <VarianceWidget
                            loading={loading}
                            variance={data.variance}
                            isCompanyMode={isCompanyMode}
                            onDrill={onDrill}
                            onOpenCompany={onOpenCompany}
                        />
                    )}

                    {ready && shouldShow("rg-9") && (
                        <ExceptionsCard
                            loading={loading}
                            subtitle={`${summary.exceptions ?? 0} exceptions: overdue, SLA missed or variance open`}
                            total={summary.exceptions}
                            fetchPage={(page, limit) => fetchRegisterDashExceptions({ ...params, page, limit })}
                            gridKey={JSON.stringify(params)}
                            leadColumns={exceptionLeadColumns}
                            mapRow={exceptionRow}
                            renderStatus={renderExecutionStatus}
                            statusWidth={260}
                            onView={onView}
                        />
                    )}

                    {ready && showRecords && (
                        <RecordsTable
                            // each sheet has its own columns and saved column choice
                            key={sheet}
                            ref={recordsRef}
                            loading={loading}
                            title="Register Records"
                            subtitle={sheet === "execution" ? `${summary.executed ?? 0} execution rows match the filters` : ""}
                            tabs={
                                <SheetTabs
                                    sheets={RECORD_SHEETS}
                                    value={sheet}
                                    onChange={(val) => updateFilters({ sheet: val === "execution" ? "" : val })}
                                />
                            }
                            note={
                                isMaster
                                    ? "Master catalogue of register definitions: company and execution filters don't apply."
                                    : ""
                            }
                            isEmpty={sheet === "execution" && !summary.executed}
                            columns={filterOptions?.columns?.[sheet]}
                            computedColumns={COMPUTED_RECORD_COLUMNS[sheet]}
                            defaultColumns={DEFAULT_RECORD_COLUMNS[sheet]}
                            storageKey={`registerRecordColumns.${sheet}`}
                            sortByForColumn={SORT_BY_FOR_COLUMN}
                            renderStatus={isMaster ? null : renderExecutionStatus}
                            fetchPage={fetchRecordsPage}
                            gridKey={JSON.stringify(isMaster ? MASTER_FILTER_KEYS.map((k) => filters[k]) : params)}
                            onView={onView}
                        />
                    )}
                </>
            )}

            <RecordDetailDrawer
                recordId={recordId}
                companyName={selectedCompany}
                fetchRecord={fetchRegisterDashRecordById}
                title={(d) => [d.record?.register_name, d.record?.form_id].filter(Boolean).join(" · ") || "Register record"}
                subtitle={(d) =>
                    [d.record?.company_name, d.record?.location, d.computed?.month_label !== "Unspecified" && d.computed?.month_label]
                        .filter(Boolean)
                        .join(" · ")
                }
                badges={renderExecutionStatus}
                stepKinds={TIMELINE_STEP_KINDS}
                onClose={() => setRecordId(null)}
            />
        </div>
    );
};

export default RegisterDashboard;
