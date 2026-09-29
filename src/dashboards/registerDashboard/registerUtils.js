// Register Dashboard constants; shared helpers live in ../common/dashboardUtils

// Identity filters narrow everything: execution, applicability and coverage
export const IDENTITY_MULTI_KEYS = ["state", "city", "location", "register_name", "act", "form_id"];
export const IDENTITY_SINGLE_KEYS = ["month_from", "month_to"];

// Execution filters narrow execution metrics and lists only; applicability counts and coverage ignore them
export const EXECUTION_MULTI_KEYS = [
    "closure_status",
    "maintained_by",
    "raw_data_type",
    "variance_type",
    "review_status",
    "prepared_by",
    "reviewed_by",
    "frequency",
];
export const EXECUTION_SINGLE_KEYS = [
    "sla_met",
    "variance",
    "completed",
    "overdue",
    "variance_open",
    "exceptions_only",
    "data_issues_only",
    "search",
];

// Widget-only params: kept in the URL but not sent to every endpoint
export const WIDGET_ONLY_KEYS = ["coverage_status", "sheet"];

export const MULTI_FILTER_KEYS = [...IDENTITY_MULTI_KEYS, ...EXECUTION_MULTI_KEYS, "coverage_status"];
export const SINGLE_FILTER_KEYS = [...IDENTITY_SINGLE_KEYS, ...EXECUTION_SINGLE_KEYS, "sheet"];

export const hasExecutionFilters = (filters) =>
    EXECUTION_MULTI_KEYS.some((key) => filters[key]?.length) || EXECUTION_SINGLE_KEYS.some((key) => filters[key]);

/* ---------- coverage ---------- */

export const COVERAGE_STATUSES = {
    completed: { label: "Completed", color: "#14b8a6", badge: "complied" },
    in_progress: { label: "In progress", color: "#fbbf24", badge: "overdue" },
    not_started: { label: "Not started", color: "#f87171", badge: "non-complied" },
};

// Months before applicability data exists report applicable = 0; that is "no data", not 0%
export const hasApplicability = (coverage) => (coverage?.applicable ?? 0) > 0;

/* ---------- location x month grid ---------- */

export const GRID_STATUSES = {
    completed: { label: "Completed", bg: "#14b8a6", color: "white" },
    partial: { label: "Partial", bg: "#fbbf24", color: "#422006" },
    pending: { label: "Pending", bg: "#fb923c", color: "white" },
    not_started: { label: "Not started", bg: "#f87171", color: "white" },
    no_data: { label: "No applicability data", bg: "#d1d5db", color: "#374151" },
};

/* ---------- records ---------- */

export const RECORD_SHEETS = [
    { key: "execution", label: "Execution" },
    { key: "applicability", label: "Applicability" },
    { key: "master", label: "Master catalogue" },
];

// Record keys are normalized Excel headers; these are the default visible columns per sheet
export const DEFAULT_RECORD_COLUMNS = {
    execution: [
        "company_name",
        "location",
        "register_name",
        "form_id",
        "month_label",
        "planned_register_date",
        "actual_register_date",
        "closure_status",
        "sla_met?_(y_n)",
        "variance_flag_(y_n)",
    ],
    applicability: [
        "company_name",
        "location",
        "register_name",
        "form_id",
        "applicable_act",
        "register_month",
        "register_year",
        "is_applicable?_(y_n)",
        "maintained_by",
        "sla_(days)",
    ],
    master: [
        "register_name",
        "form_id",
        "applicable_act",
        "state",
        "frequency",
        "maintained_by",
        "sla_(days)",
        "document_retention_period",
        "regulatory_authority",
    ],
};

// Columns read from row.computed rather than the uploaded row
export const COMPUTED_RECORD_COLUMNS = {
    execution: [
        { key: "month_label", label: "Month", section: "Computed", after: "form_id" },
        { key: "days_late", label: "Days Late", section: "Computed" },
    ],
    applicability: [{ key: "month_label", label: "Month", section: "Computed", after: "form_id" }],
    master: [],
};

// Record column key -> backend sort_by value; columns missing here are not sortable
export const SORT_BY_FOR_COLUMN = {
    month_label: "month",
    company_name: "company_name",
    state: "state",
    city: "city",
    location: "location",
    register_name: "register_name",
    form_id: "form_id",
    applicable_act: "act",
    closure_status: "closure_status",
    maintained_by: "maintained_by",
    raw_data_type: "raw_data_type",
    review_status: "review_status",
    days_late: "days_late",
    data_received_date: "data_received_date",
    sanitised_on: "sanitised_on",
    variance_date: "variance_date",
    preparation_date: "preparation_date",
    review_date: "review_date",
    hod_review_date: "hod_review_date",
    shared_date: "shared_date",
    planned_register_date: "planned_register_date",
    actual_register_date: "actual_register_date",
};

// The master sheet is a catalogue: company and execution filters don't apply to it
export const MASTER_FILTER_KEYS = ["state", "register_name", "act", "form_id", "frequency", "search"];

// variance_date and planned_register_date sit outside the process sequence in the timeline
export const TIMELINE_STEP_KINDS = { variance_date: "marker", planned_register_date: "deadline" };
