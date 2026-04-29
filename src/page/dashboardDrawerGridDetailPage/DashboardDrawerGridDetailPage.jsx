import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import MultiSelectFilter from "./MultiSelectFilter";
ModuleRegistry.registerModules([AllCommunityModule]);

function DashboardDrawerGridDetailPage({ rowData,filters }) {
  const gridRef = useRef();
  const filteredRowData = useMemo(() => {
    if (Object.keys(filters).length === 0) return rowData;

    return rowData.filter((row) => {
      return Object.entries(filters).every(([column, values]) => {
        return values.includes(row[column]);
      });
    });
  }, [rowData, filters]);

  const columnDefs = useMemo(() => {
    if (!rowData.length) return [];

    return Object.keys(rowData[0])
      .filter((key) => key !== "_id")
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

  const onPaginationChanged = () => {
    if (gridRef.current) {
      const currentPage = gridRef.current.api.paginationGetCurrentPage();
      const pageSize = gridRef.current.api.paginationGetPageSize();

      // AG Grid page index 0 se start hota hai
      const page = currentPage + 1;


      // Yaha API call karo
      // fetchData(page, pageSize);
    }
  };
  return (
    <div className="app-container">
      <div className="app-wrapper">
        <div className="app-card">
          <div className="app-filter-section">
          </div>

          <div
            className="ag-theme-quartz"
            style={{ height: "600px", width: "100%" }}
          >
            <AgGridReact
              ref={gridRef}
              theme="legacy"
              rowData={filteredRowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={20}
              onPaginationChanged={onPaginationChanged}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardDrawerGridDetailPage;
