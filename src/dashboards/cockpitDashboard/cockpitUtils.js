// Compliance Cockpit constants. The cockpit compiles the four module dashboards; each module's
// score equals that dashboard's number for the same filters.
import { formatINRShort, formatPercent, periodLabel } from "../common/dashboardUtils";

export { periodLabel };

// Filters shared by /summary, /company-wise and /state-wise (company comes from the page picker)
export const MULTI_FILTER_KEYS = ["state", "location"];
export const SINGLE_FILTER_KEYS = ["month_from", "month_to", "search"];

// No default range: the cockpit opens on current status
export const NO_DEFAULT_PERIOD = {};

// Order used by the API: challan, registers, returns, license
export const MODULE_ORDER = ["challan", "registers", "returns", "license"];

// Per module: dashboard tab slug (for drill-down links) and the secondary figures from `details`
export const MODULES = {
    challan: {
        label: "Challans",
        widgetId: "cc-5",
        companyWidgetId: "ccbc-5",
        tab: "challan",
        details: (d) => [
            ["Amount paid", formatINRShort(d.amount)],
            ["Est. penalty", formatINRShort(d.estimated_penalty)],
            ["Overdue", d.overdue],
            ["Paid late", d.paid_late],
        ],
    },
    registers: {
        label: "Registers",
        widgetId: "cc-3",
        companyWidgetId: "ccbc-3",
        tab: "register",
        details: (d) => [
            ["Executed", d.executed],
            ["SLA met", formatPercent(d.sla_met_percent)],
            ["Open variances", d.variance_open],
            ["Not started", d.coverage?.not_started ?? 0],
        ],
    },
    returns: {
        label: "Returns",
        widgetId: "cc-4",
        companyWidgetId: "ccbc-4",
        tab: "returns-submissions",
        details: (d) => [
            ["Filed", d.filed],
            ["Filed late", d.late],
            ["Overdue", d.overdue],
            ["At risk", d.at_risk],
        ],
    },
    license: {
        label: "Licenses",
        widgetId: "cc-2",
        companyWidgetId: "ccbc-2",
        tab: "license",
        details: (d) => [
            ["Active", d.active],
            ["Expiring", d.expiring],
            ["Expired", d.expired],
            ["Lifetime", d.lifetime],
            ["In progress", d.in_progress],
            ["Surrendered", d.surrendered],
        ],
    },
};

// Score colour bands: 0–40 red, 40–60 orange, 60–80 amber, 80–100 green
export const scoreBand = (score) => {
    if (score === null || score === undefined) return { label: "No data", color: "#9ca3af", soft: "#f3f4f6" };
    if (score < 40) return { label: "Low", color: "#dc2626", soft: "#fee2e2" };
    if (score < 60) return { label: "Fair", color: "#ea580c", soft: "#ffedd5" };
    if (score < 80) return { label: "Good", color: "#d97706", soft: "#fef3c7" };
    return { label: "Strong", color: "#16a34a", soft: "#dcfce7" };
};

// score_distribution bucket name ("0-20") -> band colour of its lower bound
export const distributionColor = (name) => scoreBand(Number(String(name).split("-")[0])).color;

export const modulesAvailableText = (count) =>
    count ? `average of ${count} module${count === 1 ? "" : "s"}` : "no module has data";

// Filters passed through when drilling into a module dashboard
export const DRILL_KEYS = ["state", "location", "search", "month_from", "month_to"];
