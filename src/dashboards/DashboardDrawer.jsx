import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { X } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import Chart from 'react-apexcharts';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function DashboardDrawerGrid({
  anchor = "right",
  open,
  onClose,
  data,
  title = "Details",
  chartXaxisCategory
}) {
  const [rowData, setRowData] = React.useState([]);
  const [columnDefs, setColumnDefs] = React.useState([]);
  const [chartType, setChartType] = React.useState(""); // bar, line, pie
  const [chartOptions, setChartOptions] = React.useState({});
  const [chartSeries, setChartSeries] = React.useState([]);
  const [error, setError] = React.useState(""); // error state
  console.log(chartType,'chartType')
  // Set rowData & columnDefs
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
        headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
      }));
      setColumnDefs(cols);
    } catch (err) {
      console.error("Error setting row data:", err);
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

      if (chartType === 'pie') {
        const numericKey = Object.keys(rowData[0]).find(k => typeof rowData[0][k] === 'number');
        if (!numericKey) throw new Error("No numeric field found for Pie chart");

        const labels = rowData.map((item, idx) => item.name || `Item ${idx + 1}`);
        const values = rowData.map(item => {
          const val = item[numericKey];
          if (typeof val !== 'number') throw new Error(`Invalid numeric value for ${numericKey}`);
          return val;
        });

        options = {
          labels,
          title: { text: numericKey.replace(/_/g, " "), align: 'center' }
        };
        series = values;
      } else if (chartType === 'bar' || chartType === 'line') {
        const keys = Object.keys(rowData[0]).filter(k => typeof rowData[0][k] === 'number');

        if (keys.length === 0) throw new Error("No numeric fields available for chart");

        series = keys.map(key => ({
          name: key,
          data: rowData.map(item => {
            const val = item[key];
            if (typeof val !== 'number') throw new Error(`Invalid numeric value for ${key}`);
            return val;
          })
        }));

       const categories = chartXaxisCategory || rowData.map((_, idx) => `Item ${idx + 1}`);


        options = {
          chart: {
            id: 'analysis-chart',
            type: chartType,
            stacked: series.length > 1,
            toolbar: { show: true },
            zoom: { enabled: true }
          },
          plotOptions: {
            bar: {
              horizontal: false,
              dataLabels: { total: { enabled: series.length > 1 } }
            }
          },
          xaxis: { categories },
          title: { text: 'Analysis', align: 'center' },
          tooltip: { shared: true, intersect: false },
          legend: { position: 'top' }
        };
      }

      setChartSeries(series);
      setChartOptions(options);

    } catch (err) {
      console.error("Error generating chart:", err);
      setError(err.message || "Failed to generate chart.");
      setChartSeries([]);
      setChartOptions({});
    }
  }, [chartType, rowData]);

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: '100vw' } }}
    >
      <Box sx={{ width: "100%", padding: "10px" }}>

        {/* HEADER */}
        <div className='d-flex justify-content-between align-items-center mb-2'>
          <h4 className="ms-2 fs-19 fw-600" style={{ color: 'gray' }}>{title}</h4>
          <div className='dashboard-icon me-2 ms-1' style={{ cursor: "pointer" }} onClick={() => { onClose(); setChartType({}); }}>
            <X />
          </div>
        </div>

        <Divider className="mb-3" />

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger mb-3">
            {error}
          </div>
        )}

        {/* Chart Selector */}
        {rowData.length > 0 && (
          <div className="mb-3 d-flex align-items-center">
            <span className="me-2 fw-600 text-muted">Chart Type:</span>
            <select
              className="form-select w-auto"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="">Select Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>
        )}

        {/* Chart Rendering */}
        {chartType && chartSeries.length > 0 && !error && (
          <div className="mb-4" style={{ width: '100%', height: '400px' }}>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type={chartType}
              height={400}
            />
          </div>
        )}

        {/* DATA GRID */}
        <div className="ag-theme-quartz" style={{ height: '600px', width: '100%', marginTop: '1rem' }}>
          <AgGridReact
            theme="legacy"
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
          />
        </div>

      </Box>
    </Drawer>
  );
}
