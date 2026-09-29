// Helpers shared by the Challan Dashboard widgets

const inrFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

export const formatINR = (val) => inrFormatter.format(Number(val) || 0);

// Lakh / crore short form for KPI tiles, e.g. ₹1.07 Cr, ₹3.6 L
export const formatINRShort = (val) => {
    const num = Number(val) || 0;
    const abs = Math.abs(num);
    if (abs >= 1e7) return `₹${+(num / 1e7).toFixed(2)} Cr`;
    if (abs >= 1e5) return `₹${+(num / 1e5).toFixed(2)} L`;
    if (abs >= 1e3) return `₹${+(num / 1e3).toFixed(1)} K`;
    return formatINR(num);
};

export const formatPercent = (val) => `${+(Number(val) || 0).toFixed(2)}%`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Uploaded dates are raw m/d/yyyy strings; show them as dd MMM yyyy and leave anything else as is
export const formatRawDate = (val) => {
    const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(val ?? "").trim());
    if (!match) return val;
    const [, m, d, y] = match;
    if (m < 1 || m > 12) return val;
    return `${d.padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
};

// YYYY-MM-DD (timeline dates) -> dd MMM yyyy
export const formatIsoDate = (val) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val || "");
    if (!match) return val || "–";
    const [, y, m, d] = match;
    return `${d} ${MONTHS[Number(m) - 1]} ${y}`;
};

/* ---------- filters <-> URL query string ---------- */

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

export const FILTER_KEYS = [...MULTI_FILTER_KEYS, ...SINGLE_FILTER_KEYS];

export const EMPTY_FILTERS = Object.fromEntries([
    ...MULTI_FILTER_KEYS.map((key) => [key, []]),
    ...SINGLE_FILTER_KEYS.map((key) => [key, ""]),
]);

export const filtersFromSearchParams = (searchParams) => {
    const filters = { ...EMPTY_FILTERS };
    MULTI_FILTER_KEYS.forEach((key) => {
        const val = searchParams.get(key);
        filters[key] = val ? val.split(",").filter(Boolean) : [];
    });
    SINGLE_FILTER_KEYS.forEach((key) => {
        filters[key] = searchParams.get(key) || "";
    });
    return filters;
};

// Writes the filters into a copy of the current params, leaving unrelated params untouched
export const applyFiltersToSearchParams = (searchParams, filters) => {
    const next = new URLSearchParams(searchParams);
    FILTER_KEYS.forEach((key) => {
        const val = filters[key];
        const str = Array.isArray(val) ? val.join(",") : val;
        if (str) next.set(key, str);
        else next.delete(key);
    });
    return next;
};

export const hasAnyFilter = (searchParams) => FILTER_KEYS.some((key) => searchParams.has(key));

/* ---------- records table ---------- */

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

export const DATE_COLUMNS = new Set([
    "due_date",
    "challan_payment_date",
    "data_requested_date",
    "data_received_date",
    "checklist_prepared_date",
    "checklist_approved_date",
    "challan_prepared_date",
    "pt_return_date",
]);

export const ACT_KEY = "act_(pf_esi_pt_lwf)";

// HTTP status of a failed request, if any
export const errorStatus = (error) => error?.response?.status;
