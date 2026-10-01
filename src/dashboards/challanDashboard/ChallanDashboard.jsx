import React, { useCallback, useMemo, useRef, useState } from "react";
import "../../style/dashboardWidgets.css";
import {
    fetchChallanActWise,
    fetchChallanCompanyWise,
    fetchChallanExceptions,
    fetchChallanFilters,
    fetchChallanLocationWise,
    fetchChallanRecordById,
    fetchChallanRecords,
    fetchChallanSummary,
    fetchChallanTrend,
    fetchChallanTurnaround,
} from "../../api/service";
import Snackbars from "../../component/Snackbars";
import { useDashboardData, useDashboardFilters, useFilterOptions } from "../common/useDashboard";
import { defaultPeriod, formatINR, formatPercent } from "../common/dashboardUtils";
import AccessState from "../common/AccessState";
import LocationMonthGrid from "../common/LocationMonthGrid";
import TurnaroundCard from "../common/TurnaroundCard";
import RecordsTable from "../common/RecordsTable";
import RecordDetailDrawer from "../common/RecordDetailDrawer";
import ExceptionsCard from "../common/ExceptionsCard";
import ChallanFilterBar from "./ChallanFilterBar";
import SummaryWidget from "./SummaryWidget";
import CompanyWiseWidget from "./CompanyWiseWidget";
import TrendWidget from "./TrendWidget";
import ActWiseWidget from "./ActWiseWidget";
import StatusBadges from "./StatusBadges";
import {
    ACT_KEY,
    COMPUTED_RECORD_COLUMNS,
    DEFAULT_RECORD_COLUMNS,
    MULTI_FILTER_KEYS,
    SINGLE_FILTER_KEYS,
    SORT_BY_FOR_COLUMN,
    TIMELINE_STEP_KINDS,
} from "./challanUtils";

const GRID_STATUSES = {
    complied: { label: "Complied", bg: "#14b8a6", color: "white" },
    partial: { label: "Partial", bg: "#fbbf24", color: "#422006" },
    non_complied: { label: "Non-complied", bg: "#f87171", color: "white" },
};

// payment_delays comes in a fixed order: on/before due, 1-3, 4-7, 8-15, >15 days late, Not paid
const paymentDelayDrill = (index, total) => {
    if (index === 0) return { paid_on_time: "Y", overdue: "" };
    if (index === total - 1) return { paid_on_time: "", overdue: "true" };
    return { paid_on_time: "N", overdue: "" };
};

const renderStatus = (computed) => <StatusBadges computed={computed} />;

const exceptionColumns = (isCompanyMode) => [
    { headerName: "Company", field: "company", minWidth: 170, hide: isCompanyMode },
    { headerName: "State", field: "state", minWidth: 120 },
    { headerName: "Location", field: "location", minWidth: 170 },
    { headerName: "Act", field: "act", width: 90, flex: 0 },
    { headerName: "Wage Month", field: "wage_month", width: 120, flex: 0 },
];

const exceptionRow = (row) => ({
    company: row.record?.company_name,
    state: row.record?.state,
    location: row.record?.location,
    act: row.record?.[ACT_KEY],
    wage_month: row.computed?.month_label || row.record?.wage_month,
});

/**
 * Challan Dashboard. Overall mode when no company is selected; company-wise mode calls the
 * same endpoints with company_name. Filters live in the URL query string so views are shareable.
 */
