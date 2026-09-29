// Helpers shared by the tracker dashboards (Challan, Register)

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

const toDisplayDate = (d, m, y) => {
    const month = Number(m);
    if (month < 1 || month > 12) return null;
    return `${String(d).padStart(2, "0")} ${MONTHS[month - 1]} ${y}`;
};

// Uploaded values are raw strings. Dates come as m/d/yyyy (challan) or mm-dd-yy (register) and are
// shown as dd MMM yyyy; "-" means empty. Anything else is returned unchanged.
export const formatRawValue = (val) => {
    const str = String(val ?? "").trim();
    if (str === "" || str === "-") return "—";
    let match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(str);
    if (match) return toDisplayDate(match[2], match[1], match[3]) || str;
    match = /^(\d{1,2})-(\d{1,2})-(\d{2})$/.exec(str);
    if (match) return toDisplayDate(match[2], match[1], `20${match[3]}`) || str;
    return str;
};

// YYYY-MM-DD (timeline dates) -> dd MMM yyyy
export const formatIsoDate = (val) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val || "");
    if (!match) return val || "–";
    return toDisplayDate(match[3], match[2], match[1]) || val;
};

// HTTP status of a failed request, if any
export const errorStatus = (error) => error?.response?.status;

// Last N months from a newest-first month list ({ month: "YYYY-MM" })
export const defaultPeriod = (months = [], count = 6) => {
    const valid = months.filter((m) => m.month);
    if (!valid.length) return { month_from: "", month_to: "" };
    return {
        month_from: valid[Math.min(count, valid.length) - 1].month,
        month_to: valid[0].month,
    };
};

/* ---------- filter options ---------- */

export const YES_NO_OPTIONS = [
    { value: "Y", label: "Yes" },
    { value: "N", label: "No" },
];

// Locations narrowed to the selected states; locations are { state, location }
export const locationOptionsFor = (locations = [], states = []) => [
    ...new Set(locations.filter((l) => !states.length || states.includes(l.state)).map((l) => l.location)),
];

/* ---------- filters <-> URL query string ---------- */

// `multiKeys` hold arrays (comma separated in the URL), `singleKeys` hold strings
export const emptyFilters = (multiKeys, singleKeys) =>
    Object.fromEntries([...multiKeys.map((k) => [k, []]), ...singleKeys.map((k) => [k, ""])]);

export const filtersFromSearchParams = (searchParams, multiKeys, singleKeys) => {
    const filters = emptyFilters(multiKeys, singleKeys);
    multiKeys.forEach((key) => {
        const val = searchParams.get(key);
        filters[key] = val ? val.split(",").filter(Boolean) : [];
    });
    singleKeys.forEach((key) => {
        filters[key] = searchParams.get(key) || "";
    });
    return filters;
};

// Writes the filters into a copy of the current params, leaving unrelated params untouched
export const applyFiltersToSearchParams = (searchParams, filters) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, val]) => {
        const str = Array.isArray(val) ? val.join(",") : val;
        if (str) next.set(key, str);
        else next.delete(key);
    });
    return next;
};

// Builds query params for the API from a filter object (drops keys listed in `omit`)
export const withoutKeys = (obj, omit = []) => {
    const copy = { ...obj };
    omit.forEach((key) => delete copy[key]);
    return copy;
};
