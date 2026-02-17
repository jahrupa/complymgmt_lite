import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import MultiSelectFilter from "./MultiSelectFilter";
ModuleRegistry.registerModules([AllCommunityModule]);

function DashboardDrawerGridDetailPage({rowData}) {
    const [filters, setFilters] = useState({});


    const filteredRowData = useMemo(() => {
        if (Object.keys(filters).length === 0) return rowData;

        return rowData.filter(row => {
            return Object.entries(filters).every(([column, values]) => {
                return values.includes(row[column]);
            });
        });
    }, [rowData, filters]);

    const columnDefs = useMemo(() => {
        if (!rowData.length) return [];

        return Object.keys(rowData[0])
            .filter(key => key !== '_id')
            .map((key) => ({
                headerName: key.replace(/_/g, " ").toUpperCase(),
                field: key,
                sortable: true,
                filter: true,
                resizable: true,
            }));
    }, [rowData]);

    const defaultColDef = {
        flex: 1,
        minWidth: 150,
        floatingFilter: false,
        headerStyle: { color: "#515151", backgroundColor: "#ffffe24d" },
    };

    const handleFilterApply = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="app-container">
            <div className="app-wrapper">
                {/* <div className="app-header">
                    <h1 className="app-title">Audit Data Management</h1>
                    <p className="app-subtitle">Filter and view audit records with advanced multi-column filtering</p>
                </div> */}

                <div className="app-card">
                    <div className="app-filter-section">
                        <MultiSelectFilter rowData={rowData} onFilterApply={handleFilterApply} />
                    </div>

                    <div className="ag-theme-quartz" style={{ height: "600px", width: "100%" }}>
                        <AgGridReact
                            theme="legacy"
                            rowData={filteredRowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            pagination={true}
                        />
                    </div>

                    <div className="app-records-info">
                        Showing {filteredRowData.length} of {rowData.length} records
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardDrawerGridDetailPage;
