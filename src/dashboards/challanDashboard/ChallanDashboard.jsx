import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../style/challanDashboard.css";
import {
    fetchChallanActWise,
    fetchChallanCompanyWise,
    fetchChallanFilters,
    fetchChallanLocationWise,
    fetchChallanSummary,
    fetchChallanTrend,
    fetchChallanTurnaround,
} from "../../api/service";
import Snackbars from "../../component/Snackbars";
import { decryptData } from "../../page/utils/encrypt";
import ChallanFilterBar from "./ChallanFilterBar";
import SummaryWidget from "./SummaryWidget";
import CompanyWiseWidget from "./CompanyWiseWidget";
import TrendWidget from "./TrendWidget";
import ActWiseWidget from "./ActWiseWidget";
import LocationGridWidget from "./LocationGridWidget";
import TurnaroundWidget from "./TurnaroundWidget";
import ExceptionsWidget from "./ExceptionsWidget";
import RecordsWidget from "./RecordsWidget";
import RecordDetailDrawer from "./RecordDetailDrawer";
import {
    EMPTY_FILTERS,
    applyFiltersToSearchParams,
    errorStatus,
    filtersFromSearchParams,
    hasAnyFilter,
} from "./challanUtils";

const DEFAULT_PERIOD_MONTHS = 6;

const EMPTY_DATA = {
    summary: {},
    trend: [],
    actWise: [],
    locationWise: {},
    turnaround: {},
    companyWise: [],
};

// Last N months from the filter options (wage_months is newest first)
const defaultPeriod = (wageMonths = []) => {
    const months = wageMonths.filter((m) => m.month);
    if (!months.length) return { month_from: "", month_to: "" };
    return {
        month_from: months[Math.min(DEFAULT_PERIOD_MONTHS, months.length) - 1].month,
        month_to: months[0].month,
    };
};

/**
 * Challan Dashboard. Overall mode when no company is selected; company-wise mode calls the
 * same endpoints with company_name. Filters live in the URL query string so views are shareable.
 */
