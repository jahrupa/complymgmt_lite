import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import DashboardCard from "../common/DashboardCard";
import ProgressCell from "../common/ProgressCell";
import { hasApplicability } from "./registerUtils";

ModuleRegistry.registerModules([AllCommunityModule]);

// Metric columns shared by every RegisterGroup table (company-wise, register-wise)
const metricColumns = () => [
    {
        headerName: "Coverage",
        colId: "coverage",
        minWidth: 190,
        valueGetter: (p) => (hasApplicability(p.data?.coverage) ? p.data.coverage.coverage_percent : -1),
        cellRenderer: (p) => (
            <ProgressCell value={p.value} emptyText={p.value < 0 ? "No applicability data" : ""} />
        ),
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

/**
 * RG-2 / RG-4: a sortable RegisterGroup table. `leadColumns` identify the row (company, register…);
 * `onRowClick(row)` drills down.
 */
const GroupTableWidget = ({ selection, loading, title, subtitle, rows = [], leadColumns, rowId, onRowClick, maxHeight = 460 }) => {
    const columnDefs = useMemo(() => [...leadColumns, ...metricColumns()], [leadColumns]);

    return (
        <DashboardCard selection={selection} title={title} subtitle={subtitle} loading={loading} isEmpty={rows.length === 0} minHeight={200}>
            <div
                className="ag-theme-quartz"
                style={{ height: Math.min(maxHeight, 56 + rows.length * 42 + 20), width: "100%" }}
                onClick={(e) => e.stopPropagation()}
            >
                <AgGridReact
                    theme="legacy"
                    rowData={rows}
                    columnDefs={columnDefs}
                    defaultColDef={{ sortable: true, resizable: true, flex: 1, minWidth: 100 }}
                    getRowId={(p) => rowId(p.data)}
                    rowStyle={{ cursor: "pointer" }}
                    tooltipShowDelay={300}
                    onRowClicked={(e) => onRowClick(e.data)}
                />
            </div>
        </DashboardCard>
    );
};

export default GroupTableWidget;
