import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import {
  fetchAuditByServiceType,
  fetchAuditMeetingSLAByResponsibleTeam,
  fetchAuditPlatformsCountByStateSegmented,
  fetchAuditStatusByCompany,
  fetchAuditStatusCount,
  fetchCountOfRiskLevel,
  fetchEscalationTriggeredRateByState,
  fetchRiskLevelBasedOnServiceType,
} from "../../api/service";
import DashboardDrawerGrid from "../DashboardDrawer";
import { ArrowUpRight, X } from "lucide-react";
import Snackbars from "../../component/Snackbars";

const AuditAndVisitDashboard = ({
  selectedCompany,
  current,
  selectedCharts,
  setSelectedCharts,
}) => {
  const [AuditCountByServiceType, setAuditCountByServiceType] = React.useState(
    []
  );
  const AuditCountByServiceTypeFormat = {
    series: [
      {
        name: "Audit Count",
        data:
          AuditCountByServiceType?.top_counts?.map((item) => item.count) || [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },
      colors: ["#2cafc0ff", "#5ad5e2"],
      fill: {
        opacity: 1,
        colors: ["#2cafc0ff", "#5ad5e2"],
      },
      states: {
        hover: {
          filter: {
            type: "none", // 👈 disables the lighten effect
          },
        },
        active: {
          filter: {
            type: "none", // 👈 disables click highlight effect
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },

      xaxis: {
        categories:
          AuditCountByServiceType?.top_counts?.map(
            (item) => item.service_type
          ) || [],
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    },
  };
  const [AuditCountByStateSegmented, setAuditCountByStateSegmented] =
    React.useState([]);

  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    severityType: "",
  });
  const toggleChartSelection = (chartId) => {
    if (!current?.user_name) {
      // alert("First you need to select a user");
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: "First you need to select a user",
        severityType: "warning",
      });
      return;
    }

    setSelectedCharts((prev) =>
      prev.includes(chartId)
        ? prev.filter((id) => id !== chartId)
        : [...prev, chartId]
    );
  };
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerAnchor, setDrawerAnchor] = React.useState("right");
  const [drawerTitle, setDrawerTitle] = useState("");
  const [drawerData, setDrawerData] = useState("");
  const [chartXaxisCategory, setChartXaxisCategory] = React.useState("");
  const handleOpenDrawer = (anchor, title, data = [], chartXaxisCategory) => {
    setDrawerAnchor(anchor);
    setDrawerTitle(title);
    setDrawerOpen(true);
    setDrawerData(data);
    setChartXaxisCategory(chartXaxisCategory);
  };
  const data = AuditCountByStateSegmented?.top_count || [];

  // Collect all keys except "state"
  const keys =
    data.length > 0 ? Object.keys(data[0]).filter((k) => k !== "state") : [];
  // Function to convert any key into readable series name
  const cleanName = (key) => {
    return (
      key
        // remove prefix count_
        .replace(/^count_/, "")
        // remove suffix _count
        .replace(/_count$/, "")
        // remove any middle count_
        .replace(/count_/g, "")
        // replace _ with space
        .replace(/_/g, " ")
        .toUpperCase()
    );
  };

  // Create dynamic series
  const series = keys.map((key) => ({
    name: cleanName(key),
    data: data.map((item) => item[key] || 0),
  }));

  const AuditCountByStateSegmentedFormat = {
    series: series,
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },
      colors: ["#2cafc0ff", "#5ad5e2", "#f4b841", "#f45b5b"],
      fill: {
        opacity: 1,
        colors: ["#2cafc0ff", "#5ad5e2", "#f4b841", "#f45b5b"],
      },
      states: {
        hover: {
          filter: {
            type: "none", // 👈 disables the lighten effect
          },
        },
        active: {
          filter: {
            type: "none", // 👈 disables click highlight effect
          },
        },
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories:
          AuditCountByStateSegmented?.top_count?.map((item) => item.state) ||
          [],
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    },
  };
  const [AuditPercentageMeetingSLA, setAuditPercentageMeetingSLA] =
    React.useState([]);
  const AuditPercentageMeetingSLAFormat = {
    series: [
      {
        name: "SLA Met (Y)",
        data: AuditPercentageMeetingSLA?.map((item) => item.count_y) || [],
      },
      {
        name: "SLA Met (N)",
        data: AuditPercentageMeetingSLA?.map((item) => item.count_n) || [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      colors: ["#5ad5e2", "#f4b841"],
      fill: {
        opacity: 1,
        colors: ["#5ad5e2", "#f4b841"],
      },
      states: {
        hover: {
          filter: {
            type: "none", // 👈 disables the lighten effect
          },
        },
        active: {
          filter: {
            type: "none", // 👈 disables click highlight effect
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories:
          AuditPercentageMeetingSLA?.map((item) => item.responsible_team) || [],
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },

      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    },
  };
  const [
    checklistApprovalRateByCompanyName,
    setChecklistApprovalRateByCompanyName,
  ] = React.useState([]);
  const checklistApprovalRateByCompanyNameFormat = {
    series: [
      {
        name: "Approval Rate",
        data:
          checklistApprovalRateByCompanyName?.top_counts?.map(
            (item) => item.checklist_rate
          ) || [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      colors: ["#5ad5e2"],
      fill: {
        opacity: 1,
        colors: ["#5ad5e2"],
      },
      states: {
        hover: {
          filter: {
            type: "none", // 👈 disables the lighten effect
          },
        },
        active: {
          filter: {
            type: "none", // 👈 disables click highlight effect
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories:
          checklistApprovalRateByCompanyName?.top_counts?.map(
            (item) => item.company_name
          ) || [],
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    },
  };
  const [riskLevel, setRiskLevel] = React.useState([]);
  const riskLevelFormat = {
    series: riskLevel?.map((item) => item.count) || [],
    options: {
      chart: {
        width: 380,
        type: "donut",
      },
      colors: ["#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#c8fdf1ff"],
      fill: {
        opacity: 1,
        colors: ["#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#c8fdf1ff"],
      },
      states: {
        hover: {
          filter: {
            type: "none", // 👈 disables the lighten effect
          },
        },
        active: {
          filter: {
            type: "none", // 👈 disables click highlight effect
          },
        },
      },

      labels: riskLevel?.map((item) => item.risk_level) || [],
      legend: {
        position: "top", // 👈 moves Yes/No below the chart
        horizontalAlign: "center",
        fontSize: "14px",
        markers: {
          radius: 12,
        },
        labels: {
          colors: "#333",
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 250,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };
  const [countOfAuditStatus, setCountOfAuditStatus] = React.useState([]);
  const countOfAuditStatusFormated = {
    series: countOfAuditStatus?.map((item) => item.count) || [],
    options: {
      chart: {
        width: 380,
        type: "donut",
      },
      colors: ["#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#c8fdf1ff"],
      fill: {
        opacity: 1,
        colors: ["#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#c8fdf1ff"],
      },
      states: {
        hover: {
          filter: {
            type: "none", // 👈 disables the lighten effect
          },
        },
        active: {
          filter: {
            type: "none", // 👈 disables click highlight effect
          },
        },
      },

      labels: countOfAuditStatus?.map((item) => item.audit_status) || [],
      legend: {
        position: "top", // 👈 moves Yes/No below the chart
        horizontalAlign: "center",
        fontSize: "14px",
        markers: {
          radius: 12,
        },
        labels: {
          colors: "#333",
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 250,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };
  const [riskLevelBreakdownByServiceType, setRiskLevelBreakdownByServiceType] =
    React.useState([]);
  const RiskLevelBreakdownByServiceTypeFormat = {
    series: [
      {
        name: "High",
        data: riskLevelBreakdownByServiceType?.map((item) => item.high) || [],
      },
      {
        name: "Medium",
        data: riskLevelBreakdownByServiceType?.map((item) => item.medium) || [],
      },
      {
        name: "Low",
        data: riskLevelBreakdownByServiceType?.map((item) => item.low) || [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      colors: ["#2cafc0ff", "#5ad5e2", "#f4b841"],
      fill: {
        opacity: 1,
        colors: ["#2cafc0ff", "#5ad5e2", "#f4b841"],
      },
      states: {
        hover: {
          filter: {
            type: "none", // 👈 disables the lighten effect
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },

      xaxis: {
        categories:
          riskLevelBreakdownByServiceType?.map((item) => item.service_type) ||
          [],
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    },
  };
  const [escalationTriggeredRateByState, setEscalationTriggeredRateByState] =
    React.useState([]);
  const escalationTriggeredRateByStateFormat = {
    series: [
      {
        name: "Escalation Count",
        data:
          escalationTriggeredRateByState?.top_counts?.map(
            (item) => item.count_of_escalation
          ) || [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },
      colors: ["#2cafc0ff", "#5ad5e2"],
      fill: {
        opacity: 1,
        colors: ["#2cafc0ff", "#5ad5e2"],
      },
      states: {
        hover: {
          filter: {
            type: "none", // 👈 disables the lighten effect
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories:
          escalationTriggeredRateByState?.top_counts?.map(
            (item) => item.state
          ) || [],
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      const [
        auditRes,
        auditSlaRes,
        auditPlatformsCountByStateSegmentedRes,
        auditStatusByCompanyRes,
        riskLevelRes,
        auditStatusCountRes,
        escalationTriggeredRateByStateRes,
        riskLevelBreakdownByServiceTypeRes,
      ] = await Promise.allSettled([
        fetchAuditByServiceType(selectedCompany),
        fetchAuditMeetingSLAByResponsibleTeam(selectedCompany),
        fetchAuditPlatformsCountByStateSegmented(selectedCompany),
        fetchAuditStatusByCompany(selectedCompany),
        fetchCountOfRiskLevel(selectedCompany),
        fetchAuditStatusCount(selectedCompany),
        fetchEscalationTriggeredRateByState(selectedCompany),
        fetchRiskLevelBasedOnServiceType(selectedCompany),
      ]);
      if (auditRes.status === "fulfilled") {
        setAuditCountByServiceType(auditRes.value);
      } else {
        console.warn("fetchAll audit failed:", auditRes.reason);
        setAuditCountByServiceType(auditRes.reason?.status || []);
      }
      if (auditSlaRes.status === "fulfilled") {
        setAuditPercentageMeetingSLA(auditSlaRes.value);
      } else {
        console.warn("fetchAll audit failed:", auditSlaRes.reason);
        setAuditPercentageMeetingSLA(auditSlaRes.reason?.status || []);
      }
      if (auditPlatformsCountByStateSegmentedRes.status === "fulfilled") {
        setAuditCountByStateSegmented(
          auditPlatformsCountByStateSegmentedRes.value
        );
      } else {
        console.warn(
          "fetchAll audit failed:",
          auditPlatformsCountByStateSegmentedRes.reason
        );
        setAuditCountByStateSegmented(
          auditPlatformsCountByStateSegmentedRes.reason?.status || []
        );
      }
      if (auditStatusByCompanyRes.status === "fulfilled") {
        setChecklistApprovalRateByCompanyName(auditStatusByCompanyRes.value);
      } else {
        console.warn("fetchAll audit failed:", auditStatusByCompanyRes.reason);
        setChecklistApprovalRateByCompanyName(
          auditStatusByCompanyRes.reason?.status || []
        );
      }
      if (riskLevelRes.status === "fulfilled") {
        setRiskLevel(riskLevelRes.value);
      } else {
        console.warn("fetchAll audit failed:", riskLevelRes.reason);
        setRiskLevel(riskLevelRes.reason?.status || []);
      }
      if (auditStatusCountRes.status === "fulfilled") {
        setCountOfAuditStatus(auditStatusCountRes.value);
      } else {
        console.warn("fetchAll audit failed:", auditStatusCountRes.reason);
        setCountOfAuditStatus(auditStatusCountRes.reason?.status || []);
      }
      if (escalationTriggeredRateByStateRes.status === "fulfilled") {
        setEscalationTriggeredRateByState(
          escalationTriggeredRateByStateRes.value
        );
      } else {
        console.warn(
          "fetchAll audit failed:",
          escalationTriggeredRateByStateRes.reason
        );
        setEscalationTriggeredRateByState(
          escalationTriggeredRateByStateRes.reason?.status || []
        );
      }
      if (riskLevelBreakdownByServiceTypeRes.status === "fulfilled") {
        setRiskLevelBreakdownByServiceType(
          riskLevelBreakdownByServiceTypeRes.value
        );
      } else {
        console.warn(
          "fetchAll audit failed:",
          riskLevelBreakdownByServiceTypeRes.reason
        );
        setRiskLevelBreakdownByServiceType(
          riskLevelBreakdownByServiceTypeRes.reason?.status || []
        );
      }
    };
    fetchData();
  }, [selectedCompany]);

  useEffect(() => {
    setSelectedCharts([]);
  }, [current?.user_name]);
  return (
    <div>
      <Snackbars
        issnackbarsOpen={issnackbarsOpen}
        setIsSnackbarsOpen={setIsSnackbarsOpen}
      />
      <div className="charts-grid mb-4">
        <div
          className={`chart-card ${selectedCharts.includes("av-1") ? "selected-card" : ""
            }`}
          onClick={() => toggleChartSelection("av-1")}
          style={{ cursor: "pointer" }}
        >
          <div
            className="d-flex justify-content-end align-items-center"
            
          >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("av-1")}
              checked={selectedCharts.includes("av-1")}
              disabled={!current?.user_name}
            />
            <div
              className="dashboard-icon ms-2"
              onClick={() =>
                handleOpenDrawer(
                  "right",
                  "Aaudit count by Service Type across all companies",
                  AuditCountByServiceType?.rest_counts,
                  AuditCountByServiceType?.rest_counts?.map(
                    (item) => item.service_type
                  )
                )
              }
            >
              <ArrowUpRight />
            </div>
          </div>
          <div className="mb-3 fw-600">
            Top 5 audit count by Service Type across all companies
          </div>
          <Chart
            options={AuditCountByServiceTypeFormat.options}
            series={AuditCountByServiceTypeFormat.series}
            type="bar"
            height={380}
          />
        </div>

        <div
          className={`chart-card ${selectedCharts.includes("av-2") ? "selected-card" : ""
            }`}
          onClick={() => toggleChartSelection("av-2")}
          style={{ cursor: "pointer" }}
        >
          <div
            className="d-flex justify-content-end align-items-center"
            
          >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("av-2")}
              checked={selectedCharts.includes("av-2")}
              disabled={!current?.user_name}
            />
            <div
              className="dashboard-icon ms-2"
              onClick={() =>
                handleOpenDrawer(
                  "right",
                  "Audit count by State segmented by Audit Platform",
                  AuditCountByStateSegmented?.rest_count,
                  AuditCountByStateSegmented?.rest_count?.map(
                    (item) => item.state
                  )
                )
              }
            >
              <ArrowUpRight />
            </div>
          </div>
          <div className="mb-3 fw-600">
            Top 5 audit count by State segmented by Audit Platform
          </div>
          <Chart
            options={AuditCountByStateSegmentedFormat.options}
            series={AuditCountByStateSegmentedFormat.series}
            type="bar"
            height={380}
          />
        </div>
      </div>

      <div className="charts-grid mb-4">
        <div className={`chart-card ${selectedCharts.includes("av-3") ? "selected-card" : ""
          }`}
          onClick={() => toggleChartSelection("av-3")}
          style={{ cursor: "pointer" }}>
          <div
            className="d-flex justify-content-lg-end justify-content-md-end align-items-center"
            
          >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("av-3")}
              checked={selectedCharts.includes("av-3")}
              disabled={!current?.user_name}
            />
            <div className="dashboard-icon ms-2" onClick={
              () => setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: "No Data available",
                severityType: "info",
              })}>
              <ArrowUpRight />
            </div>
          </div>
          <div className="mb-3 fw-600">
            Percentage of audits meeting SLA by Responsible Team
          </div>
          <Chart
            options={AuditPercentageMeetingSLAFormat.options}
            series={AuditPercentageMeetingSLAFormat.series}
            type="bar"
            height={380}
          />
        </div>

        <div
          className={`chart-card ${selectedCharts.includes("av-4") ? "selected-card" : ""
            }`}
          onClick={() => toggleChartSelection("av-4")}
          style={{ cursor: "pointer" }}
        >
          <div
            className="d-flex justify-content-end align-items-center"
            
          >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("av-4")}
              checked={selectedCharts.includes("av-4")}
              disabled={!current?.user_name}
            />
            <div
              className="dashboard-icon ms-2"
              onClick={() =>
                handleOpenDrawer(
                  "right",
                  "Checklist approval rate by Company Name",
                  checklistApprovalRateByCompanyName?.rest_counts,
                  checklistApprovalRateByCompanyName?.rest_counts?.map(
                    (item) => item.company_name
                  )
                )
              }
            >
              <ArrowUpRight />
            </div>
          </div>
          <div className="mb-3 fw-600">
            Top 5 checklist approval rate by Company Name{" "}
          </div>
          <Chart
            options={checklistApprovalRateByCompanyNameFormat.options}
            series={checklistApprovalRateByCompanyNameFormat.series}
            type="bar"
            height={380}
          />
        </div>
      </div>

      <div className="charts-grid mb-4">
        <div className={`chart-card ${selectedCharts.includes("av-5") ? "selected-card" : ""
          }`}
          onClick={() => toggleChartSelection("av-5")}
          style={{ cursor: "pointer" }}>
          <div
            className="d-flex justify-content-lg-end justify-content-md-end align-items-center"
            
          >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("av-5")}
              checked={selectedCharts.includes("av-5")}
              disabled={!current?.user_name}
            />
            <div className="dashboard-icon ms-2" onClick={
              () => setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: "No Data available",
                severityType: "info",
              })}>
              <ArrowUpRight />
            </div>
          </div>
          <div className="mb-3 fw-600">Risk level distribution </div>
          <Chart
            options={riskLevelFormat.options}
            series={riskLevelFormat.series}
            type="donut"
            height={380}
          />
        </div>
        <div
          className={`chart-card ${selectedCharts.includes("av-6") ? "selected-card" : ""
            }`}
          onClick={() => toggleChartSelection("av-6")}
          style={{ cursor: "pointer" }}
        >
          <div
            className="d-flex justify-content-end align-items-center"
            
          >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("av-6")}
              checked={selectedCharts.includes("av-6")}
              disabled={!current?.user_name}
            />
            <div
              className="dashboard-icon ms-2"
              onClick={() =>
                handleOpenDrawer(
                  "left",
                  "Escalation Triggered (Y/N) rate by State",
                  escalationTriggeredRateByState?.rest_counts,
                  escalationTriggeredRateByState?.rest_counts?.map(
                    (item) => item.state
                  )
                )
              }
            >
              <ArrowUpRight />
            </div>
          </div>
          <div className="mb-3 fw-600">
            Top 5 Escalation Triggered (Y/N) rate by State
          </div>
          <Chart
            options={escalationTriggeredRateByStateFormat.options}
            series={escalationTriggeredRateByStateFormat.series}
            type="bar"
            height={380}
          />
        </div>
      </div>

      <div className="charts-grid mb-4">
        <div className={`chart-card ${selectedCharts.includes("av-7") ? "selected-card" : ""
          }`}
          onClick={() => toggleChartSelection("av-7")}
          style={{ cursor: "pointer" }}>

          <div
            className="d-flex justify-content-lg-end justify-content-md-end align-items-center"
            
          >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("av-7")}
              checked={selectedCharts.includes("av-7")}
              disabled={!current?.user_name}
            />
            <div className="dashboard-icon ms-2" onClick={
              () => setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: "No Data available",
                severityType: "info",
              })}>
              <ArrowUpRight />
            </div>
          </div>
          <div className="mb-3 fw-600">
            Risk Level breakdown by Service Type
          </div>
          <Chart
            options={RiskLevelBreakdownByServiceTypeFormat.options}
            series={RiskLevelBreakdownByServiceTypeFormat.series}
            type="bar"
            height={380}
          />
        </div>
        <div className={`chart-card ${selectedCharts.includes("av-8") ? "selected-card" : ""
          }`}
          onClick={() => toggleChartSelection("av-8")}
          style={{ cursor: "pointer" }}>
          <div
            className="d-flex justify-content-lg-end justify-content-md-end align-items-center"
            
          >
            <input
              type="checkbox"
              className="chart-select-checkbox"
              onChange={() => toggleChartSelection("av-8")}
              checked={selectedCharts.includes("av-8")}
              disabled={!current?.user_name}
            />
            <div className="dashboard-icon ms-2" onClick={
              () => setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: "No Data available",
                severityType: "info",
              })}>
              <ArrowUpRight />
            </div>
          </div>
          <div className="mb-3 fw-600">Proportion of audit status</div>
          <Chart
            options={countOfAuditStatusFormated.options}
            series={countOfAuditStatusFormated.series}
            type="donut"
            height={380}
          />
        </div>
      </div>
      <DashboardDrawerGrid
        anchor={drawerAnchor}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={drawerData} //direct array
        title={drawerTitle}
        chartXaxisCategory={chartXaxisCategory}
      />
    </div>
  );
};

export default AuditAndVisitDashboard;
