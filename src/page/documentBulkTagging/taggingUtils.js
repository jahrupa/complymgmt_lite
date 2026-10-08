import { toCsv } from "../utils/bulkUpload";

export const ACCEPTED_EXT = [".xlsx", ".xls", ".xlsm", ".csv"];

// Row statuses in display order. `tone` picks the colour classes in documentBulkTagging.css.
export const STATUSES = [
    { key: "updated", label: "Updated", tone: "updated" },
    { key: "partial", label: "Partial", tone: "partial" },
    { key: "unchanged", label: "Unchanged", tone: "unchanged" },
    { key: "skipped", label: "Skipped", tone: "skipped" },
];

export const STATUS_BY_KEY = Object.fromEntries(STATUSES.map((s) => [s.key, s]));

// The API promises these arrays, but treat a missing one as empty rather than crash.
export const normalizeResult = (data) => ({
    ...data,
    summary: data?.summary || {},
    rows: (Array.isArray(data?.rows) ? data.rows : []).map((row) => ({
        ...row,
        changes: Array.isArray(row?.changes) ? row.changes : [],
        skipped: Array.isArray(row?.skipped) ? row.skipped : [],
    })),
});

const text = (value) => (value == null ? "" : String(value));

export const isCleared = (change) => change?.action === "cleared";

export const formatChange = (change) => {
    const from = text(change.from) || "(blank)";
    if (isCleared(change)) {
        const reason = text(change.reason);
        return `${change.field}: ${from} → cleared${reason ? ` (${reason})` : ""}`;
    }
    return `${change.field}: ${from} → ${text(change.to) || "(blank)"}`;
};

export const formatSkip = (skip) => {
    const value = text(skip.value);
    const reason = text(skip.reason);
    return `${skip.field}${value ? ` "${value}"` : ""}${reason ? `: ${reason}` : ""}`;
};

export const clearedCount = (row) => row.changes.filter(isCleared).length;

export const totalCleared = (rows) => rows.reduce((sum, row) => sum + clearedCount(row), 0);

// Quick filters on top of the plain status filters.
export const FILTERS = [
    { key: "all", label: "All", test: () => true },
    { key: "attention", label: "Needs attention", test: (r) => r.status === "partial" || r.status === "skipped" },
    { key: "cleared", label: "Clears tags", test: (r) => clearedCount(r) > 0 },
    ...STATUSES.map(({ key, label }) => ({ key, label, test: (r) => r.status === key })),
];

export const resultsToCsv = (rows) =>
    toCsv([
        ["Row", "doc_id", "file_name", "Status", "Changes", "Skipped", "Message"],
        ...rows.map((r) => [
            r.row,
            r.doc_id,
            r.file_name,
            r.status,
            r.changes.map(formatChange).join("; "),
            r.skipped.map(formatSkip).join("; "),
            r.message,
        ]),
    ]);
