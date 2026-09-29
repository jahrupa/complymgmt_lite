import React from "react";
import { DebouncedSearch, MultiFilter, PeriodFilter, SingleFilter, ToggleChip } from "../common/FilterControls";
import { YES_NO_OPTIONS, locationOptionsFor } from "../common/dashboardUtils";
import { COMPLIANCE_BUCKETS } from "./returnsUtils";

const TOGGLES = [
    { key: "overdue", label: "Overdue" },
    { key: "at_risk", label: "At risk" },
    { key: "exceptions_only", label: "Exceptions only" },
    { key: "data_issues_only", label: "Data issues only" },
];

const FLAGS = [
    { key: "filed", label: "Filed" },
    { key: "on_time", label: "On Time" },
    { key: "compliance_risk", label: "Compliance Risk" },
    { key: "fine_risk", label: "Fine Risk" },
    { key: "escalation", label: "Escalation" },
];

// Row 1 narrows everything (due month / period / act: filings only; frequency / responsibility:
// applicability only). Row 2 narrows filing metrics and lists, never applicability or coverage.
const ReturnsFilterBar = ({ filterOptions, filters, onChange, onClear }) => {
    const opts = filterOptions || {};
    const set = (key) => (value) => onChange({ [key]: value });

    return (
        <div className="dw-filter-bar">
            <div className="d-flex flex-wrap gap-2 align-items-center">
                <PeriodFilter months={opts.due_months} monthFrom={filters.month_from} monthTo={filters.month_to} onChange={onChange} />
                <MultiFilter
                    label="Period"
                    value={filters.period}
                    options={(opts.periods || []).map((p) => ({ value: p.period, label: p.label }))}
                    onChange={set("period")}
                    width={220}
                />
                <MultiFilter label="State" value={filters.state} options={opts.states} onChange={set("state")} />
                <MultiFilter
                    label="Location"
                    value={filters.location}
                    options={locationOptionsFor(opts.locations, filters.state)}
                    onChange={set("location")}
                />
                <MultiFilter label="Return" value={filters.return_name} options={opts.return_names} onChange={set("return_name")} width={240} />
                <MultiFilter label="Act" value={filters.act} options={opts.acts} onChange={set("act")} width={220} />
                <MultiFilter label="Frequency" value={filters.frequency} options={opts.frequencies} onChange={set("frequency")} width={150} />
                <MultiFilter label="Responsibility" value={filters.responsibility} options={opts.responsibilities} onChange={set("responsibility")} width={160} />
            </div>
            <div className="small text-muted mt-3 mb-1">Filing status filters (not applied to applicability or coverage)</div>
            <div className="d-flex flex-wrap gap-2 align-items-center">
                <MultiFilter
                    label="Compliance Status"
                    value={filters.compliance_status}
                    options={COMPLIANCE_BUCKETS}
                    onChange={set("compliance_status")}
                    width={200}
                />
                {FLAGS.map((f) => (
                    <SingleFilter key={f.key} label={f.label} value={filters[f.key]} options={YES_NO_OPTIONS} emptyLabel="Any" onChange={set(f.key)} width={135} />
                ))}
            </div>
            <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
                <DebouncedSearch
                    value={filters.search}
                    onChange={set("search")}
                    placeholder="Company, location, return, act, period, remarks…"
                />
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

export default ReturnsFilterBar;
