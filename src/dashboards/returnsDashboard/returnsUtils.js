// Returns Dashboard constants; shared helpers live in ../common/dashboardUtils

// Filters that narrow everything
export const SCOPE_MULTI_KEYS = ["state", "location", "return_name"];
// Transactions only (due month range also narrows coverage)
export const TRANSACTION_MULTI_KEYS = ["period", "act"];
export const TRANSACTION_SINGLE_KEYS = ["month_from", "month_to"];
// Applicability only
export const APPLICABILITY_MULTI_KEYS = ["frequency", "responsibility"];

// Status, flags and search narrow transaction metrics and lists, never applicability counts or coverage
export const STATUS_MULTI_KEYS = ["compliance_status"];
export const STATUS_SINGLE_KEYS = [
    "compliance_risk",
    "fine_risk",
    "escalation",
    "filed",
    "on_time",
    "overdue",
    "at_risk",
    "exceptions_only",
    "data_issues_only",
    "search",
];

// Widget-only params: kept in the URL but not sent to every endpoint
export const WIDGET_ONLY_KEYS = ["coverage_status", "sheet"];

export const MULTI_FILTER_KEYS = [
    ...SCOPE_MULTI_KEYS,
    ...TRANSACTION_MULTI_KEYS,
    ...APPLICABILITY_MULTI_KEYS,
    ...STATUS_MULTI_KEYS,
    "coverage_status",
];
export const SINGLE_FILTER_KEYS = [...TRANSACTION_SINGLE_KEYS, ...STATUS_SINGLE_KEYS, "sheet"];

export const hasStatusFilters = (filters) =>
    STATUS_MULTI_KEYS.some((key) => filters[key]?.length) || STATUS_SINGLE_KEYS.some((key) => filters[key]);

// compliance_status accepts raw values or these buckets
export const COMPLIANCE_BUCKETS = [
    { value: "compliant", label: "Compliant" },
    { value: "non_compliant", label: "Non-compliant" },
    { value: "partial", label: "Partially compliant" },
];

/* ---------- coverage (per location) ---------- */

export const COVERAGE_STATUSES = {
    covered: { label: "Covered", color: "#14b8a6", badge: "complied" },
    not_covered: { label: "Not covered", color: "#f87171", badge: "non-complied" },
    transaction_only: { label: "Transaction only", color: "#6366f1", badge: "neutral" },
};

export const hasApplicableLocations = (coverage) => (coverage?.applicable_locations ?? 0) > 0;

/* ---------- location x due month grid ---------- */

export const GRID_STATUSES = {
    filed: { label: "Filed", bg: "#14b8a6", color: "white" },
    partial: { label: "Partly filed", bg: "#fbbf24", color: "#422006" },
    not_filed: { label: "Not filed", bg: "#f87171", color: "white" },
    attention: { label: "Needs attention", bg: "#fb923c", color: "white" },
};

/* ---------- records ---------- */

export const RECORD_SHEETS = [
    { key: "transaction", label: "Transactions" },
    { key: "applicability", label: "Applicability" },
    { key: "master", label: "Master catalogue" },
];

export const COMPLIANCE_STATUS_KEY = "compliance_status_(compliant_non_compliant_partial_compliant)";

// The raw "Delay Days" column is days filed BEFORE the due date (and junk for unfiled rows), so it
// is never shown by default and is relabelled in the column picker; computed.days_late is the delay
export const COLUMN_LABEL_OVERRIDES = {
    delay_days: "Delay Days (raw upload: days filed before due, not a delay)",
};

export const DEFAULT_RECORD_COLUMNS = {
    transaction: [
        "company_name",
        "location_name",
        "return_name",
        "act",
        "period",
        "return_due_date",
        "return_filed_date",
        "days_late",
        COMPLIANCE_STATUS_KEY,
    ],
    applicability: [
        "company_name",
        "state",
        "location_name",
        "return_name",
        "applicable_(y_n)",
        "frequency",
        "responsibility_(client_karma_associate)",
        "special_comments",
    ],
    master: [
        "return_name",
        "linked_act",
        "frequency",
        "online_offline_mode",
        "linked_register_(if_any)",
        "general_responsible_party",
        "notes",
    ],
};

// Columns read from row.computed rather than the uploaded row
export const COMPUTED_RECORD_COLUMNS = {
    transaction: [
        { key: "due_month_label", label: "Due Month", section: "Computed", after: "period" },
        { key: "days_late", label: "Days Late", section: "Computed", after: "return_filed_date" },
    ],
    applicability: [],
    master: [],
};

// Record column key -> backend sort_by value; columns missing here are not sortable
export const SORT_BY_FOR_COLUMN = {
    due_month_label: "due_month",
    period: "period",
    company_name: "company_name",
    state: "state",
    location_name: "location",
    return_name: "return_name",
    act: "act",
    frequency: "frequency",
    [COMPLIANCE_STATUS_KEY]: "compliance_status",
    days_late: "days_late",
    fine_estimated_amount: "fine_amount",
    data_requested_date: "data_requested_date",
    data_received_date: "data_received_date",
    return_prepared_date: "return_prepared_date",
    return_filed_date: "return_filed_date",
    planned_filing_date: "planned_filing_date",
    return_due_date: "return_due_date",
    acknowledgement_date: "acknowledgement_date",
};

// The master sheet is a catalogue: company, location and transaction filters don't apply to it
// (its return names also differ from the transaction sheet, so only free-text search is passed)
export const MASTER_FILTER_KEYS = ["search"];

// Planned filing date and due date sit outside the process sequence in the timeline
export const TIMELINE_STEP_KINDS = { planned_filing_date: "marker", return_due_date: "deadline" };
