import React from "react";
import { DebouncedSearch, MultiFilter, SingleFilter, ToggleChip } from "../common/FilterControls";
import { YES_NO_OPTIONS, locationOptionsFor, recentMonths } from "../common/dashboardUtils";
import { AVAILABLE_OPTIONS, VALIDITY, validityLabel } from "./licenseUtils";

const TOGGLES = [
    { key: "follow_up_overdue", label: "Follow-up overdue" },
    { key: "billing_pending", label: "Billing pending" },
    { key: "exceptions_only", label: "Exceptions only" },
    { key: "data_issues_only", label: "Data issues only" },
];

const FLAGS = [
    { key: "sla_breach", label: "SLA Breach" },
    { key: "document_uploaded", label: "Doc Uploaded" },
    { key: "completed", label: "Completed" },
];

const EXPIRING_WITHIN = [30, 60, 90].map((d) => ({ value: String(d), label: `${d} days` }));

const monthOptions = (months = []) => months.filter((m) => m.month).map((m) => ({ value: m.month, label: m.label }));

// Coverage period (matches the cockpit's license tile); the last two years
const COVERAGE_MONTHS = monthOptions(recentMonths(24));

const LicenseFilterBar = ({ filterOptions, filters, onChange, onClear }) => {
    const opts = filterOptions || {};
    const set = (key) => (value) => onChange({ [key]: value });
    const requestMonths = monthOptions(opts.request_months);
    const expiryMonths = monthOptions(opts.expiry_months);

    // Keep the coverage range valid (from <= to) as it is picked
    const setCoverage = (key) => (value) => {
        const next = { month_from: filters.month_from, month_to: filters.month_to, [key]: value };
        if (next.month_from && next.month_to && next.month_from > next.month_to) {
            if (key === "month_from") next.month_to = value;
            else next.month_from = value;
        }
        onChange(next);
    };

    return (
        <div className="dw-filter-bar">
            <div className="d-flex flex-wrap gap-2 align-items-center">
                <MultiFilter
                    label="Validity"
                    value={filters.validity}
                    options={(opts.validities || Object.keys(VALIDITY)).map((v) => ({ value: v, label: validityLabel(v) }))}
                    onChange={set("validity")}
                    width={170}
                />
                <SingleFilter label="Expiring Within" value={filters.expiring_within} options={EXPIRING_WITHIN} emptyLabel="Any" onChange={set("expiring_within")} width={150} />
                <MultiFilter label="License Type" value={filters.license_type} options={opts.license_types} onChange={set("license_type")} width={200} />
                <MultiFilter label="State" value={filters.state} options={opts.states} onChange={set("state")} />
                <MultiFilter
                    label="Location"
                    value={filters.location}
                    options={locationOptionsFor(opts.locations, filters.state)}
                    onChange={set("location")}
                />
                <MultiFilter label="Site" value={filters.site} options={opts.sites} onChange={set("site")} width={200} />
                <MultiFilter label="Authority" value={filters.authority} options={opts.authorities} onChange={set("authority")} width={200} />
                <MultiFilter label="Application Type" value={filters.application_type} options={opts.application_types} onChange={set("application_type")} width={170} />
                <MultiFilter label="Industry" value={filters.industry} options={opts.industries} onChange={set("industry")} width={160} />
                <MultiFilter label="Company Type" value={filters.company_type} options={opts.company_types} onChange={set("company_type")} width={160} />
            </div>
            <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
                <MultiFilter label="Status" value={filters.status} options={opts.statuses} onChange={set("status")} width={160} />
                <MultiFilter label="Documents Status" value={filters.documents_status} options={opts.documents_statuses} onChange={set("documents_status")} width={170} />
                <MultiFilter label="KAO" value={filters.kao} options={opts.kaos} onChange={set("kao")} width={160} />
                <MultiFilter label="Internal Owner" value={filters.internal_owner} options={opts.internal_owners} onChange={set("internal_owner")} width={170} />
                <MultiFilter label="Available" value={filters.available} options={AVAILABLE_OPTIONS} onChange={set("available")} width={130} />
                <SingleFilter label="Requested From" value={filters.request_month_from} options={requestMonths} emptyLabel="Any" onChange={set("request_month_from")} />
                <SingleFilter label="Requested To" value={filters.request_month_to} options={requestMonths} emptyLabel="Any" onChange={set("request_month_to")} />
                <SingleFilter label="Expires From" value={filters.expiry_month_from} options={expiryMonths} emptyLabel="Any" onChange={set("expiry_month_from")} />
                <SingleFilter label="Expires To" value={filters.expiry_month_to} options={expiryMonths} emptyLabel="Any" onChange={set("expiry_month_to")} />
                <SingleFilter label="Coverage From" value={filters.month_from} options={COVERAGE_MONTHS} emptyLabel="None" onChange={setCoverage("month_from")} width={160} />
                <SingleFilter label="Coverage To" value={filters.month_to} options={COVERAGE_MONTHS} emptyLabel="None" onChange={setCoverage("month_to")} width={160} />
            </div>
            <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
                <DebouncedSearch
                    value={filters.search}
                    onChange={set("search")}
                    placeholder="Company, site, location, license no., authority, notes…"
                />
                {FLAGS.map((f) => (
                    <SingleFilter key={f.key} label={f.label} value={filters[f.key]} options={YES_NO_OPTIONS} emptyLabel="Any" onChange={set(f.key)} width={135} />
                ))}
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

export default LicenseFilterBar;
