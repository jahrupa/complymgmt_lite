import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import ChallanCard from "./ChallanCard";
import { formatINR, formatPercent } from "./challanUtils";

ModuleRegistry.registerModules([AllCommunityModule]);

const scoreStyle = (p) => {
    const v = Number(p.value) || 0;
    if (v < 50) return { color: "#b91c1c", fontWeight: 600 };
    if (v < 90) return { color: "#92400e", fontWeight: 600 };
    return { color: "#0f766e", fontWeight: 600 };
};

// CH-8 (overall dashboard only): one row per company, lowest compliance first; a click opens that company
const CompanyWiseWidget = ({ selection, loading, companyWise, onOpenCompany }) => {
    const rows = companyWise || [];

    const columnDefs = useMemo(
        () => [
            { headerName: "Company", field: "company_name", minWidth: 220, flex: 2, cellStyle: { fontWeight: 600 } },
            { headerName: "Compliance", field: "compliance_score", valueFormatter: (p) => formatPercent(p.value), cellStyle: scoreStyle },
            { headerName: "On Time", field: "on_time_percent", valueFormatter: (p) => formatPercent(p.value) },
            { headerName: "Challans", field: "total" },
            { headerName: "Exceptions", field: "exceptions" },
            { headerName: "Overdue", field: "overdue" },
            { headerName: "Amount", field: "amount", valueFormatter: (p) => formatINR(p.value), minWidth: 140 },
            { headerName: "Penalty", field: "estimated_penalty", valueFormatter: (p) => formatINR(p.value) },
            { headerName: "Locations", field: "locations" },
            { headerName: "Acts", field: "acts", valueFormatter: (p) => (p.value || []).join(", "), sortable: false },
            {
                headerName: "Latest Month",
                field: "latest_month",
                valueFormatter: (p) => p.data?.latest_month_label || "–",
            },
        ],
        []
    );

    return (
        <ChallanCard
            selection={selection}
            title="Company-wise Compliance"
            subtitle="Lowest compliance first. Click a company to open its dashboard"
            loading={loading}
            isEmpty={rows.length === 0}
            minHeight={200}
        >
            <div
                className="ag-theme-quartz"
                style={{ height: Math.min(460, 56 + rows.length * 42 + 20), width: "100%" }}
                onClick={(e) => e.stopPropagation()}
            >
                <AgGridReact
                    theme="legacy"
                    rowData={rows}
                    columnDefs={columnDefs}
                    defaultColDef={{ sortable: true, resizable: true, flex: 1, minWidth: 110 }}
                    getRowId={(p) => p.data.company_name}
                    rowStyle={{ cursor: "pointer" }}
                    onRowClicked={(e) => onOpenCompany(e.data?.company_name)}
                />
            </div>
        </ChallanCard>
    );
};

export default CompanyWiseWidget;
