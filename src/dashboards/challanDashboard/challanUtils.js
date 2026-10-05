// Challan Dashboard constants; shared helpers live in ../common/dashboardUtils

// Multi-select filters, sent as comma separated values
export const MULTI_FILTER_KEYS = [
    "state",
    "location",
    "act",
    "compliance_status",
    "payment_responsibility",
    "frequency",
    "registration_no",
    "maker",
    "checker",
    "wage_month",
];

// Single value filters
export const SINGLE_FILTER_KEYS = [
    "month_from",
    "month_to",
    "search",
    "paid_on_time",
    "overdue",
    "exceptions_only",
    "data_issues_only",
];

// Record keys come from normalized Excel headers; these are the columns shown by default
export const DEFAULT_RECORD_COLUMNS = [
    "company_name",
    "state",
    "location",
    "act_(pf_esi_pt_lwf)",
    "wage_month",
    "due_date",
    "challan_payment_date",
    "challan_amount",
    "challan_paid_within_due_date?_(y_n)",
    "compliance_status",
];

// Record column key -> backend sort_by value; columns missing here are not sortable
export const SORT_BY_FOR_COLUMN = {
    wage_month: "month",
    company_name: "company_name",
    state: "state",
    location: "location",
    "act_(pf_esi_pt_lwf)": "act",
    compliance_status: "compliance_status",
    challan_amount: "amount",
    "estimated_penalty_(₹)": "penalty",
    days_late: "days_late",
    due_date: "due_date",
    challan_payment_date: "challan_payment_date",
    data_requested_date: "data_requested_date",
    data_received_date: "data_received_date",
    checklist_prepared_date: "checklist_prepared_date",
    checklist_approved_date: "checklist_approved_date",
    challan_prepared_date: "challan_prepared_date",
};

// Days late is computed by the backend, not part of the uploaded row
export const COMPUTED_RECORD_COLUMNS = [{ key: "days_late", label: "Days Late", section: "Computed" }];

// The due date is a deadline marker in the record timeline, not a process step
export const TIMELINE_STEP_KINDS = { due_date: "deadline" };

export const ACT_KEY = "act_(pf_esi_pt_lwf)";
