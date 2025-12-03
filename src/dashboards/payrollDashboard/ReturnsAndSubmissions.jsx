import React, { useEffect, useState } from 'react'
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

const ReturnsAndSubmissions = ({
  selectedCompany,
  current,
  selectedCharts,
  setSelectedCharts,
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
  const [escalationRaisedCategoriesByCompany, setEscalationRaisedCategoriesByCompany] = useState({});
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

  // escalationRaisedCategoriesByCompany may be object with count_remark
  const escalationByCompanyArray = ensureArray(escalationRaisedCategoriesByCompany, []);
  const escalationRaisedCategoriesByCompanyFormat = {
    series: [
      { name: 'Files Successfully', data: escalationByCompanyArray.map((i) => i?.count_filed_successfully || 0) },
      { name: 'Received late data from KAO', data: escalationByCompanyArray.map((i) => i?.count_received_late_data_from_kao || 0) },
      { name: 'Empty', data: escalationByCompanyArray.map((i) => i?.count_empty || 0) },
      { name: 'Missing due date', data: escalationByCompanyArray.map((i) => i?.count_missing_due_date || 0) }
    ],
    options: {
      chart: { type: 'bar', height: 350, stacked: true },
      fill: { opacity: 1 },
      states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: { total: { enabled: true, offsetX: 0, style: { fontSize: '13px', fontWeight: 900 } } }
        }
      },
      stroke: { width: 1, colors: ['#fff'] },
      title: { text: 'Escalation Counts' },
      xaxis: { categories: escalationByCompanyArray.map((i) => i?.company_name || "") },
      yaxis: { title: { text: undefined } },
      legend: { position: 'top', horizontalAlign: 'left', offsetX: 40 }
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

  return (
    <div>
      <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />

      <div className='charts-grid mb-4'>
        <div
          className={`chart-card ${selectedCharts.includes("rs-1") ? "selected-card" : ""}`}
          onClick={() => toggleChartSelection("rs-1")}
          style={{ cursor: "pointer" }}
        >
          <div className='d-flex justify-content-end align-items-center' >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("rs-1")}
              checked={selectedCharts.includes("rs-1")}
            />
            <div
              className='dashboard-icon ms-2'
              onClick={() =>
                handleOpenDrawer(
                  "right",
                  "Average delay between data request date and client data received date by company",
                  comparisonOfReturnApplicability?.rest_counts || [],
                  comparisonOfReturnApplicability?.rest_counts?.map((item) => item.company_name) || []
                )
              }
            >
              <ArrowUpRight />
            </div>
          </div>

          <div className="mb-3 fw-600">Top 5 comparison of Return Applicability across Companies</div>
          <Chart options={comparisonOfReturnApplicabilityFormat.options} series={comparisonOfReturnApplicabilityFormat.series} type="bar" height={380} />
        </div>

        <div
          className={`chart-card ${selectedCharts.includes("rs-2") ? "selected-card" : ""}`}
          onClick={() => toggleChartSelection("rs-2")}
          style={{ cursor: "pointer" }}
        >
          <div className='d-flex justify-content-end align-items-center' >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("rs-2")}
              checked={selectedCharts.includes("rs-2")}
            />
            <div
              className='dashboard-icon ms-2'
              onClick={() => setIsSnackbarsOpen(prev => ({ ...prev, open: true, message: "No Data available", severityType: "info" }))}
            >
              <ArrowUpRight />
            </div>
          </div>

          <div className="mb-3 fw-600">Frequency-wise distribution of applicable returns, revealing dominant compliance cycles</div>
          <Chart options={ApplicableReturnsCountFormat.options} series={ApplicableReturnsCountFormat.series} type="donut" height={380} />
        </div>
      </div>

      <div className='charts-grid mb-4'>
        <div
          className={`chart-card ${selectedCharts.includes("rs-3") ? "selected-card" : ""}`}
          onClick={() => toggleChartSelection("rs-3")}
          style={{ cursor: "pointer" }}
        >
          <div className='d-flex justify-content-end align-items-center' >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("rs-3")}
              checked={selectedCharts.includes("rs-3")}
            />
            <div
              className='dashboard-icon ms-2'
              onClick={() => setIsSnackbarsOpen(prev => ({ ...prev, open: true, message: "No Data available", severityType: "info" }))}
            >
              <ArrowUpRight />
            </div>
          </div>

          <div className="mb-3 fw-600">Compliance status comparison across different return types, highlighting returns with the highest completion rates.</div>
          <Chart options={applicableReturnsByLocationFormat.options} series={applicableReturnsByLocationFormat.series} type="bar" height={380} />
        </div>

        <div
          className={`chart-card ${selectedCharts.includes("rs-4") ? "selected-card" : ""}`}
          onClick={() => toggleChartSelection("rs-4")}
          style={{ cursor: "pointer" }}
        >
          <div className='d-flex justify-content-end align-items-center' >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("rs-4")}
              checked={selectedCharts.includes("rs-4")}
            />
            <div
              className='dashboard-icon ms-2'
              onClick={() =>
                handleOpenDrawer(
                  "right",
                  "Analysis of applicable return names, identifying the most frequently required returns across companies",
                  companiesPerReturnsNames?.rest_counts || [],
                  companiesPerReturnsNames?.rest_counts?.map((item) => item?.returns_name) || []
                )
              }
            >
              <ArrowUpRight />
            </div>
          </div>

          <div className="mb-3 fw-600">Top 5 analysis of applicable return names, identifying the most frequently required returns across companies</div>
          <Chart options={companiesPerReturnsNamesFormat.options} series={companiesPerReturnsNamesFormat.series} type="bar" height={380} />
        </div>
      </div>

      <div className='charts-grid mb-4'>
        <div
          className={`chart-card ${selectedCharts.includes("rs-5") ? "selected-card" : ""}`}
          onClick={() => toggleChartSelection("rs-5")}
          style={{ cursor: "pointer" }}
        >
          <div className='d-flex justify-content-end align-items-center' >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("rs-5")}
              checked={selectedCharts.includes("rs-5")}
            />
            <div
              className='dashboard-icon ms-2'
              onClick={() =>
                handleOpenDrawer(
                  "right",
                  "Compliance risk distribution by state, identifying regions with elevated compliance risk levels",
                  riskDistributionByState?.rest_counts || [],
                  riskDistributionByState?.rest_counts?.map((item) => item?.state) || []
                )
              }
            >
              <ArrowUpRight />
            </div>
          </div>

          <div className="mb-3 fw-600">Top 5 compliance risk distribution by state, identifying regions with elevated compliance risk levels.</div>
          <Chart options={riskDistributionByStateFormat.options} series={riskDistributionByStateFormat.series} type="bar" height={380} />
        </div>

        <div
          className={`chart-card ${selectedCharts.includes("rs-6") ? "selected-card" : ""}`}
          onClick={() => toggleChartSelection("rs-6")}
          style={{ cursor: "pointer" }}
        >
          <div className='d-flex justify-content-end align-items-center' >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("rs-6")}
              checked={selectedCharts.includes("rs-6")}
            />
            <div
              className='dashboard-icon ms-2'
              onClick={() =>
                handleOpenDrawer(
                  "right",
                  "State-wise analysis of applicable returns, showcasing regional concentration of compliance activities",
                  stateWiseAnalysisOfApplicableReturns?.rest_counts || [],
                  stateWiseAnalysisOfApplicableReturns?.rest_counts?.map((item) => item?.state) || []
                )
              }
            >
              <ArrowUpRight />
            </div>
          </div>

          <div className="mb-3 fw-600">Top 5 state-wise analysis of applicable returns, showcasing regional concentration of compliance activities.</div>
          <Chart options={applicableReturnsByStateFormat.options} series={applicableReturnsByStateFormat.series} type="bar" height={380} />
        </div>
      </div>

      <div className='mb-4'>
        <div
          className={`chart-card ${selectedCharts.includes("rs-7") ? "selected-card" : ""}`}
          style={{ cursor: "pointer" }}
          onClick={() => toggleChartSelection("rs-7")}
        >
          <div
            className="d-flex justify-content-lg-end justify-content-md-end align-items-center"
            
          >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("rs-7")}
              checked={selectedCharts.includes("rs-7")}
              disabled={!current?.user_name}
            />
            <div className="dashboard-icon ms-2" onClick={() => setIsSnackbarsOpen(prev => ({ ...prev, open: true, message: "No Data available", severityType: "info" }))}>
              <ArrowUpRight />
            </div>
          </div>

          <div className="mb-3 fw-600">Breakdown of escalation raised categories by company, revealing escalation hotspots</div>
          <Chart options={escalationRaisedCategoriesByCompanyFormat.options} series={escalationRaisedCategoriesByCompanyFormat.series} type="bar" height={380} />
        </div>
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
