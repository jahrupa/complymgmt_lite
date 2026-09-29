import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import DashboardCard from "./DashboardCard";

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * Sortable table of grouped stats (company-wise, register-wise, period-wise…). `columnDefs` should be
 * a stable reference; `onRowClick(row)` drills down.
 */
const GroupTableCard = ({ selection, loading, title, subtitle, note, rows = [], columnDefs, rowId, onRowClick, maxHeight = 460 }) => (
    <DashboardCard selection={selection} title={title} subtitle={subtitle} loading={loading} isEmpty={rows.length === 0} minHeight={200}>
        {note && <div className="text-muted small mb-2">{note}</div>}
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
                rowStyle={onRowClick ? { cursor: "pointer" } : undefined}
                tooltipShowDelay={300}
                onRowClicked={(e) => onRowClick?.(e.data)}
            />
        </div>
    </DashboardCard>
);

export default GroupTableCard;
