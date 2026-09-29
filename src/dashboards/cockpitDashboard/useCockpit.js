import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchCockpitFilters } from "../../api/service";
import { useDashboardFilters, useFilterOptions } from "../common/useDashboard";
import { DRILL_KEYS, MULTI_FILTER_KEYS, NO_DEFAULT_PERIOD, SINGLE_FILTER_KEYS } from "./cockpitUtils";

/**
 * Filters, filter options and request params shared by both cockpit pages. `openModule(tab)` opens
 * a module dashboard with the same company, state, location, search and month range.
 */
export const useCockpit = ({ selectedCompany, isActive, openTab }) => {
    const { filters, updateFilters, resetFilters, activated, ready } = useDashboardFilters({
        multiKeys: MULTI_FILTER_KEYS,
        singleKeys: SINGLE_FILTER_KEYS,
        isActive,
        defaultPeriod: NO_DEFAULT_PERIOD,
    });

    const { options: filterOptions, accessError: optionsAccessError } = useFilterOptions(
        fetchCockpitFilters,
        selectedCompany,
        activated
    );

    const params = useMemo(() => ({ ...filters, company_name: selectedCompany }), [filters, selectedCompany]);

    const openModule = useCallback(
        (tab, extra = {}) => {
            const drill = Object.fromEntries(DRILL_KEYS.map((key) => [key, filters[key]]));
            // Without a range the cockpit shows current status; tell the module dashboard not to
            // preselect its default period so both show the same numbers
            if (!filters.month_from && !filters.month_to) drill.range = "all";
            openTab(tab, { ...drill, ...extra });
        },
        [filters, openTab]
    );

    // A bad month range comes back as 400; its message is shown on the page
    const [loadError, setLoadError] = useState("");
    useEffect(() => setLoadError(""), [params]);

    return {
        filters,
        updateFilters,
        resetFilters,
        ready,
        filterOptions,
        optionsAccessError,
        params,
        openModule,
        loadError,
        setLoadError,
    };
};
