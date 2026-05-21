import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { X } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import Chart from "react-apexcharts";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import DashboardDrawerGridDetailPage from "../page/dashboardDrawerGridDetailPage/DashboardDrawerGridDetailPage";
import MultiSelectFilter from "../page/dashboardDrawerGridDetailPage/MultiSelectFilter";
import { useState, useMemo } from "react";
// import { fetchPaginatedRecords } from '../api/service';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function DashboardDrawerGrid({
  anchor = "right",
  open,
  onClose,
  data,
  title = "Details",
  chartXaxisCategory,
  setIsDetailPage,
  isDetailPage,
  isDetailPageData,
  filterColumns,
  isCockpitComplianceDetailPage,
  setIsDetailPageDataFor,
  isDetailPageDataFor,
  buttons,
  setPage,
  setLimit,
  totalPage,
  fetchPaginatedRecords,
  isPaginatedRecords,
}) {
  const [rowData, setRowData] = React.useState([]);
  const [columnDefs, setColumnDefs] = React.useState([]);
  const [chartType, setChartType] = React.useState(""); // bar, line, pie
  const [chartOptions, setChartOptions] = React.useState({});
  const [chartSeries, setChartSeries] = React.useState([]);
  const [error, setError] = React.useState(""); // error state
  // Set rowData & columnDefs
  const gridRef = React.useRef();
  const [filters, setFilters] = useState({});

  const filteredRowData = useMemo(() => {
    if (Object.keys(filters).length === 0) return data;

    return data.filter((row) => {
      return Object.entries(filters).every(([column, values]) => {
        return values.includes(row[column]);
      });
    });
  }, [data, filters]);

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
  };

  React.useEffect(() => {
    try {
      setError(""); // reset error
      if (!open) return;

      if (!data || !Array.isArray(data) || data.length === 0) {
        setRowData([]);
        setColumnDefs([]);
        setChartSeries([]);
        return;
      }
      setRowData(data);

      const cols = Object.keys(data[0]).map((key) => ({
        headerName: key.replace(/_/g, " ").toUpperCase(),
        field: key,
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        headerStyle: { color: "#515151", backgroundColor: "#ffffe24d" },
      }));
      setColumnDefs(cols);
    } catch {
      setError("Failed to load data for the grid.");
    }
  }, [open, data]);

  // Convert data to ApexChart format
  React.useEffect(() => {
    try {
      setError(""); // reset error
      if (!chartType || !rowData.length) {
        setChartSeries([]);
        setChartOptions({});
        return;
      }

      let series = [];
      let options = {};

      if (chartType === "pie") {
        const numericKey = Object.keys(rowData[0]).find(
          (k) => typeof rowData[0][k] === "number",
        );
        if (!numericKey)
          throw new Error("No numeric field found for Pie chart");

        const labels = rowData.map(
          (item, idx) => item.name || `Item ${idx + 1}`,
        );
        const values = rowData.map((item) => {
          const val = item[numericKey];
          if (typeof val !== "number")
            throw new Error(`Invalid numeric value for ${numericKey}`);
          return val;
        });

        options = {
          labels,
          title: { text: numericKey.replace(/_/g, " "), align: "center" },
        };
        series = values;
      } else if (chartType === "bar" || chartType === "line") {
        const keys = Object.keys(rowData[0]).filter(
          (k) => typeof rowData[0][k] === "number",
        );

        if (keys.length === 0)
          throw new Error("No numeric fields available for chart");

        series = keys.map((key) => ({
          name: key,
          data: rowData.map((item) => {
            const val = item[key];
            if (typeof val !== "number")
              throw new Error(`Invalid numeric value for ${key}`);
            return val;
          }),
        }));

        const categories =
          chartXaxisCategory || rowData.map((_, idx) => `Item ${idx + 1}`);

        options = {
          chart: {
            id: "analysis-chart",
            type: chartType,
            stacked: series.length > 1,
            toolbar: { show: true },
            zoom: { enabled: true },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              dataLabels: { total: { enabled: series.length > 1 } },
            },
          },
          xaxis: { categories },
          title: { text: "Analysis", align: "center" },
          tooltip: { shared: true, intersect: false },
          legend: { position: "top" },
        };
      }

      setChartSeries(series);
      setChartOptions(options);
    } catch (err) {
      setError(err.message || "Failed to generate chart.");
      setChartSeries([]);
      setChartOptions({});
    }
  }, [chartType, rowData]);

  const onPaginationChanged = () => {
    if (gridRef.current) {
      const currentPage = gridRef.current.api.paginationGetCurrentPage();
      const pageSize = gridRef.current.api.paginationGetPageSize();

      // AG Grid page index 0 se start hota hai
      const page = currentPage + 1;
      setPage(page);
      setLimit(pageSize);
      // Yaha API call karo
      // fetchData(page, pageSize);
    }
  };
  const dataSource = {
    getRows: async (params) => {
      const { startRow, endRow } = params;

      const page = startRow / 20 + 1; // page calculate
      const limit = 20;

      const response = await fetchPaginatedRecords(page, limit);
      const rows = response.return?.records;
      const totalRows = totalPage; // 👈 total count API se lao

      params.successCallback(rows, totalRows);
    },
  };
  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: "100vw" } }}
    >
      <Box sx={{ width: "100%", padding: "10px" }}>
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4 className="ms-2 fs-19 fw-600" style={{ color: "gray" }}>
            {title}
          </h4>
          <div
            className="dashboard-icon me-2 ms-1"
            style={{ cursor: "pointer" }}
            onClick={() => {
              onClose();
              setChartType("");
              setIsDetailPage(false);
              setIsDetailPageDataFor("Returns");
            }}
          >
            <X />
          </div>
        </div>

        <Divider className="mb-3" />

        {/* Error Message */}
        {error && <div className="alert alert-danger mb-3">{error}</div>}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <MultiSelectFilter
            rowData={isDetailPage ? isDetailPageData : rowData}
            filterColumns={filterColumns}
            onFilterApply={handleFilterApply}
          />
          {isCockpitComplianceDetailPage ? (
            <div className="d-flex justify-content-between gap-3">
              {buttons?.map((item) => (
                <button
                  key={item}
                  className="btn btn-primary"
                  style={{
                    border:
                      isDetailPageDataFor === item
                        ? "1px solid #0d6efd"
                        : "opacity(0.6)",
                    backgroundColor:
                      isDetailPageDataFor === item
                        ? "rgb(13 110 253)"
                        : "rgba(13, 110, 253, 0.6)",
                  }}
                  onClick={() => setIsDetailPageDataFor(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : (
            <button
              className="btn btn-primary "
              onClick={() => {
                setIsDetailPage(!isDetailPage);
              }}
            >
              {isDetailPage ? "Back" : "View Details"}
            </button>
          )}
        </div>
        {/* Chart Rendering */}
        {chartType && chartSeries.length > 0 && !error && (
          <div className="mb-4" style={{ width: "100%", height: "400px" }}>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type={chartType}
              height={400}
            />
          </div>
        )}
        {isDetailPage ? (
          <>
            <DashboardDrawerGridDetailPage
              rowData={isDetailPageData}
              filterColumns={filterColumns}
              filters={filters}
            />
          </>
        ) : (
          <div
            className="ag-theme-quartz"
            style={{ height: "600px", width: "100%", marginTop: "1rem" }}
          >
            {isPaginatedRecords ? (
              <AgGridReact
                theme="legacy"
                rowModelType="infinite"
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={20}
                cacheBlockSize={20}
                datasource={dataSource}
              />
            ) : (
              <AgGridReact
                ref={gridRef}
                theme="legacy"
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={20}
                onPaginationChanged={onPaginationChanged}
              />
            )}
          </div>
        )}
      </Box>
    </Drawer>
  );
}