const ChallanDashboard = ({
    selectedCompany,
    setSelectedCompany,
    shouldShow,
    isActive,
}) => {
    const isCompanyMode = Boolean(selectedCompany);
    const [recordId, setRecordId] = useState(null);
    const recordsRef = useRef(null);

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
        fetchChallanFilters,
        selectedCompany,
        activated
    );
    // The filters hook needs the default period, but the options load only once that hook reports
    // the tab activated; hand the value back with a render-phase update (React's derived-state pattern)
    const defaults = useMemo(() => (filterOptions ? defaultPeriod(filterOptions.wage_months) : null), [filterOptions]);
    if (defaults !== periodOptions) setPeriodOptions(defaults);

    // Every widget gets the same filter set
    const params = useMemo(() => ({ ...filters, company_name: selectedCompany }), [filters, selectedCompany]);

    const { data, loading, accessError: dataAccessError } = useDashboardData({
        fetchers: {
            summary: { fetch: fetchChallanSummary, fallback: {} },
            trend: { fetch: fetchChallanTrend, fallback: [] },
            actWise: { fetch: fetchChallanActWise, fallback: [] },
            locationWise: { fetch: fetchChallanLocationWise, fallback: {} },
            turnaround: { fetch: fetchChallanTurnaround, fallback: {} },
            companyWise: { fetch: fetchChallanCompanyWise, fallback: [], skip: isCompanyMode },
        },
        params,
        enabled: ready,
        isCompanyMode,
        onError: (message) => showSnackbar(message, "error"),
    });
    const accessError = optionsAccessError || dataAccessError;

    /* ---------- drill downs ---------- */

    const showRecords = shouldShow("ch-7");

    const onDrill = useCallback(
        (patch) => {
            updateFilters(patch);
            if (showRecords) recordsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        },
        [updateFilters, showRecords]
    );

    const drillLocation = (loc, month) =>
        onDrill({
            state: [loc.state],
            location: [loc.location],
            ...(month ? { month_from: month, month_to: month, wage_month: [] } : {}),
        });

    const onOpenCompany = (companyName) => {
        if (!companyName) return;
        setSelectedCompany(companyName);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onView = useCallback((id) => setRecordId(id), []);
    const exceptionLeadColumns = useMemo(() => exceptionColumns(isCompanyMode), [isCompanyMode]);

    const fetchRecordsPage = (page, limit, sort) => fetchChallanRecords(page, limit, undefined, { ...params, ...sort });

    const locationWise = data.locationWise || {};
    const turnaround = data.turnaround || {};

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
                    dataLabel="challan data"
                    onShowAll={() => setSelectedCompany("")}
                />
            ) : (
                <>
                    <ChallanFilterBar filterOptions={filterOptions} filters={filters} onChange={updateFilters} onClear={resetFilters} />

                    {shouldShow("ch-1") && (
                        <SummaryWidget loading={loading} summary={data.summary} onDrill={onDrill} />
                    )}

                    {!isCompanyMode && shouldShow("ch-8") && (
                        <CompanyWiseWidget
                            loading={loading}
                            companyWise={data.companyWise}
                            onOpenCompany={onOpenCompany}
                        />
                    )}

                    <div className="charts-grid">
                        {shouldShow("ch-2") && (
                            <TrendWidget loading={loading} trend={data.trend} onDrill={onDrill} />
                        )}
                        {shouldShow("ch-3") && (
                            <ActWiseWidget loading={loading} actWise={data.actWise} onDrill={onDrill} />
                        )}
                    </div>

                    {shouldShow("ch-4") && (
                        <LocationMonthGrid
                            loading={loading}
                            title="Location-wise Compliance by Month"
                            subtitle="Click a cell to see that location's records for the month"
                            months={locationWise.months}
                            locations={locationWise.locations}
                            states={locationWise.states}
                            statuses={GRID_STATUSES}
                            cellText={(cell) => `${cell.complied}/${cell.total}`}
                            cellTooltip={(cell) => (
                                <div>
                                    <div className="fw-600">{GRID_STATUSES[cell.status]?.label || cell.status}</div>
                                    <div>Acts: {(cell.acts || []).join(", ") || "–"}</div>
                                    <div>Complied: {cell.complied}/{cell.total}</div>
                                    <div>Amount: {formatINR(cell.amount)}</div>
                                    {cell.exceptions > 0 && <div>Exceptions: {cell.exceptions}</div>}
                                </div>
                            )}
                            stateText={(s) =>
                                `${s.locations} locations · ${formatPercent(s.compliance_score)} complied · ${formatINR(s.amount)}`
                            }
                            overallText={(loc) => formatPercent(loc.compliance_score)}
                            onCellClick={drillLocation}
                            onLocationClick={(loc) => drillLocation(loc)}
                        />
                    )}

                    {shouldShow("ch-5") && (
                        <TurnaroundCard
                            loading={loading}
                            stages={turnaround.stages}
                            endToEnd={turnaround.end_to_end}
                            delays={turnaround.payment_delays}
                            delaysTitle="Payment timing vs due date"
                            onDelayClick={(index, total) => onDrill(paymentDelayDrill(index, total))}
                        />
                    )}

                    {ready && shouldShow("ch-6") && (
                        <ExceptionsCard
                            loading={loading}
                            subtitle={`${data.summary?.exceptions ?? 0} exceptions: non-complied, paid late, overdue, skipped employees or penalty`}
                            total={data.summary?.exceptions}
                            fetchPage={(page, limit) => fetchChallanExceptions(params, page, limit)}
                            gridKey={JSON.stringify(params)}
                            leadColumns={exceptionLeadColumns}
                            mapRow={exceptionRow}
                            renderStatus={renderStatus}
                            onView={onView}
                        />
                    )}

                    {ready && showRecords && (
                        <RecordsTable
                            ref={recordsRef}
                            loading={loading}
                            title="Challan Records"
                            subtitle={`${data.summary?.total ?? 0} records match the filters`}
                            isEmpty={!data.summary?.total}
                            columns={filterOptions?.columns}
                            computedColumns={COMPUTED_RECORD_COLUMNS}
                            defaultColumns={DEFAULT_RECORD_COLUMNS}
                            storageKey="challanRecordColumns"
                            sortByForColumn={SORT_BY_FOR_COLUMN}
                            renderStatus={renderStatus}
                            fetchPage={fetchRecordsPage}
                            gridKey={JSON.stringify(params)}
                            onView={onView}
                        />
                    )}
                </>
            )}

            <RecordDetailDrawer
                recordId={recordId}
                companyName={selectedCompany}
                fetchRecord={fetchChallanRecordById}
                title={(d) => [d.record?.[ACT_KEY], d.record?.location].filter(Boolean).join(" · ") || "Challan record"}
                subtitle={(d) => [d.record?.company_name, d.record?.state, d.computed?.month_label].filter(Boolean).join(" · ")}
                badges={renderStatus}
                stepKinds={TIMELINE_STEP_KINDS}
                onClose={() => setRecordId(null)}
            />
        </div>
    );
};

export default ChallanDashboard;