const ChallanDashboard = ({
    selectedCompany,
    setSelectedCompany,
    current,
    selectedCharts,
    setSelectedCharts,
    shouldShow,
    isActive,
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    // Keyed on the filter values only, so writing unrelated params (tab, company_name) doesn't refetch
    const filtersJson = JSON.stringify(filtersFromSearchParams(searchParams));
    const filters = useMemo(() => JSON.parse(filtersJson), [filtersJson]);

    const isCompanyMode = Boolean(selectedCompany);

    const [filterOptions, setFilterOptions] = useState({});
    const [data, setData] = useState(EMPTY_DATA);
    const [loading, setLoading] = useState(true);
    const [accessError, setAccessError] = useState(null); // 403 / 404 in company-wise mode
    const [recordId, setRecordId] = useState(null);

    // Wait for the URL company to reach the page's company picker before fetching anything
    const [companySynced, setCompanySynced] = useState(false);
    // Without filters in the URL we default to the last 6 months once the options are known
    const [periodReady, setPeriodReady] = useState(() => hasAnyFilter(searchParams));
    const [period, setPeriod] = useState({ month_from: "", month_to: "" });
    const [optionsLoaded, setOptionsLoaded] = useState(false);
    // All tabs stay mounted; don't touch the URL or load widget data until this tab is first opened
    const [activated, setActivated] = useState(Boolean(isActive));

    const recordsRef = useRef(null);
    const requestIdRef = useRef(0);

    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        message: "",
        severityType: "",
    });
    const showSnackbar = useCallback(
        (message, severityType) =>
            setIsSnackbarsOpen((prev) => ({ ...prev, open: true, message, severityType })),
        []
    );

    const userRole = decryptData(localStorage.getItem("user_role"));

    const updateFilters = useCallback(
        (patch, options) => {
            setSearchParams(
                (prev) => applyFiltersToSearchParams(prev, { ...filtersFromSearchParams(prev), ...patch }),
                options
            );
        },
        [setSearchParams]
    );

    /* ---------- company <-> URL ---------- */

    useEffect(() => {
        if (!companySynced) {
            const urlCompany = searchParams.get("company_name") || "";
            setCompanySynced(true);
            if (urlCompany && urlCompany !== selectedCompany) setSelectedCompany?.(urlCompany);
            return;
        }
        if ((searchParams.get("company_name") || "") === selectedCompany) return;
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                if (selectedCompany) next.set("company_name", selectedCompany);
                else next.delete("company_name");
                return next;
            },
            { replace: true }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to company changes
    }, [selectedCompany, companySynced]);

    /* ---------- filter options (only company_name narrows them) ---------- */

    useEffect(() => {
        if (!companySynced) return;
        let cancelled = false;
        setAccessError(null);
        fetchChallanFilters(selectedCompany)
            .then((res) => {
                if (cancelled) return;
                const options = res?.data || {};
                setFilterOptions(options);
                setPeriod(defaultPeriod(options.wage_months));
                setOptionsLoaded(true);
            })
            .catch((error) => {
                if (cancelled) return;
                setFilterOptions({});
                const status = errorStatus(error);
                if (selectedCompany && (status === 403 || status === 404)) setAccessError(status);
                setOptionsLoaded(true);
            });
        return () => {
            cancelled = true;
        };
    }, [selectedCompany, companySynced]);

    useEffect(() => {
        if (isActive) setActivated(true);
    }, [isActive]);

    // Default period, applied once when the tab is first opened without filters in the URL
    useEffect(() => {
        if (!activated || periodReady || !optionsLoaded) return;
        if (period.month_from) updateFilters(period, { replace: true });
        setPeriodReady(true);
    }, [activated, periodReady, optionsLoaded, period, updateFilters]);

    /* ---------- widget data: every widget gets the same filter set ---------- */

    const params = useMemo(() => ({ ...filters, company_name: selectedCompany }), [filters, selectedCompany]);
    const ready = activated && companySynced && periodReady;

    useEffect(() => {
        if (!ready) return;
        const requestId = ++requestIdRef.current;
        setLoading(true);

        const fetchData = async () => {
            const [summaryRes, trendRes, actRes, locationRes, turnaroundRes, companyRes] = await Promise.allSettled([
                fetchChallanSummary(params),
                fetchChallanTrend(params),
                fetchChallanActWise(params),
                fetchChallanLocationWise(params),
                fetchChallanTurnaround(params),
                isCompanyMode ? Promise.resolve({ data: [] }) : fetchChallanCompanyWise(params),
            ]);
            // A newer filter change already started another request
            if (requestId !== requestIdRef.current) return;

            const results = [summaryRes, trendRes, actRes, locationRes, turnaroundRes, companyRes];
            const failed = results.filter((r) => r.status === "rejected");
            const accessStatus = failed.map((r) => errorStatus(r.reason)).find((s) => s === 403 || s === 404);

            if (isCompanyMode && accessStatus) {
                setAccessError(accessStatus);
                setData(EMPTY_DATA);
            } else {
                const pick = (res, fallback) => (res.status === "fulfilled" ? res.value?.data ?? fallback : fallback);
                setAccessError(null);
                setData({
                    summary: pick(summaryRes, {}),
                    trend: pick(trendRes, []),
                    actWise: pick(actRes, []),
                    locationWise: pick(locationRes, {}),
                    turnaround: pick(turnaroundRes, {}),
                    companyWise: pick(companyRes, []),
                });
                if (failed.length) {
                    showSnackbar(
                        failed[0].reason?.response?.data?.message || "Some challan widgets could not be loaded",
                        "error"
                    );
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [params, ready, isCompanyMode, showSnackbar]);

    /* ---------- widget selection (same rules as the other dashboards) ---------- */

    useEffect(() => {
        setSelectedCharts([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current?.user_name]);

    const canSelect = userRole === "Admin" || userRole === "Super-Admin";

    const toggleChartSelection = (chartId) => {
        if (!current?.user_name) {
            showSnackbar("First you need to select a user", "warning");
            return;
        }
        setSelectedCharts((prev) =>
            prev.includes(chartId) ? prev.filter((id) => id !== chartId) : [...prev, chartId]
        );
    };

    const cardSelection = (id) => ({
        id,
        canSelect,
        selected: selectedCharts.includes(id),
        disabled: !current?.user_name,
        onSelect: (chartId) => canSelect && toggleChartSelection(chartId),
        onToggle: toggleChartSelection,
    });

    /* ---------- drill downs ---------- */

    const showRecords = shouldShow("ch-7");

    const onDrill = useCallback(
        (patch) => {
            updateFilters(patch);
            if (showRecords) recordsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        },
        [updateFilters, showRecords]
    );

    const onOpenCompany = (companyName) => {
        if (!companyName) return;
        setSelectedCompany?.(companyName);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onView = useCallback((id) => setRecordId(id), []);

    const resetFilters = () => updateFilters({ ...EMPTY_FILTERS, ...period });

    /* ---------- render ---------- */

    const accessMessage = accessError && (
        <div className="chart-card">
            <div className="challan-state-message">
                <h5>{accessError === 403 ? "No access to this company" : "Company not found"}</h5>
                <div>
                    {accessError === 403
                        ? `You don't have access to challan data for "${selectedCompany}".`
                        : `No company named "${selectedCompany}" was found.`}
                </div>
                <button className="btn btn-primary btn-sm mt-2" onClick={() => setSelectedCompany?.("")}>
                    View all companies
                </button>
            </div>
        </div>
    );

    return (
        <div>
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />

            {isCompanyMode && !accessError && (
                <div className="d-flex align-items-center gap-2 mb-2 small">
                    <span className="text-muted">Company-wise view:</span>
                    <span className="fw-600">{selectedCompany}</span>
                    <button className="btn btn-link btn-sm p-0" onClick={() => setSelectedCompany?.("")}>
                        View all companies
                    </button>
                </div>
            )}

            {accessError ? (
                accessMessage
            ) : (
                <>
                    <ChallanFilterBar
                        filterOptions={filterOptions}
                        filters={filters}
                        onChange={updateFilters}
                        onClear={resetFilters}
                    />

                    {shouldShow("ch-1") && (
                        <SummaryWidget selection={cardSelection("ch-1")} loading={loading} summary={data.summary} onDrill={onDrill} />
                    )}

                    {!isCompanyMode && shouldShow("ch-8") && (
                        <CompanyWiseWidget
                            selection={cardSelection("ch-8")}
                            loading={loading}
                            companyWise={data.companyWise}
                            onOpenCompany={onOpenCompany}
                        />
                    )}

                    <div className="charts-grid">
                        {shouldShow("ch-2") && (
                            <TrendWidget selection={cardSelection("ch-2")} loading={loading} trend={data.trend} onDrill={onDrill} />
                        )}
                        {shouldShow("ch-3") && (
                            <ActWiseWidget selection={cardSelection("ch-3")} loading={loading} actWise={data.actWise} onDrill={onDrill} />
                        )}
                    </div>

                    {shouldShow("ch-4") && (
                        <LocationGridWidget
                            selection={cardSelection("ch-4")}
                            loading={loading}
                            locationWise={data.locationWise}
                            onDrill={onDrill}
                        />
                    )}

                    {shouldShow("ch-5") && (
                        <TurnaroundWidget
                            selection={cardSelection("ch-5")}
                            loading={loading}
                            turnaround={data.turnaround}
                            onDrill={onDrill}
                        />
                    )}

                    {ready && shouldShow("ch-6") && (
                        <ExceptionsWidget
                            selection={cardSelection("ch-6")}
                            loading={loading}
                            params={params}
                            total={data.summary?.exceptions}
                            isCompanyMode={isCompanyMode}
                            onView={onView}
                        />
                    )}

                    {ready && showRecords && (
                        <RecordsWidget
                            ref={recordsRef}
                            selection={cardSelection("ch-7")}
                            loading={loading}
                            params={params}
                            columns={filterOptions?.columns}
                            total={data.summary?.total}
                            onView={onView}
                        />
                    )}
                </>
            )}

            <RecordDetailDrawer
                recordId={recordId}
                companyName={selectedCompany}
                onClose={() => setRecordId(null)}
            />
        </div>
    );
};

export default ChallanDashboard;
