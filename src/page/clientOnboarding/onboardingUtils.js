import { toCsv } from "../utils/bulkUpload";

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

export const totalCreated = (summary) =>
    LEVELS.reduce((sum, { key }) => sum + (Number(summary?.[key]?.created) || 0), 0);

export const errorsToCsv = (errors) => toCsv([["row", "message"], ...errors.map((e) => [e.row, e.message])]);
