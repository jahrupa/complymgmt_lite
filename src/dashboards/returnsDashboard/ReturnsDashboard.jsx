import React, { useCallback, useMemo, useRef, useState } from "react";
import "../../style/dashboardWidgets.css";
import {
    fetchReturnsDashActWise,
    fetchReturnsDashCompanyWise,
    fetchReturnsDashExceptions,
    fetchReturnsDashFilters,
    fetchReturnsDashLocationWise,
    fetchReturnsDashPeriodWise,
    fetchReturnsDashRecordById,
    fetchReturnsDashRecords,
    fetchReturnsDashReturnWise,
    fetchReturnsDashSummary,
    fetchReturnsDashTrend,
    fetchReturnsDashTurnaround,
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
import ReturnsFilterBar from "./ReturnsFilterBar";
import SummaryWidget from "./SummaryWidget";
import TrendWidget from "./TrendWidget";
import ActWiseWidget from "./ActWiseWidget";
import CoverageWidget from "./CoverageWidget";
import { CoverageStatusBadge, ReturnBadges } from "./ReturnsBadges";
import {
    COMPANY_TABLE_COLUMNS,
    PERIOD_TABLE_COLUMNS,
    RETURN_TABLE_COLUMNS,
    exceptionColumns,
    exceptionRow,
} from "./returnsColumns";
import {
    COLUMN_LABEL_OVERRIDES,
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
    hasApplicableLocations,
    hasStatusFilters,
} from "./returnsUtils";

// filing_delays comes in a fixed order: on/before due, 1-3, 4-7, 8-15, >15 days late, Not filed
const filingDelayDrill = (index, total) => {
    if (index === 0) return { on_time: "Y", filed: "" };
    if (index === total - 1) return { on_time: "", filed: "N" };
    return { on_time: "N", filed: "" };
};

const renderStatus = (computed) => <ReturnBadges computed={computed} />;

/**
 * Returns Dashboard (tracker based). Overall mode when no company is selected; company-wise mode
 * calls the same endpoints with company_name. Filters live in the URL query string.
 */
const ReturnsDashboard = ({
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
        fetchReturnsDashFilters,
        selectedCompany,
        activated
    );
    // The filters hook needs the default period, but the options load only once that hook reports
    // the tab activated; hand the value back with a render-phase update (React's derived-state pattern)
    const defaults = useMemo(() => (filterOptions ? defaultPeriod(filterOptions.due_months) : null), [filterOptions]);
    if (defaults !== periodOptions) setPeriodOptions(defaults);

    // Every widget gets the same filter set; widget-only params (coverage status, records sheet) stay out
    const params = useMemo(
        () => ({ ...withoutKeys(filters, WIDGET_ONLY_KEYS), company_name: selectedCompany }),
        [filters, selectedCompany]
    );
    const statusFiltersActive = hasStatusFilters(filters);

    const { data, loading, accessError: dataAccessError } = useDashboardData({
        fetchers: {
            summary: { fetch: fetchReturnsDashSummary, fallback: {} },
            companyWise: { fetch: fetchReturnsDashCompanyWise, fallback: [], skip: isCompanyMode },
            trend: { fetch: fetchReturnsDashTrend, fallback: [] },
            periodWise: { fetch: fetchReturnsDashPeriodWise, fallback: [] },
            returnWise: { fetch: fetchReturnsDashReturnWise, fallback: [] },
            actWise: { fetch: fetchReturnsDashActWise, fallback: [] },
            locationWise: { fetch: fetchReturnsDashLocationWise, fallback: {} },
            turnaround: { fetch: fetchReturnsDashTurnaround, fallback: {} },
        },
        params,
        enabled: ready,
        isCompanyMode,
        onError: (message) => showSnackbar(message, "error"),
    });
    const accessError = optionsAccessError || dataAccessError;

    /* ---------- drill downs ---------- */

    const showCoverage = shouldShow("rt-10");
    const showRecords = shouldShow("rt-11");

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
        onDrill({
            state: [loc.state],
            location: [loc.location],
            ...(month ? { month_from: month, month_to: month } : {}),
        });

    // Coverage row -> that company's records at the location. In overall mode the company is matched
    // with free-text search (company_name would switch to company-wise mode). Locations without any
    // filing open the applicability sheet, since there are no transactions to show.
    const openCoverageRow = (row) =>
        onDrill({
            state: [row.state],
            location: [row.location],
            ...(isCompanyMode ? {} : { search: row.company_name }),
            sheet: row.status === "not_covered" ? "applicability" : "",
        });

    const onOpenCompany = (companyName) => {
        if (!companyName) return;
        setSelectedCompany(companyName);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onView = useCallback((id) => setRecordId(id), []);
    const exceptionLeadColumns = useMemo(() => exceptionColumns(isCompanyMode), [isCompanyMode]);

    /* ---------- records (sheet tabs) ---------- */

    const sheet = RECORD_SHEETS.some((s) => s.key === filters.sheet) ? filters.sheet : "transaction";
    const isMaster = sheet === "master";

    const fetchRecordsPage = (page, limit, sort) => {
        // The master catalogue ignores company, location and transaction filters
        const base = isMaster ? Object.fromEntries(MASTER_FILTER_KEYS.map((key) => [key, filters[key]])) : params;
        return fetchReturnsDashRecords({ ...base, sheet, page, limit, ...sort });
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
                    dataLabel="returns data"
                    onShowAll={() => setSelectedCompany("")}
                />
            ) : (
                <>
                    <ReturnsFilterBar filterOptions={filterOptions} filters={filters} onChange={updateFilters} onClear={resetFilters} />

                    {shouldShow("rt-1") && (
                        <SummaryWidget
                            loading={loading}
                            summary={summary}
                            statusFiltersActive={statusFiltersActive}
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
                            statusFiltersActive={statusFiltersActive}
                            isCompanyMode={isCompanyMode}
                            onStatusChange={(status) => updateFilters({ coverage_status: status })}
                            onOpenRow={openCoverageRow}
                        />
                    )}

                    {!isCompanyMode && shouldShow("rt-2") && (
                        <GroupTableCard
                            loading={loading}
                            title="Company-wise Returns"
                            subtitle="Lowest coverage first. Click a company to open its dashboard"
                            rows={data.companyWise}
                            columnDefs={COMPANY_TABLE_COLUMNS}
                            rowId={(row) => row.company_name}
                            onRowClick={(row) => onOpenCompany(row.company_name)}
                        />
                    )}

                    <div className="charts-grid">
                        {shouldShow("rt-3") && (
                            <TrendWidget loading={loading} trend={data.trend} onDrill={onDrill} />
                        )}
                        {shouldShow("rt-6") && (
                            <ActWiseWidget loading={loading} actWise={data.actWise} onDrill={onDrill} />
                        )}
                    </div>

                    {shouldShow("rt-4") && (
                        <GroupTableCard
                            loading={loading}
                            title="Period-wise Filings"
                            subtitle="Latest period first. Periods overlap (quarterly vs annual); click one to filter to it"
                            rows={data.periodWise}
                            columnDefs={PERIOD_TABLE_COLUMNS}
                            rowId={(row) => row.period || "unspecified"}
                            onRowClick={(row) => row.period && onDrill({ period: [row.period] })}
                        />
                    )}

                    {shouldShow("rt-5") && (
                        <GroupTableCard
                            loading={loading}
                            title="Return-wise Status"
                            subtitle="Click a return to filter to it"
                            note="Return names differ between the applicability and filing sheets, so a name usually has either applicable returns or filings. The two columns are not joined."
                            rows={data.returnWise}
                            columnDefs={RETURN_TABLE_COLUMNS}
                            rowId={(row) => row.return_name}
                            onRowClick={(row) => onDrill({ return_name: [row.return_name] })}
                        />
                    )}

                    {shouldShow("rt-7") && (
                        <LocationMonthGrid
                            loading={loading}
                            title="Location-wise Filings by Due Month"
                            subtitle="Cells show returns filed of due; click one to see those records"
                            note={statusFiltersActive ? "Status filters narrow the filings but not the coverage badges." : ""}
                            months={locationWise.due_months}
                            locations={locationWise.locations}
                            states={locationWise.states}
                            statuses={GRID_STATUSES}
                            blankEmptyCells
                            locationBadge={(loc) => <CoverageStatusBadge status={loc.coverage_status} />}
                            cellText={(cell) => `${cell.filed}/${cell.total}`}
                            cellTooltip={(cell) => (
                                <div>
                                    <div className="fw-600">{GRID_STATUSES[cell.status]?.label || cell.status}</div>
                                    <div>Filed: {cell.filed}/{cell.total} ({cell.on_time} on time, {cell.late} late)</div>
                                    <div>Compliance: {formatPercent(cell.compliance_rate)}</div>
                                    {cell.overdue > 0 && <div>Overdue: {cell.overdue}</div>}
                                    {cell.exceptions > 0 && <div>Exceptions: {cell.exceptions}</div>}
                                </div>
                            )}
                            stateText={(s) =>
                                `${s.locations} locations · ${
                                    hasApplicableLocations(s.coverage) ? `${formatPercent(s.coverage.coverage_percent)} coverage` : "no applicable locations"
                                } · ${s.total} filings`
                            }
                            overallText={(loc) => (loc.total ? formatPercent(loc.filing_rate) : "–")}
                            onCellClick={drillLocation}
                            onLocationClick={(loc) => drillLocation(loc)}
                        />
                    )}

                    {shouldShow("rt-8") && (
                        <TurnaroundCard
                            loading={loading}
                            stages={turnaround.stages}
                            endToEnd={turnaround.end_to_end}
                            delays={turnaround.filing_delays}
                            delaysTitle="Filing vs due date"
                            onDelayClick={(index, total) => onDrill(filingDelayDrill(index, total))}
                        />
                    )}

                    {ready && shouldShow("rt-9") && (
                        <ExceptionsCard
                            loading={loading}
                            subtitle={`${summary.exceptions ?? 0} exceptions: non / partially compliant, overdue, filed late, at risk or escalated`}
                            total={summary.exceptions}
                            fetchPage={(page, limit) => fetchReturnsDashExceptions({ ...params, page, limit })}
                            gridKey={JSON.stringify(params)}
                            leadColumns={exceptionLeadColumns}
                            mapRow={exceptionRow}
                            renderStatus={renderStatus}
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
                            title="Returns Records"
                            subtitle={sheet === "transaction" ? `${summary.total ?? 0} filings match the filters` : ""}
                            tabs={
                                <SheetTabs
                                    sheets={RECORD_SHEETS}
                                    value={sheet}
                                    onChange={(val) => updateFilters({ sheet: val === "transaction" ? "" : val })}
                                />
                            }
                            note={
                                isMaster
                                    ? "Master catalogue of return definitions: only the search box applies here."
                                    : ""
                            }
                            isEmpty={sheet === "transaction" && !summary.total}
                            columns={filterOptions?.columns?.[sheet]}
                            computedColumns={COMPUTED_RECORD_COLUMNS[sheet]}
                            defaultColumns={DEFAULT_RECORD_COLUMNS[sheet]}
                            labelOverrides={COLUMN_LABEL_OVERRIDES}
                            storageKey={`returnsRecordColumns.${sheet}`}
                            sortByForColumn={SORT_BY_FOR_COLUMN}
                            renderStatus={isMaster ? null : renderStatus}
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
                fetchRecord={fetchReturnsDashRecordById}
                title={(d) => d.record?.return_name || "Return record"}
                subtitle={(d) =>
                    [d.record?.company_name, d.record?.location_name, d.computed?.period_label || d.computed?.due_month_label]
                        .filter((v) => v && v !== "Unspecified")
                        .join(" · ")
                }
                badges={renderStatus}
                stepKinds={TIMELINE_STEP_KINDS}
                onClose={() => setRecordId(null)}
            />
        </div>
    );
};

export default ReturnsDashboard;
