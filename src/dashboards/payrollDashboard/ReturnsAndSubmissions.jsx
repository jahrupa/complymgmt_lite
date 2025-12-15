import React, { useEffect, useMemo, useState } from 'react'
import Chart from 'react-apexcharts';
import {
  fetchCompaniesPerReturnsNames,
  fetchComplianceRiskDistributionByState,
  fetchComplianceStatusBasedOnReturns,
  fetchFrequencyWiseReturns,
  fetchRemarksBasedOnCompany,
  fetchReturnApplicabilityByCompanyCommonName,
  fetchStateWiseAnalysisOfApplicableReturns
} from '../../api/service';
import DashboardDrawerGrid from '../DashboardDrawer';
import { ArrowUpRight, X } from 'lucide-react';
import Snackbars from '../../component/Snackbars';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { decryptData } from '../../page/utils/encrypt';
ModuleRegistry.registerModules([AllCommunityModule]);

const ReturnsAndSubmissions = ({
  selectedCompany,
  current,
  selectedCharts,
  setSelectedCharts,
  shouldShow,
}) => {
  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    severityType: "",
  });

  const toggleChartSelection = (chartId) => {
    if (!current?.user_name) {
      setIsSnackbarsOpen(prev => ({
        ...prev,
        open: true,
        message: "First you need to select a user",
        severityType: "warning",
      }));
      return;
    }

    setSelectedCharts((prev) =>
      prev.includes(chartId) ? prev.filter((id) => id !== chartId) : [...prev, chartId]
    );
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnchor, setDrawerAnchor] = useState("right");
  const [drawerTitle, setDrawerTitle] = useState("");
  const [drawerData, setDrawerData] = useState([]);
  const [chartXaxisCategory, setChartXaxisCategory] = useState([]);

  const handleOpenDrawer = (anchor, title, data = [], chartXaxisCategories = []) => {
    setDrawerAnchor(anchor);
    setDrawerTitle(title);
    setDrawerOpen(true);
    setDrawerData(data);
    setChartXaxisCategory(chartXaxisCategories);
  };

  // --- state slices for API results ---
  const [comparisonOfReturnApplicability, setComparisonOfReturnApplicability] = useState({});
  const [companiesPerReturnsNames, setCompaniesPerReturnsNames] = useState({});
  const [applicableReturnsRaw, setApplicableReturnsRaw] = useState(null); // may be object { count_remark: [...] } or array
  const [ApplicableReturnsCount, setApplicableReturnsCount] = useState({});
  const [escalationRaisedCategoriesByCompany, setEscalationRaisedCategoriesByCompany] = useState([]);
  const [riskDistributionByState, setRiskDistributionByState] = useState({});
  const [stateWiseAnalysisOfApplicableReturns, setStateWiseAnalysisOfApplicableReturns] = useState({});
  // --- Helper to normalize "maybe object-maybe-array" responses ---
  const ensureArray = (val, fallback = []) => {
    if (!val) return fallback;
    if (Array.isArray(val)) return val;
    // if object wrapping array in known key
    if (val.count_remark && Array.isArray(val.count_remark)) return val.count_remark;
    if (val.top_counts && Array.isArray(val.top_counts)) return val.top_counts;
    // fallback: try to find a first array property
    const firstArray = Object.values(val).find((v) => Array.isArray(v));
    return firstArray || fallback;
  };

  // --- Chart configs (use safe fallbacks) ---
  const comparisonOfReturnApplicabilityFormat = {
    series: [
      {
        name: "Distinct Return Obligations",
        data: comparisonOfReturnApplicability?.top_counts?.map((item) => item?.count_of_returns) || [],
      },
    ],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: { bar: { horizontal: false } },
      dataLabels: { enabled: false },
      xaxis: {
        categories: comparisonOfReturnApplicability?.top_counts?.map((item) => item?.company_name) || [],
        title: { text: "Company Name" },
      },
      yaxis: { title: { text: "Distinct Return Obligations" }, min: 0, tickAmount: 5 },
      colors: ["#2cafc0ff"],
      fill: { opacity: 1, colors: ["#2cafc0ff"] },
      states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } },
    },
  };

  const companiesPerReturnsNamesFormat = {
    series: [
      { name: "Applicable Returns Count", data: companiesPerReturnsNames?.top_counts?.map((i) => i?.count_companies) || [] }
    ],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: { bar: { horizontal: false } },
      dataLabels: { enabled: false },
      xaxis: { categories: companiesPerReturnsNames?.top_counts?.map((i) => i?.returns_name) || [] },
      colors: ["#5ad5e2ff"],
      fill: { opacity: 1, colors: ["#5ad5e2ff"] },
      states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } },
    },
  };

  const applicableReturnsByLocationArray = ensureArray(applicableReturnsRaw, []);

  const applicableReturnsByLocationFormat = {
    series: [
      { name: 'Empty count', data: applicableReturnsByLocationArray.map((item) => item?.count_empty || 0) },
      { name: 'Count filed on time', data: applicableReturnsByLocationArray.map((item) => item?.count_filed_on_time || 0) },
      { name: 'Count late filing', data: applicableReturnsByLocationArray.map((item) => item?.count_late_filing || 0) },
    ],
    options: {
      chart: { type: 'bar', height: 350, stacked: true },
      colors: ["#14b8a6", "#2dd4bf", "#5eead4"],
      fill: { opacity: 1 },
      states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            total: { enabled: true, offsetX: 0, style: { fontSize: '13px', fontWeight: 900 } }
          }
        }
      },
      stroke: { width: 1, colors: ['#fff'] },
      title: { text: 'Escalation Counts' },
      xaxis: { categories: applicableReturnsByLocationArray.map((i) => i?.return_name || "") },
      yaxis: { title: { text: undefined } },
      legend: { position: 'top', horizontalAlign: 'left', offsetX: 40 }
    }
  };

  const ApplicableReturnsCountFormat = {
    series: ApplicableReturnsCount?.frequency_returns?.map((i) => i?.count) || [],
    options: {
      chart: { type: 'donut' },
      tooltip: { theme: 'light' },
      labels: ApplicableReturnsCount?.frequency_returns?.map((i) => i?.frequency) || [],
      colors: ["#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#c8fdf1ff"],
      fill: { opacity: 1 },
      legend: { position: 'top' },
      responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
    }
  };

  const riskDistributionByStateFormat = {
    series: [{ name: "State", data: riskDistributionByState?.top_counts?.map((i) => i?.count_of_risk) || [] }],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true } },
      dataLabels: { enabled: false },
      xaxis: { categories: riskDistributionByState?.top_counts?.map((i) => i?.state) || [], title: { text: "Risk Level Count" } },
      yaxis: { title: { text: "State" }, min: 0, tickAmount: 5 },
      colors: ["#2cafc0ff"],
      fill: { opacity: 1 },
      states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } },
    }
  };

  const applicableReturnsByStateFormat = {
    series: [{ name: "Applicable Returns Count", data: stateWiseAnalysisOfApplicableReturns?.top_counts?.map((i) => i?.count_of_applicable_returns) || [] }],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: { bar: { horizontal: false } },
      dataLabels: { enabled: false },
      xaxis: { categories: stateWiseAnalysisOfApplicableReturns?.top_counts?.map((i) => i?.state) || [], title: { text: "State" } },
      yaxis: { title: { text: "Applicable Returns Count" }, min: 0, tickAmount: 5 },
      colors: ["#5ad5e2ff"],
      fill: { opacity: 1 },
      states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } },
    }
  };
  const userRole = decryptData(localStorage.getItem("user_role"));
  // --- Fetch ---
  useEffect(() => {
    const fetchData = async () => {
      const [
        returnApplicabilityRes,
        stateWiseAnalysisRes,
        frequencyWiseReturnsRes,
        companiesPerReturnsNamesRes,
        complianceRiskDistributionByStateRes,
        complianceStatusBasedOnReturnsRes,
        remarksBasedOnCompanyRes
      ] = await Promise.allSettled([
        fetchReturnApplicabilityByCompanyCommonName(selectedCompany),
        fetchStateWiseAnalysisOfApplicableReturns(selectedCompany),
        fetchFrequencyWiseReturns(selectedCompany),
        fetchCompaniesPerReturnsNames(selectedCompany),
        fetchComplianceRiskDistributionByState(selectedCompany),
        fetchComplianceStatusBasedOnReturns(selectedCompany),
        fetchRemarksBasedOnCompany(selectedCompany),
      ]);

      if (returnApplicabilityRes.status === 'fulfilled') setComparisonOfReturnApplicability(returnApplicabilityRes.value);
      else {
        console.warn("fetchReturnApplicability failed:", returnApplicabilityRes.reason);
        setComparisonOfReturnApplicability(returnApplicabilityRes.reason?.status || {});
      }

      if (stateWiseAnalysisRes.status === 'fulfilled') setStateWiseAnalysisOfApplicableReturns(stateWiseAnalysisRes.value);
      else {
        console.warn("fetchStateWiseAnalysis failed:", stateWiseAnalysisRes.reason);
        setStateWiseAnalysisOfApplicableReturns(stateWiseAnalysisRes.reason?.status || {});
      }

      if (frequencyWiseReturnsRes.status === 'fulfilled') setApplicableReturnsCount(frequencyWiseReturnsRes.value);
      else {
        console.warn("fetchFrequencyWiseReturns failed:", frequencyWiseReturnsRes.reason);
        setApplicableReturnsCount(frequencyWiseReturnsRes.reason?.status || {});
      }

      if (companiesPerReturnsNamesRes.status === 'fulfilled') setCompaniesPerReturnsNames(companiesPerReturnsNamesRes.value);
      else {
        console.warn("fetchCompaniesPerReturnsNames failed:", companiesPerReturnsNamesRes.reason);
        setCompaniesPerReturnsNames(companiesPerReturnsNamesRes.reason?.status || {});
      }

      if (complianceRiskDistributionByStateRes.status === 'fulfilled') setRiskDistributionByState(complianceRiskDistributionByStateRes.value);
      else {
        console.warn("fetchComplianceRiskDistributionByState failed:", complianceRiskDistributionByStateRes.reason);
        setRiskDistributionByState(complianceRiskDistributionByStateRes.reason?.status || {});
      }

      if (complianceStatusBasedOnReturnsRes.status === 'fulfilled') {
        // keep raw; normalization above will handle shape
        setApplicableReturnsRaw(complianceStatusBasedOnReturnsRes.value);
      } else {
        console.warn("fetchComplianceStatusBasedOnReturns failed:", complianceStatusBasedOnReturnsRes.reason);
        setApplicableReturnsRaw(complianceStatusBasedOnReturnsRes.reason?.status || []);
      }

      if (remarksBasedOnCompanyRes.status === 'fulfilled') setEscalationRaisedCategoriesByCompany(remarksBasedOnCompanyRes.value);
      else {
        console.warn("fetchRemarksBasedOnCompany failed:", remarksBasedOnCompanyRes.reason);
        setEscalationRaisedCategoriesByCompany(remarksBasedOnCompanyRes.reason?.status || {});
      }
    };

    fetchData();
  }, [selectedCompany]);

  // reset chart selections when user changes
  useEffect(() => {
    setSelectedCharts([]);
  }, [current?.user_name]);

  const columnDefs = useMemo(() => {
    const firstRemark = escalationRaisedCategoriesByCompany?.count_remark?.[0];
    if (!firstRemark) return [];

    return Object.keys(firstRemark).map((key) => ({
      headerName: key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      field: key,
      sortable: true,
      filter: true,
      flex: 1,
      headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
    }));
  }, [escalationRaisedCategoriesByCompany]);


  const canSelect = userRole === 'Admin' || userRole === 'Super-Admin';

  const cardClass = (id, defaultClass = "") =>
    canSelect && selectedCharts.includes(id) ? "selected-card" : defaultClass;


  const handleSelect = (id) => {
    if (canSelect) toggleChartSelection(id);
  };
  const returnSubmissionCharts = [
    {
      id: "rs-1",
      title: "Top 5 comparison of Return Applicability across Companies",
      type: "bar",
      format: comparisonOfReturnApplicabilityFormat,
      drawer: {
        side: "right",
        title: "Average delay between data request and received date",
        data: comparisonOfReturnApplicability?.rest_counts || [],
        categories: comparisonOfReturnApplicability?.rest_counts?.map(i => i.company_name) || []
      }
    },
    {
      id: "rs-2",
      title: "Frequency-wise distribution of applicable returns",
      type: "donut",
      format: ApplicableReturnsCountFormat,
      drawer: null
    },
    {
      id: "rs-3",
      title: "Compliance status comparison across different return types",
      type: "bar",
      format: applicableReturnsByLocationFormat,
      drawer: null
    },
    {
      id: "rs-4",
      title: "Top 5 applicable return names across companies",
      type: "bar",
      format: companiesPerReturnsNamesFormat,
      drawer: {
        side: "right",
        title: "Applicable returns by company",
        data: companiesPerReturnsNames?.rest_counts || [],
        categories: companiesPerReturnsNames?.rest_counts?.map(i => i.returns_name) || []
      }
    },
    {
      id: "rs-5",
      title: "Compliance risk distribution by state",
      type: "bar",
      format: riskDistributionByStateFormat,
      drawer: {
        side: "right",
        title: "Risk distribution by state",
        data: riskDistributionByState?.rest_counts || [],
        categories: riskDistributionByState?.rest_counts?.map(i => i.state) || []
      }
    },
    {
      id: "rs-6",
      title: "State-wise analysis of applicable returns",
      type: "bar",
      format: applicableReturnsByStateFormat,
      drawer: {
        side: "right",
        title: "State-wise analysis of applicable returns",
        data: stateWiseAnalysisOfApplicableReturns?.rest_counts || [],
        categories: stateWiseAnalysisOfApplicableReturns?.rest_counts?.map(i => i.state) || []
      }
    },
    {
      id: "rs-7",
      type: "ag-grid",
      title: "Breakdown of escalation raised categories by company",
      rowData: escalationRaisedCategoriesByCompany?.count_remark || [],
      columnDefs: columnDefs
    }
  ];

  return (
    <div>
      <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
      <div className="charts-grid mb-4">
        {returnSubmissionCharts.map((chart) => {
          if (!shouldShow(chart.id)) return null; // hide chart
          // AG GRID CHART
          if (chart.type === "ag-grid") {
            return (
              <div
                key={chart.id}
                className={`chart-card ${cardClass(chart.id) ? "selected-card" : ""}`}
                style={{ cursor: canSelect ? "pointer" : "default", height: "515px" }}
                onClick={canSelect ? () => handleSelect(chart.id) : undefined}
              >
                <div className="d-flex justify-content-end align-items-center">
                  <input
                    type="checkbox"
                    className="chart-select-checkbox"
                    onChange={() => toggleChartSelection(chart.id)}
                    checked={selectedCharts.includes(chart.id)}
                  />
                </div>

                <div className="ag-theme-quartz" style={{ height: "400px", width: "100%", marginTop: "1rem" }}>
                  <div className="mb-3 fw-600">{chart.title}</div>
                  <AgGridReact
                    theme="legacy"
                    rowData={chart.rowData}
                    columnDefs={chart.columnDefs}
                    pagination
                    paginationPageSize={5}
                  />
                </div>
              </div>
            );
          }

          // NORMAL CHARTS (BAR, DONUT, ETC)
          return (
            <div
              key={chart.id}
              className={`chart-card ${cardClass(chart.id) ? "selected-card" : ""}`}
              onClick={canSelect ? () => handleSelect(chart.id) : undefined}
              style={{ cursor: canSelect ? "pointer" : "default" }}
            >
              <div className="d-flex justify-content-end align-items-center">
                <input
                  type="checkbox"
                  className="chart-select-checkbox"
                  onChange={() => toggleChartSelection(chart.id)}
                  checked={selectedCharts.includes(chart.id)}
                />

                {/* Drawer or Snackbar */}
                {chart.drawer ? (
                  <div
                    className="dashboard-icon ms-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDrawer(
                        chart.drawer.side,
                        chart.drawer.title,
                        chart.drawer.data,
                        chart.drawer.categories
                      );
                    }}
                  >
                    <ArrowUpRight />
                  </div>
                ) : (
                  <div
                    className="dashboard-icon ms-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSnackbarsOpen({
                        ...issnackbarsOpen,
                        open: true,
                        message: "No Data available",
                        severityType: "info"
                      });
                    }}
                  >
                    <ArrowUpRight />
                  </div>
                )}
              </div>

              <div className="mb-3 fw-600">{chart.title}</div>

              <Chart
                options={chart.format.options}
                series={chart.format.series}
                type={chart.type}
                height={380}
              />
            </div>
          );
        })}
      </div>


      <DashboardDrawerGrid
        anchor={drawerAnchor}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={drawerData}
        title={drawerTitle}
        chartXaxisCategory={chartXaxisCategory}
      />
    </div>

  );
};

export default ReturnsAndSubmissions;
