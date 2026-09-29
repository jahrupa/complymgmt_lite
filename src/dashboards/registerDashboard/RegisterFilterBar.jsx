import React from "react";
import {
    DebouncedSearch,
    MultiFilter,
    PeriodFilter,
    SingleFilter,
    ToggleChip,
} from "../common/FilterControls";
import { YES_NO_OPTIONS, locationOptionsFor } from "../common/dashboardUtils";

const TOGGLES = [
    { key: "overdue", label: "Overdue" },
    { key: "variance_open", label: "Variance open" },
    { key: "exceptions_only", label: "Exceptions only" },
    { key: "data_issues_only", label: "Data issues only" },
];

// Identity filters (first row) narrow everything; execution filters (second row) narrow execution only
const RegisterFilterBar = ({ filterOptions, filters, onChange, onClear }) => {
    const opts = filterOptions || {};
    const set = (key) => (value) => onChange({ [key]: value });

    return (
        <div className="dw-filter-bar">
            <div className="d-flex flex-wrap gap-2 align-items-center">
                <PeriodFilter months={opts.months} monthFrom={filters.month_from} monthTo={filters.month_to} onChange={onChange} />
                <MultiFilter label="State" value={filters.state} options={opts.states} onChange={set("state")} />
                <MultiFilter label="City" value={filters.city} options={opts.cities} onChange={set("city")} />
                <MultiFilter
                    label="Location"
                    value={filters.location}
                    options={locationOptionsFor(opts.locations, filters.state)}
                    onChange={set("location")}
                />
                <MultiFilter label="Register" value={filters.register_name} options={opts.register_names} onChange={set("register_name")} width={220} />
                <MultiFilter label="Act" value={filters.act} options={opts.acts} onChange={set("act")} width={220} />
                <MultiFilter label="Form" value={filters.form_id} options={opts.form_ids} onChange={set("form_id")} width={140} />
            </div>
            <div className="small text-muted mt-3 mb-1">Execution filters (not applied to applicability or coverage)</div>
            <div className="d-flex flex-wrap gap-2 align-items-center">
                <MultiFilter label="Closure Status" value={filters.closure_status} options={opts.closure_statuses} onChange={set("closure_status")} />
                <MultiFilter label="Maintained By" value={filters.maintained_by} options={opts.maintained_by} onChange={set("maintained_by")} />
                <MultiFilter label="Raw Data Type" value={filters.raw_data_type} options={opts.raw_data_types} onChange={set("raw_data_type")} />
                <MultiFilter label="Variance Type" value={filters.variance_type} options={opts.variance_types} onChange={set("variance_type")} />
                <MultiFilter label="Review Status" value={filters.review_status} options={opts.review_statuses} onChange={set("review_status")} />
                <MultiFilter label="Prepared By" value={filters.prepared_by} options={opts.prepared_by} onChange={set("prepared_by")} />
                <MultiFilter label="Reviewed By" value={filters.reviewed_by} options={opts.reviewed_by} onChange={set("reviewed_by")} />
                <MultiFilter label="Frequency" value={filters.frequency} options={opts.frequencies} onChange={set("frequency")} />
            </div>
            <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
                <DebouncedSearch
                    value={filters.search}
                    onChange={set("search")}
                    placeholder="Company, location, register, form, act, variance, remarks…"
                />
                <SingleFilter label="Completed" value={filters.completed} options={YES_NO_OPTIONS} emptyLabel="Any" onChange={set("completed")} width={130} />
                <SingleFilter label="SLA Met" value={filters.sla_met} options={YES_NO_OPTIONS} emptyLabel="Any" onChange={set("sla_met")} width={130} />
                <SingleFilter label="Variance" value={filters.variance} options={YES_NO_OPTIONS} emptyLabel="Any" onChange={set("variance")} width={130} />
                {TOGGLES.map((t) => (
                    <ToggleChip key={t.key} label={t.label} value={filters[t.key]} onChange={set(t.key)} />
                ))}
                <button className="btn btn-outline-secondary btn-sm ms-auto" onClick={onClear}>
                    Reset filters
                </button>
            </div>
        </div>
    );
};

export default RegisterFilterBar;
