// License Dashboard constants; shared helpers live in ../common/dashboardUtils

// Validity colours are used by every widget: badges, bars, donut, chips
export const VALIDITY = {
    active: { label: "Active", color: "#22c55e", text: "white" },
    expiring: { label: "Expiring", color: "#f59e0b", text: "#422006" },
    expired: { label: "Expired", color: "#ef4444", text: "white" },
    lifetime: { label: "Lifetime", color: "#14b8a6", text: "white" },
    surrendered: { label: "Surrendered", color: "#9ca3af", text: "white" },
    in_progress: { label: "In progress", color: "#3b82f6", text: "white" },
};
export const VALIDITY_ORDER = Object.keys(VALIDITY);

export const validityLabel = (key) => VALIDITY[key]?.label || key;

// Comma separated, case-insensitive exact match (values from /filters)
export const MULTI_FILTER_KEYS = [
    "state",
    "location",
    "license_type",
    "site",
    "authority",
    "application_type",
    "industry",
    "company_type",
    "status",
    "documents_status",
    "kao",
    "internal_owner",
    "available",
    "validity",
];

export const SINGLE_FILTER_KEYS = [
    "expiring_within",
    "request_month_from",
    "request_month_to",
    "expiry_month_from",
    "expiry_month_to",
    "sla_breach",
    "document_uploaded",
    "completed",
    "follow_up_overdue",
    "billing_pending",
    "exceptions_only",
    "data_issues_only",
    "search",
    // widget-only: breakdown dimension
    "breakdown_by",
];

// Widget-only params: kept in the URL but not sent to every endpoint
export const WIDGET_ONLY_KEYS = ["breakdown_by"];

// "available" matches the raw Yes / No text of the "Available Y/N" column
export const AVAILABLE_OPTIONS = ["Yes", "No"];

// Licenses aren't periodic, so the dashboard opens on all licenses (no default period)
export const NO_DEFAULT_PERIOD = {};

// /breakdown?by= dimension -> filter param applied when a bar is clicked (same names)
export const BREAKDOWN_LABELS = {
    license_type: "License type",
    authority: "Authority",
    application_type: "Application type",
    state: "State",
    industry: "Industry",
    company_type: "Company type",
    status: "Status",
    documents_status: "Documents status",
    kao: "KAO",
    internal_owner: "Internal owner",
};
export const DEFAULT_BREAKDOWN = "license_type";

export const EXPIRY_TIMELINE_MONTHS = 12;

/* ---------- records ---------- */

// The raw "Days to Expire" column is only right on the day of upload; it is never shown
export const HIDDEN_RECORD_COLUMNS = ["days_to_expire"];

export const DEFAULT_RECORD_COLUMNS = [
    "company_name",
    "location",
    "license_applicable",
    "license_number",
    "government_authority",
    "status",
    "validity_end_date",
    "days_to_expire",
];

// computed.days_to_expire (negative = days since expiry) replaces the raw column
export const COMPUTED_RECORD_COLUMNS = [
    { key: "days_to_expire", label: "Days to Expiry", section: "Application & Validity", after: "validity_end_date" },
];

// Record column key -> backend sort_by value; "__status" is the validity badge column
export const SORT_BY_FOR_COLUMN = {
    __status: "validity",
    days_to_expire: "days_to_expire",
    license_applicable: "license_type",
    government_authority: "authority",
    new_renewal_amendment_surrender: "application_type",
    company_name: "company_name",
    state: "state",
    location: "location",
    site_name: "site_name",
    status: "status",
    documents_status: "documents_status",
    kao: "kao",
    internal_owner: "internal_owner",
    license_number: "license_number",
    client_request_date: "client_request_date",
    validity_start_date: "validity_start_date",
    validity_end_date: "validity_end_date",
    follow_up_date_for_pending_docs: "follow_up_date_for_pending_docs",
    final_application_proceed_date: "final_application_proceed_date",
};

// Follow-up date and validity end sit outside the process sequence in the timeline
export const TIMELINE_STEP_KINDS = { follow_up_date_for_pending_docs: "marker", validity_end_date: "deadline" };

// "N days left" / "expired N days ago"
export const daysToExpireText = (days) => {
    if (days === null || days === undefined) return "No end date";
    if (days < 0) return `Expired ${Math.abs(days)} day${days === -1 ? "" : "s"} ago`;
    if (days === 0) return "Expires today";
    return `${days} day${days === 1 ? "" : "s"} left`;
};
