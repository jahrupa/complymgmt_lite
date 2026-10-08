// Widget catalog helpers for the Widget Access page. The catalog itself comes from the backend
// (the signed-in admin's own widget list); this file only orders, labels and filters it.

// Retired widgets the backend still lists: the old Returns & Submissions dashboard (RS-*) was
// replaced by the tracker-based Returns dashboard (RT-*) and nothing renders them any more
export const HIDDEN_PREFIXES = ["RS"];

// Dashboard order on the page (matches the dashboard tabs); unknown dashboards go last
export const DASHBOARD_ORDER = [
    "compliance cockpit",
    "compliance cockpit by company",
    "general compliance",
    "client onboarding",
    "register dashboard",
    "returns dashboard",
    "challan dashboard",
    "license dashboard",
    "payroll services",
    "helpdesk & escalations",
    "general helpdesk",
    "audits & visits",
    "notice & inspection",
];

// Display names for widgets whose backend name no longer matches what they show
// (CCBC-8 was "Recent Documents" and is now the cockpit's needs-attention list)
export const NAME_OVERRIDES = { "CCBC-8": "needs attention" };

// Widgets that need a company to render (the By Company cockpit page)
export const COMPANY_SCOPED_PREFIXES = ["CCBC"];

export const widgetPrefix = (id) => String(id || "").split("-")[0].toUpperCase();
export const normalizeId = (id) => String(id || "").toUpperCase();

// "multi-client compliance analytics" -> "Multi-Client Compliance Analytics"
export const titleCase = (text) =>
    String(text || "").replace(/(^|[\s\-/&(])([a-z])/g, (m, sep, ch) => sep + ch.toUpperCase());

// Natural order within a dashboard: CH-2 before CH-10
const idNumber = (id) => Number(String(id).split("-")[1]) || 0;

/** Groups the backend widget list by dashboard, in page order, without retired widgets. */
export const groupCatalog = (widgets = []) => {
    const groups = new Map();
    widgets
        .filter((w) => !HIDDEN_PREFIXES.includes(widgetPrefix(w.widget_id)))
        .forEach((w) => {
            const key = (w.dashboard_name || "other").toLowerCase();
            if (!groups.has(key)) groups.set(key, []);
            const id = normalizeId(w.widget_id);
            groups.get(key).push({ ...w, widget_id: id, widget_name: NAME_OVERRIDES[id] || w.widget_name });
        });
    const rank = (name) => {
        const i = DASHBOARD_ORDER.indexOf(name);
        return i === -1 ? DASHBOARD_ORDER.length : i;
    };
    return [...groups.entries()]
        .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
        .map(([name, items]) => ({
            name,
            label: titleCase(name),
            widgets: items.sort((a, b) => idNumber(a.widget_id) - idNumber(b.widget_id)),
        }));
};
