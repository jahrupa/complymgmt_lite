// Summary levels in the order the API returns them.
export const LEVELS = [
    { key: "group", label: "Group" },
    { key: "company", label: "Company" },
    { key: "entity", label: "Entity" },
    { key: "location", label: "Location" },
    { key: "module", label: "Module" },
    { key: "submodule", label: "Sub-module" },
    { key: "location_to_module", label: "Location ↔ Module mapping" },
];

export const ACCEPTED_EXT = [".csv", ".xlsx", ".xls"];

export const isAcceptedFile = (file) => {
    const name = (file?.name || "").toLowerCase();
    return ACCEPTED_EXT.some((ext) => name.endsWith(ext));
};

export const totalCreated = (summary) =>
    LEVELS.reduce((sum, { key }) => sum + (Number(summary?.[key]?.created) || 0), 0);

export const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const csvCell = (value) => {
    const text = String(value ?? "");
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const errorsToCsv = (errors) =>
    [["row", "message"], ...errors.map((e) => [e.row, e.message])]
        .map((cells) => cells.map(csvCell).join(","))
        .join("\r\n");

export const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};
