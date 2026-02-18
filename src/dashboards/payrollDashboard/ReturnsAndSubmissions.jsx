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
import { generateDynamicSeries } from '../../../Utils/chartUtils';
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
  const [isDetailPage, setIsDetailPage] = useState(false);
  const [isDetailPageData, setIsDetailPageData] = useState([]);
  const handleOpenDrawer = (anchor, title, data = [], chartXaxisCategories = [], isDetailData) => {
    setDrawerAnchor(anchor);
    setDrawerTitle(title);
    setDrawerOpen(true);
    setDrawerData(data);
    setChartXaxisCategory(chartXaxisCategories);
    setIsDetailPageData(isDetailData);

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
  const riskDistributionByStateFormatSeries = generateDynamicSeries(
    riskDistributionByState?.top_counts || [],
    {
      excludeKeys: ["state",],
    }
  );
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
    series: riskDistributionByStateFormatSeries,
    options: {
      chart: { type: "bar", toolbar: { show: false }, stacked: true },

      plotOptions: { bar: { horizontal: true } },
      dataLabels: { enabled: false },
      xaxis: { categories: riskDistributionByState?.top_counts?.map((i) => i?.state) || [], title: { text: "Risk Level Count" } },
      yaxis: { title: { text: "State" }, min: 0, tickAmount: 5 },
      colors: riskDistributionByStateFormatSeries.map(
        (_, index) => `hsl(${(index * 60) % 360}, 50%, 60%)`
      ),
      fill: {
        opacity: 1, colors: riskDistributionByStateFormatSeries.map(
          (_, index) => `hsl(${(index * 60) % 360}, 50%, 60%)`
        ),
      },
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
        setComparisonOfReturnApplicability(returnApplicabilityRes.reason?.status || {});
      }

      if (stateWiseAnalysisRes.status === 'fulfilled') setStateWiseAnalysisOfApplicableReturns(stateWiseAnalysisRes.value);
      else {
        setStateWiseAnalysisOfApplicableReturns(stateWiseAnalysisRes.reason?.status || {});
      }

      if (frequencyWiseReturnsRes.status === 'fulfilled') setApplicableReturnsCount(frequencyWiseReturnsRes.value);
      else {
        setApplicableReturnsCount(frequencyWiseReturnsRes.reason?.status || {});
      }

      if (companiesPerReturnsNamesRes.status === 'fulfilled') setCompaniesPerReturnsNames(companiesPerReturnsNamesRes.value);
      else {
        setCompaniesPerReturnsNames(companiesPerReturnsNamesRes.reason?.status || {});
      }

      if (complianceRiskDistributionByStateRes.status === 'fulfilled') setRiskDistributionByState(complianceRiskDistributionByStateRes.value);
      else {
        setRiskDistributionByState(complianceRiskDistributionByStateRes.reason?.status || {});
      }

      if (complianceStatusBasedOnReturnsRes.status === 'fulfilled') {
        // keep raw; normalization above will handle shape
        setApplicableReturnsRaw(complianceStatusBasedOnReturnsRes.value);
      } else {
        setApplicableReturnsRaw(complianceStatusBasedOnReturnsRes.reason?.status || []);
      }

      if (remarksBasedOnCompanyRes.status === 'fulfilled') setEscalationRaisedCategoriesByCompany(remarksBasedOnCompanyRes.value);
      else {
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

  return (
    <div>
      <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
      <div className="charts-grid mb-4">
        {shouldShow("rs-1") && (
          <div
            className={`chart-card ${cardClass("rs-1") ? "selected-card" : ""
              }`}
            onClick={canSelect ? () => handleSelect("rs-1") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div
              className="d-flex justify-content-end align-items-center"

            >
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("rs-1")}
                checked={selectedCharts.includes("rs-1")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();   // prevent parent click from firing
                  handleOpenDrawer(
                    "right",
                    "Average delay between data request and received date",
                    comparisonOfReturnApplicability?.rest_count,
                    comparisonOfReturnApplicability?.rest_count?.map(
                      (item) => item.pending_from
                    ),
                    comparisonOfReturnApplicability?.returns_records
                  )
                }

                }
              >
                <ArrowUpRight />
              </div>
            </div>
            <div className="mb-3 fw-600">
              Top 5 comparison of Return Applicability across Companies
            </div>
            <Chart
              options={comparisonOfReturnApplicabilityFormat.options}
              series={comparisonOfReturnApplicabilityFormat.series}
              type="bar"
              height={380}
            />
          </div>
        )}

        {shouldShow("rs-2") && (
          <div
            className={`chart-card ${cardClass("rs-2") ? "selected-card" : ""
              }`}
            onClick={canSelect ? () => handleSelect("rs-2") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div
              className="d-flex justify-content-end align-items-center"

            >
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("rs-2")}
                checked={selectedCharts.includes("rs-2")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();   // prevent parent click from firing
                  handleOpenDrawer(
                    "right",
                    "Frequency-wise distribution of applicable returns",
                    ApplicableReturnsCount?.frequency_returns,
                    ApplicableReturnsCount?.frequency_returns?.map(
                      (item) => item.frequency
                    ),
                    ApplicableReturnsCount?.returns_records
                  )
                }

                }
              >
                <ArrowUpRight />
              </div>
            </div>
            <div className="mb-3 fw-600">
              Frequency-wise distribution of applicable returns
            </div>
            <Chart
              options={ApplicableReturnsCountFormat.options}
              series={ApplicableReturnsCountFormat.series}
              type="donut"
              height={380}
            />
          </div>
        )}
      </div>

      <div className="charts-grid mb-4">
        {shouldShow("rs-3") && (
          <div
            className={`chart-card ${cardClass("rs-3") ? "selected-card" : ""}`}
            onClick={canSelect ? () => handleSelect("rs-3") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div className="d-flex justify-content-end align-items-center">
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("rs-3")}
                checked={selectedCharts.includes("rs-3")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();   // prevent parent click from firing
                  handleOpenDrawer(
                    "right",
                    "Compliance status comparison across different return types",
                    applicableReturnsRaw?.rest_count,
                    applicableReturnsRaw?.rest_count?.map(
                      (item) => item.returns
                    ),
                    applicableReturnsRaw?.returns_records
                  )
                }

                }
              >
                <ArrowUpRight />
              </div>
            </div>

            <div className="mb-3 fw-600">
              Compliance status comparison across different return types
            </div>

            <Chart
              options={applicableReturnsByLocationFormat.options}
              series={applicableReturnsByLocationFormat.series}
              type="bar"
              height={380}
            />
          </div>
        )}

        {shouldShow("rs-4") && (
          <div
            className={`chart-card ${cardClass("rs-4") ? "selected-card" : ""}`}
            onClick={canSelect ? () => handleSelect("rs-4") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div className="d-flex justify-content-end align-items-center">
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("rs-4")}
                checked={selectedCharts.includes("rs-4")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer(
                    "right",
                    "Applicable returns by company",
                    companiesPerReturnsNames?.rest_counts,
                    companiesPerReturnsNames?.rest_counts?.map(i => i.returns_name),
                    companiesPerReturnsNames?.returns_records
                  );
                }}
              >
                <ArrowUpRight />
              </div>
            </div>

            <div className="mb-3 fw-600">
              Top 5 applicable return names across companies
            </div>

            <Chart
              options={companiesPerReturnsNamesFormat.options}
              series={companiesPerReturnsNamesFormat.series}
              type="bar"
              height={380}
            />
          </div>
        )}
      </div>
      <div className="charts-grid mb-4">
        {shouldShow("rs-5") && (
          <div
            className={`chart-card ${cardClass("rs-5") ? "selected-card" : ""}`}
            onClick={canSelect ? () => handleSelect("rs-5") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div className="d-flex justify-content-end align-items-center">
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("rs-5")}
                checked={selectedCharts.includes("rs-5")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer(
                    "right",
                    "Risk distribution by state",
                    riskDistributionByState?.rest_counts,
                    riskDistributionByState?.rest_counts?.map(i => i.state),
                    riskDistributionByState?.returns_records
                  );
                }}
              >
                <ArrowUpRight />
              </div>
            </div>

            <div className="mb-3 fw-600">
              Compliance risk distribution by state
            </div>

            <Chart
              options={riskDistributionByStateFormat.options}
              series={riskDistributionByStateFormat.series}
              type="bar"
              height={380}
            />
          </div>
        )}

        {shouldShow("rs-6") && (
          <div
            className={`chart-card ${cardClass("rs-6") ? "selected-card" : ""}`}
            onClick={canSelect ? () => handleSelect("rs-6") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div className="d-flex justify-content-end align-items-center">
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("rs-6")}
                checked={selectedCharts.includes("rs-6")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer(
                    "right",
                    "State-wise analysis of applicable returns",
                    stateWiseAnalysisOfApplicableReturns?.rest_counts,
                    stateWiseAnalysisOfApplicableReturns?.rest_counts?.map(i => i.state),
                    stateWiseAnalysisOfApplicableReturns?.returns_records
                  );
                }}
              >
                <ArrowUpRight />
              </div>
            </div>

            <div className="mb-3 fw-600">
              State-wise analysis of applicable returns
            </div>

            <Chart
              options={applicableReturnsByStateFormat.options}
              series={applicableReturnsByStateFormat.series}
              type="bar"
              height={380}
            />
          </div>
        )}
      </div>
      {shouldShow("rs-7") && (
        <div
          className={`chart-card ${cardClass("rs-7") ? "selected-card" : ""}`}
          onClick={canSelect ? () => handleSelect("rs-7") : undefined}
          style={{ height: '515px' }}
        >
          <div className="ag-theme-quartz" style={{ height: "400px", width: "100%", marginTop: "1rem" }}>
            <div className="mb-3 fw-600">Breakdown of escalation raised categories by company</div>
            <AgGridReact
              theme="legacy"
              rowData={escalationRaisedCategoriesByCompany?.count_remark || []}
              columnDefs={columnDefs}
              pagination
              paginationPageSize={20}
            />
          </div>
        </div>
      )}

      <DashboardDrawerGrid
        anchor={drawerAnchor}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={drawerData}
        title={drawerTitle}
        chartXaxisCategory={chartXaxisCategory}
        isDetailPage={isDetailPage}
        setIsDetailPage={setIsDetailPage}
        isDetailPageData={isDetailPageData}
      />
    </div>

  );
};

export default ReturnsAndSubmissions;
