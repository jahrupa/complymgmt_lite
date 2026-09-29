import React from "react";
import ProgressCell from "../common/ProgressCell";
import { formatPercent } from "../common/dashboardUtils";
import { hasApplicableLocations } from "./returnsUtils";

// Percentages only mean something when the row has filings
const pctIfFilings = (field) => ({
    valueGetter: (p) => (p.data?.total ? p.data[field] : null),
    valueFormatter: (p) => (p.value === null ? "–" : formatPercent(p.value)),
});

const filingRateColumn = {
    headerName: "Filing Rate",
    colId: "filing_rate",
    minWidth: 160,
    valueGetter: (p) => (p.data?.total ? p.data.filing_rate : -1),
    cellRenderer: (p) => <ProgressCell value={p.value} color="#6366f1" emptyText={p.value < 0 ? "No filings" : ""} />,
};

export const COMPANY_TABLE_COLUMNS = [
    { headerName: "Company", field: "company_name", minWidth: 220, flex: 2, cellStyle: { fontWeight: 600 } },
    {
        headerName: "Coverage",
        colId: "coverage",
        minWidth: 180,
        valueGetter: (p) => (hasApplicableLocations(p.data?.coverage) ? p.data.coverage.coverage_percent : -1),
        cellRenderer: (p) => <ProgressCell value={p.value} emptyText={p.value < 0 ? "No applicable locations" : ""} />,
        tooltipValueGetter: (p) => {
            const c = p.data?.coverage;
            if (!c) return "";
            return `${c.covered} of ${c.applicable_locations} applicable locations have filings · ${c.transaction_only} transaction-only`;
        },
    },
    { headerName: "Txn-only Locs", colId: "transaction_only", maxWidth: 130, valueGetter: (p) => p.data?.coverage?.transaction_only ?? 0 },
    filingRateColumn,
    { headerName: "On Time", colId: "on_time_percent", maxWidth: 110, ...pctIfFilings("on_time_percent") },
    { headerName: "Compliance", colId: "compliance_rate", maxWidth: 120, ...pctIfFilings("compliance_rate") },
    { headerName: "Filings", field: "total", maxWidth: 100 },
    { headerName: "Overdue", field: "overdue", maxWidth: 100 },
    { headerName: "Exceptions", field: "exceptions", maxWidth: 115 },
    { headerName: "Applicable", field: "applicable_returns", maxWidth: 115 },
    { headerName: "Latest Due", field: "latest_due_month", maxWidth: 120, valueFormatter: (p) => p.data?.latest_due_month_label || "–" },
];

// Periods overlap (quarterly vs annual), so they are listed, not plotted on a time axis
export const PERIOD_TABLE_COLUMNS = [
    { headerName: "Period", field: "label", minWidth: 190, flex: 2, cellStyle: { fontWeight: 600 } },
    { headerName: "Filings", field: "total", maxWidth: 100 },
    { headerName: "Filed", field: "filed", maxWidth: 90 },
    filingRateColumn,
    { headerName: "On Time", colId: "on_time_percent", maxWidth: 110, ...pctIfFilings("on_time_percent") },
    { headerName: "Late", field: "late", maxWidth: 80 },
    { headerName: "Compliance", colId: "compliance_rate", maxWidth: 120, ...pctIfFilings("compliance_rate") },
    { headerName: "Overdue", field: "overdue", maxWidth: 100 },
    { headerName: "Exceptions", field: "exceptions", maxWidth: 115 },
];

// Return names differ between applicability and filings, so a row usually has only one side
export const RETURN_TABLE_COLUMNS = [
    { headerName: "Return", field: "return_name", minWidth: 240, flex: 2, cellStyle: { fontWeight: 600 } },
    { headerName: "Applicable", field: "applicable_returns", maxWidth: 115 },
    { headerName: "Filings", field: "total", maxWidth: 100 },
    filingRateColumn,
    { headerName: "On Time", colId: "on_time_percent", maxWidth: 110, ...pctIfFilings("on_time_percent") },
    { headerName: "Compliance", colId: "compliance_rate", maxWidth: 120, ...pctIfFilings("compliance_rate") },
    { headerName: "Overdue", field: "overdue", maxWidth: 100 },
    { headerName: "Locations", field: "locations", maxWidth: 110 },
    { headerName: "Latest Due", field: "latest_due_month", maxWidth: 120, valueFormatter: (p) => p.data?.latest_due_month_label || "–" },
];

export const exceptionColumns = (isCompanyMode) => [
    { headerName: "Company", field: "company", minWidth: 170, hide: isCompanyMode },
    { headerName: "Location", field: "location", minWidth: 150 },
    { headerName: "Return", field: "return_name", minWidth: 200 },
    { headerName: "Period", field: "period", minWidth: 160 },
    { headerName: "Due", field: "due_month", width: 100, flex: 0 },
];

export const exceptionRow = (row) => ({
    company: row.record?.company_name,
    location: row.record?.location_name,
    return_name: row.record?.return_name,
    period: row.computed?.period_label || row.record?.period,
    due_month: row.computed?.due_month_label,
});
