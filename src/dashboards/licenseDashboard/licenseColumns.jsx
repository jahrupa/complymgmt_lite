import React from "react";
import { formatPercent } from "../common/dashboardUtils";
import { ValidityBar } from "./LicenseBadges";
import { daysToExpireText } from "./licenseUtils";

// valid % excludes surrendered licenses; there is no % when every license was surrendered
const validPercentColumn = {
    headerName: "Valid",
    field: "valid_percent",
    maxWidth: 110,
    valueFormatter: (p) => (p.data && p.data.total - p.data.surrendered > 0 ? formatPercent(p.value) : "–"),
    tooltipValueGetter: () => "Active + expiring + lifetime, of licenses not surrendered",
};

export const COMPANY_TABLE_COLUMNS = [
    { headerName: "Company", field: "name", minWidth: 220, flex: 2, cellStyle: { fontWeight: 600 } },
    { headerName: "Validity", colId: "validity", minWidth: 200, flex: 2, sortable: false, cellRenderer: (p) => <ValidityBar stats={p.data} /> },
    validPercentColumn,
    { headerName: "Licenses", field: "total", maxWidth: 110 },
    { headerName: "Expiring", field: "expiring", maxWidth: 110 },
    { headerName: "Expired", field: "expired", maxWidth: 105 },
    { headerName: "In Progress", field: "in_progress", maxWidth: 120 },
    { headerName: "Exceptions", field: "exceptions", maxWidth: 115 },
    { headerName: "Locations", field: "locations", maxWidth: 110 },
    { headerName: "Types", field: "license_types", maxWidth: 95 },
];

export const exceptionColumns = (isCompanyMode) => [
    { headerName: "Company", field: "company", minWidth: 170, hide: isCompanyMode },
    { headerName: "Location", field: "location", minWidth: 140 },
    { headerName: "License Type", field: "license_type", minWidth: 170 },
    {
        headerName: "Days to Expiry",
        field: "days_to_expire",
        width: 170,
        flex: 0,
        valueFormatter: (p) => daysToExpireText(p.value),
        cellStyle: (p) => (p.value !== null && p.value < 0 ? { color: "#b91c1c", fontWeight: 600 } : null),
    },
];

export const exceptionRow = (row) => ({
    company: row.record?.company_name,
    location: row.record?.location,
    license_type: row.record?.license_applicable,
    days_to_expire: row.computed?.days_to_expire ?? null,
});
