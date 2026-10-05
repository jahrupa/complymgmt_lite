import React from "react";
import { Chip } from "@mui/material";
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
    { key: "exceptions_only", label: "Exceptions only" },
    { key: "data_issues_only", label: "Data issues only" },
];

const ChallanFilterBar = ({ filterOptions, filters, onChange, onClear }) => {
    const opts = filterOptions || {};
    const set = (key) => (value) => onChange({ [key]: value });

    return (
        <div className="dw-filter-bar">
            <div className="d-flex flex-wrap gap-2 align-items-center">
                <PeriodFilter months={opts.wage_months} monthFrom={filters.month_from} monthTo={filters.month_to} onChange={onChange} />
                <MultiFilter label="State" value={filters.state} options={opts.states} onChange={set("state")} />
                <MultiFilter
                    label="Location"
                    value={filters.location}
                    options={locationOptionsFor(opts.locations, filters.state)}
                    onChange={set("location")}
                />
                <MultiFilter label="Act" value={filters.act} options={opts.acts} onChange={set("act")} />
                <MultiFilter
                    label="Compliance Status"
                    value={filters.compliance_status}
                    options={opts.compliance_statuses}
                    onChange={set("compliance_status")}
                />
                <MultiFilter
                    label="Payment Responsibility"
                    value={filters.payment_responsibility}
                    options={opts.payment_responsibilities}
                    onChange={set("payment_responsibility")}
                />
                <MultiFilter label="Frequency" value={filters.frequency} options={opts.frequencies} onChange={set("frequency")} />
                <MultiFilter label="Maker" value={filters.maker} options={opts.makers} onChange={set("maker")} />
                <MultiFilter label="Checker" value={filters.checker} options={opts.checkers} onChange={set("checker")} />
            </div>
            <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
                <DebouncedSearch
                    value={filters.search}
                    onChange={set("search")}
                    placeholder="Company, location, act, registration no, remarks…"
                />
                <SingleFilter
                    label="Paid On Time"
                    value={filters.paid_on_time}
                    options={YES_NO_OPTIONS}
                    emptyLabel="Any"
                    onChange={set("paid_on_time")}
                />
                {TOGGLES.map((t) => (
                    <ToggleChip key={t.key} label={t.label} value={filters[t.key]} onChange={set(t.key)} />
                ))}
                {filters.wage_month.length > 0 && (
                    <Chip label={`Wage month: ${filters.wage_month.join(", ")}`} onDelete={() => onChange({ wage_month: [] })} />
                )}
                {filters.registration_no.length > 0 && (
                    <Chip label={`Registration: ${filters.registration_no.join(", ")}`} onDelete={() => onChange({ registration_no: [] })} />
                )}
                <button className="btn btn-outline-secondary btn-sm ms-auto" onClick={onClear}>
                    Reset filters
                </button>
            </div>
        </div>
    );
};

export default ChallanFilterBar;
