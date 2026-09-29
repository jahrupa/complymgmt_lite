import React from "react";
import ProgressCell from "../common/ProgressCell";
import { hasApplicability } from "./registerUtils";

// Metric columns shared by every RegisterGroup table (company-wise, register-wise)
const METRIC_COLUMNS = [
    {
        headerName: "Coverage",
        colId: "coverage",
        minWidth: 190,
        valueGetter: (p) => (hasApplicability(p.data?.coverage) ? p.data.coverage.coverage_percent : -1),
        cellRenderer: (p) => <ProgressCell value={p.value} emptyText={p.value < 0 ? "No applicability data" : ""} />,
        tooltipValueGetter: (p) =>
            hasApplicability(p.data?.coverage)
                ? `${p.data.coverage.completed} of ${p.data.coverage.applicable} applicable completed · ${p.data.coverage.not_started} not started`
                : "",
    },
    {
        headerName: "Completion",
        field: "completion_rate",
        minWidth: 170,
        cellRenderer: (p) => <ProgressCell value={p.value} color="#6366f1" />,
    },
    { headerName: "Executed", field: "executed", maxWidth: 110 },
    { headerName: "Completed", field: "completed", maxWidth: 120 },
    { headerName: "Overdue", field: "overdue", maxWidth: 110 },
    { headerName: "Open Var.", field: "variance_open", maxWidth: 110 },
    { headerName: "Applicable", field: "applicable_registers", maxWidth: 120 },
    { headerName: "Locations", field: "locations", maxWidth: 110 },
];

export const COMPANY_TABLE_COLUMNS = [
    { headerName: "Company", field: "company_name", minWidth: 220, flex: 2, cellStyle: { fontWeight: 600 } },
    { headerName: "Latest Month", field: "latest_month", maxWidth: 130, valueFormatter: (p) => p.data?.latest_month_label || "–" },
    ...METRIC_COLUMNS,
];

export const REGISTER_TABLE_COLUMNS = [
    { headerName: "Register", field: "register_name", minWidth: 200, flex: 2, cellStyle: { fontWeight: 600 } },
    { headerName: "Act", field: "applicable_act", minWidth: 200, flex: 2 },
    ...METRIC_COLUMNS,
];

export const exceptionColumns = (isCompanyMode) => [
    { headerName: "Company", field: "company", minWidth: 170, hide: isCompanyMode },
    { headerName: "Location", field: "location", minWidth: 170 },
    { headerName: "Register", field: "register", minWidth: 180 },
    { headerName: "Form", field: "form", width: 110, flex: 0 },
    { headerName: "Month", field: "month", width: 110, flex: 0 },
];

export const exceptionRow = (row) => ({
    company: row.record?.company_name,
    location: row.record?.location,
    register: row.record?.register_name,
    form: row.record?.form_id,
    month: row.computed?.month_label,
});
