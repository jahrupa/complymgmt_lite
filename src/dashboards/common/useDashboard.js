import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    applyFiltersToSearchParams,
    emptyFilters,
    errorStatus,
    filtersFromSearchParams,
} from "./dashboardUtils";

/**
 * Set when a dashboard is rendered as a widget preview (e.g. on the Widget Access page). The
 * dashboard then keeps its filters in memory instead of reading and writing the page URL.
 */
export const WidgetPreviewContext = createContext(null);

// URLSearchParams-like state that lives in memory, with the same setter signature as useSearchParams
const useMemorySearchParams = () => {
    const [params, setParams] = useState(() => new URLSearchParams());
    const setSearchParams = useCallback(
        (next) => setParams((prev) => new URLSearchParams(typeof next === "function" ? next(prev) : next)),
        []
    );
    return [params, setSearchParams];
};

/**
 * Filter state kept in the URL query string.
 *
 * All dashboard tabs stay mounted and share one URL, so a dashboard only follows the URL while
 * it is the active tab and keeps its last filters otherwise. On first activation without any of
 * its filters in the URL it applies `defaultPeriod` (pass null until the period options are known),
 * unless the URL has `range=all` (e.g. a cockpit drill-down showing current status, all months).
 * In a widget preview the same logic runs on in-memory params, so the host page's URL is untouched.
 */
export const useDashboardFilters = ({ multiKeys, singleKeys, isActive, defaultPeriod }) => {
    const preview = useContext(WidgetPreviewContext);
    const urlParams = useSearchParams();
    const memoryParams = useMemorySearchParams();
    const [searchParams, setSearchParams] = preview ? memoryParams : urlParams;

    const liveJson = JSON.stringify(filtersFromSearchParams(searchParams, multiKeys, singleKeys));
    const frozenJsonRef = useRef(liveJson);
    if (isActive) frozenJsonRef.current = liveJson;
    const filtersJson = frozenJsonRef.current;
    const filters = useMemo(() => JSON.parse(filtersJson), [filtersJson]);

    const updateFilters = useCallback(
        (patch, options) => {
            setSearchParams(
                (prev) =>
                    applyFiltersToSearchParams(prev, {
                        ...filtersFromSearchParams(prev, multiKeys, singleKeys),
                        ...patch,
                    }),
                options
            );
        },
        // key lists are module constants
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [setSearchParams]
    );

    const [activated, setActivated] = useState(false);
    const [periodReady, setPeriodReady] = useState(false);
    const needsDefaultRef = useRef(false);

    useEffect(() => {
        if (!isActive || activated) return;
        needsDefaultRef.current =
            searchParams.get("range") !== "all" && ![...multiKeys, ...singleKeys].some((key) => searchParams.has(key));
        setActivated(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- runs on first activation only
    }, [isActive]);

    useEffect(() => {
        if (!activated || periodReady) return;
        if (needsDefaultRef.current) {
            if (!defaultPeriod) return; // wait for the period options
            if (defaultPeriod.month_from) updateFilters(defaultPeriod, { replace: true });
        }
        setPeriodReady(true);
    }, [activated, periodReady, defaultPeriod, updateFilters]);

    const resetFilters = useCallback(
        () => updateFilters({ ...emptyFilters(multiKeys, singleKeys), ...(defaultPeriod || {}) }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [updateFilters, defaultPeriod]
    );

    return { filters, updateFilters, resetFilters, activated, ready: activated && periodReady };
};

/** Filter dropdown options; only the company narrows them. 403/404 are reported as accessError. */
export const useFilterOptions = (fetchFilters, companyName, enabled) => {
    const [options, setOptions] = useState(null);
    const [accessError, setAccessError] = useState(null);

    useEffect(() => {
        if (!enabled) return;
        let cancelled = false;
        setAccessError(null);
        fetchFilters(companyName)
            .then((res) => !cancelled && setOptions(res?.data || {}))
            .catch((error) => {
                if (cancelled) return;
                setOptions({});
                const status = errorStatus(error);
                if (companyName && (status === 403 || status === 404)) setAccessError(status);
            });
        return () => {
            cancelled = true;
        };
    }, [fetchFilters, companyName, enabled]);

    return { options, accessError };
};

/**
 * Loads every widget endpoint with the same params. `fetchers` maps a data key to
 * `{ fetch(params), fallback, skip }`; ignored responses from older filter sets are dropped.
 */
export const useDashboardData = ({ fetchers, params, enabled, isCompanyMode, onError }) => {
    const initial = useMemo(
        () => Object.fromEntries(Object.entries(fetchers).map(([key, f]) => [key, f.fallback])),
        // eslint-disable-next-line react-hooks/exhaustive-deps -- fallbacks never change
        []
    );
    const [data, setData] = useState(initial);
    const [loading, setLoading] = useState(true);
    const [accessError, setAccessError] = useState(null);
    const requestIdRef = useRef(0);
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    useEffect(() => {
        if (!enabled) return;
        const requestId = ++requestIdRef.current;
        const entries = Object.entries(fetchers);
        setLoading(true);

        Promise.allSettled(
            entries.map(([, f]) => (f.skip ? Promise.resolve({ data: f.fallback }) : f.fetch(params)))
        ).then((results) => {
            // A newer filter change already started another request
            if (requestId !== requestIdRef.current) return;

            const failed = results.filter((r) => r.status === "rejected");
            const status = failed.map((r) => errorStatus(r.reason)).find((s) => s === 403 || s === 404);

            if (isCompanyMode && status) {
                setAccessError(status);
                setData(initial);
            } else {
                setAccessError(null);
                setData(
                    Object.fromEntries(
                        entries.map(([key, f], i) => [
                            key,
                            results[i].status === "fulfilled" ? results[i].value?.data ?? f.fallback : f.fallback,
                        ])
                    )
                );
                if (failed.length) {
                    onErrorRef.current?.(failed[0].reason?.response?.data?.message || "Some widgets could not be loaded");
                }
            }
            setLoading(false);
        });
        // fetchers is rebuilt every render; params captures everything it depends on
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, enabled, isCompanyMode]);

    return { data, loading, accessError };
};
