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
import { decryptData } from "../../page/utils/encrypt";
import { generateDynamicSeries } from "../../../Utils/chartUtils";

const AuditAndVisitDashboard = ({
  selectedCompany,
  current,
  selectedCharts,
  setSelectedCharts,
  shouldShow,
}) => {
  const [AuditCountByServiceType, setAuditCountByServiceType] = React.useState(
    []
  );
  console.log(AuditCountByServiceType?.auditRecord, 'AuditCountByServiceType')
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
  const [isDetailPage, setIsDetailPage] = useState(false);
  const [isDetailPageData, setIsDetailPageData] = useState([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerAnchor, setDrawerAnchor] = React.useState("right");
  const [drawerTitle, setDrawerTitle] = useState("");
  const [drawerData, setDrawerData] = useState("");
  const [chartXaxisCategory, setChartXaxisCategory] = React.useState("");
  const [filterColumns, setFilterColumns] = useState([]);
  const handleOpenDrawer = (anchor, title, data = [], chartXaxisCategory, isDetailData, filterColumn) => {
    setDrawerAnchor(anchor);
    setDrawerTitle(title);
    setDrawerOpen(true);
    setDrawerData(data);
    setChartXaxisCategory(chartXaxisCategory);
    setFilterColumns(filterColumn);
    setIsDetailPageData(isDetailData);
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

  const [AuditPercentageMeetingSLA, setAuditPercentageMeetingSLA] =
    React.useState([]);

  const [
    checklistApprovalRateByCompanyName,
    setChecklistApprovalRateByCompanyName,
  ] = React.useState([]);

  const [riskLevel, setRiskLevel] = React.useState([]);
  const [countOfAuditStatus, setCountOfAuditStatus] = React.useState([]);
  const [riskLevelBreakdownByServiceType, setRiskLevelBreakdownByServiceType] =
    React.useState([]);

  const [escalationTriggeredRateByState, setEscalationTriggeredRateByState] =
    React.useState([]);

  const userRole = decryptData(localStorage.getItem("user_role"));
  const checklistApprovalRateByCompanyNameDynamiChart = generateDynamicSeries(
    checklistApprovalRateByCompanyName?.top_counts || [],
    {
      excludeKeys: ["company_name",],
    }
  );

  const escalationTriggeredRateByStateDynamiChart = generateDynamicSeries(
    escalationTriggeredRateByState?.top_counts || [],
    {
      excludeKeys: ["state",],
    }
  );
  // chart data formate
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

  const AuditPercentageMeetingSLAFormat = {
    series: [
      {
        name: "SLA Met (Y)",
        data: AuditPercentageMeetingSLA?.top_counts?.map((item) => item.count_y) || [],
      },
      {
        name: "SLA Met (N)",
        data: AuditPercentageMeetingSLA?.top_counts?.map((item) => item.count_n) || [],
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
          AuditPercentageMeetingSLA?.top_counts?.map((item) => item.responsible_team) || [],
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

  const checklistApprovalRateByCompanyNameFormat = {
    series: checklistApprovalRateByCompanyNameDynamiChart,
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true, // 👈 stacked enabled
      },

      colors: escalationTriggeredRateByStateDynamiChart.map(
        (_, index) => `hsl(${(index * 60) % 360}, 50%, 60%)`
      ),

      fill: {
        opacity: 1,
        colors: escalationTriggeredRateByStateDynamiChart.map(
          (_, index) => `hsl(${(index * 60) % 360}, 50%, 60%)`
        ),
      },

      states: {
        hover: {
          filter: { type: "none" },
        },
        active: {
          filter: { type: "none" },
        },
      },

      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
            columnWidth: '50%',
          },
        },
        fill: {
          opacity: 1,
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

  const riskLevelFormat = {
    series: riskLevel?.top_counts?.map((item) => item.count) || [],
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

      labels: riskLevel?.top_counts?.map((item) => item.risk_level) || [],
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

  const countOfAuditStatusFormated = {
    series: countOfAuditStatus?.top_counts?.map((item) => item.count) || [],
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

      labels: countOfAuditStatus?.count_status?.map((item) => item.audit_status) || [],
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

  const topCounts = riskLevelBreakdownByServiceType?.top_counts || [];

  // 1️⃣ Get all risk level keys dynamically (except service_type)
  const riskKeys =
    topCounts.length > 0
      ? Object.keys(topCounts[0]).filter(
        (key) => key !== "service_type"
      )
      : [];

  // 2️⃣ Build series dynamically
  const dynamicSeries = riskKeys.map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    data: topCounts.map((item) => item[key] ?? 0),
  }));

  const RiskLevelBreakdownByServiceTypeFormat = {
    series: dynamicSeries,
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        categories: topCounts.map((item) => item.service_type),
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
    },
  };


  const escalationTriggeredRateByStateFormat = {
    series: escalationTriggeredRateByStateDynamiChart,
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },
      colors: escalationTriggeredRateByStateDynamiChart.map(
        (_, index) => `hsl(${(index * 60) % 360}, 50%, 60%)`
      ),

      fill: {
        opacity: 1,
        colors: escalationTriggeredRateByStateDynamiChart.map(
          (_, index) => `hsl(${(index * 60) % 360}, 50%, 60%)`
        ),

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
  // Chart data fetch
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
        setAuditCountByServiceType(auditRes.reason?.status || []);
      }
      if (auditSlaRes.status === "fulfilled") {
        setAuditPercentageMeetingSLA(auditSlaRes.value);
      } else {
        setAuditPercentageMeetingSLA(auditSlaRes.reason?.status || []);
      }
      if (auditPlatformsCountByStateSegmentedRes.status === "fulfilled") {
        setAuditCountByStateSegmented(
          auditPlatformsCountByStateSegmentedRes.value
        );
      } else {
        setAuditCountByStateSegmented(
          auditPlatformsCountByStateSegmentedRes.reason?.status || []
        );
      }
      if (auditStatusByCompanyRes.status === "fulfilled") {
        setChecklistApprovalRateByCompanyName(auditStatusByCompanyRes.value);
      } else {
        setChecklistApprovalRateByCompanyName(
          auditStatusByCompanyRes.reason?.status || []
        );
      }
      if (riskLevelRes.status === "fulfilled") {
        setRiskLevel(riskLevelRes.value);
      } else {
        setRiskLevel(riskLevelRes.reason?.status || []);
      }
      if (auditStatusCountRes.status === "fulfilled") {
        setCountOfAuditStatus(auditStatusCountRes.value);
      } else {
        setCountOfAuditStatus(auditStatusCountRes.reason?.status || []);
      }
      if (escalationTriggeredRateByStateRes.status === "fulfilled") {
        setEscalationTriggeredRateByState(
          escalationTriggeredRateByStateRes.value
        );
      } else {
        setEscalationTriggeredRateByState(
          escalationTriggeredRateByStateRes.reason?.status || []
        );
      }
      if (riskLevelBreakdownByServiceTypeRes.status === "fulfilled") {
        setRiskLevelBreakdownByServiceType(
          riskLevelBreakdownByServiceTypeRes.value
        );
      } else {
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

  const canSelect = userRole === "Admin" || userRole === "Super-Admin";
  const cardClass = (id, defaultClass = "") =>
    canSelect && selectedCharts.includes(id) ? "selected-card" : defaultClass;

  const handleSelect = (id) => {
    if (canSelect) toggleChartSelection(id);
  };
  return (
    <div>
      <Snackbars
        issnackbarsOpen={issnackbarsOpen}
        setIsSnackbarsOpen={setIsSnackbarsOpen}
      />
      <div className="charts-grid mb-4">
        {shouldShow("av-1") && (
          <div
            className={`chart-card ${cardClass("av-1") ? "selected-card" : ""}`}
            onClick={canSelect ? () => handleSelect("av-1") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div className="d-flex justify-content-end align-items-center">
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("av-1")}
                checked={selectedCharts.includes("av-1")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation(); // prevent parent click from firing
                  handleOpenDrawer(
                    "right",
                    "Aaudit count by Service Type across all companies",
                    AuditCountByServiceType?.rest_counts,
                    AuditCountByServiceType?.rest_counts?.map(
                      (item) => item.service_type
                    ),
                    AuditCountByServiceType?.auditRecord,
                    AuditCountByServiceType?.columns
                  );
                }}
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
        )}

        {shouldShow("av-2") && (
          <div
            className={`chart-card ${cardClass("av-2") ? "selected-card" : ""}`}
            onClick={canSelect ? () => handleSelect("av-2") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div className="d-flex justify-content-end align-items-center">
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("av-2")}
                checked={selectedCharts.includes("av-2")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer(
                    "right",
                    "Audit count by State segmented by Audit Platform",
                    AuditCountByStateSegmented?.rest_count,
                    AuditCountByStateSegmented?.rest_count?.map(
                      (item) => item.state
                    ),
                    AuditCountByStateSegmented?.auditRecord,
                    AuditCountByStateSegmented?.columns

                  );
                }}
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
        )}
      </div>

      <div className="charts-grid mb-4">
        {shouldShow("av-3") && (
          <div
            className={`chart-card ${cardClass("av-3") ? "selected-card" : ""}`}
            onClick={canSelect ? () => handleSelect("av-3") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div className="d-flex justify-content-lg-end justify-content-md-end align-items-center">
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("av-3")}
                checked={selectedCharts.includes("av-3")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
               onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer(
                    "right",
                    "Percentage of audits meeting SLA by Responsible Team",
                    AuditPercentageMeetingSLA?.rest_counts,
                    AuditPercentageMeetingSLA?.rest_counts?.map(
                      (item) => item.company_name
                    ),
                    AuditPercentageMeetingSLA?.auditRecord,
                    AuditPercentageMeetingSLA?.columns

                  );
                }}
              >
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
        )}

        {shouldShow("av-4") && (
          <div
            className={`chart-card ${cardClass("av-4") ? "selected-card" : ""}`}
            onClick={canSelect ? () => handleSelect("av-4") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div className="d-flex justify-content-end align-items-center">
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("av-4")}
                checked={selectedCharts.includes("av-4")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer(
                    "right",
                    "Checklist approval rate by Company Name",
                    checklistApprovalRateByCompanyName?.rest_counts,
                    checklistApprovalRateByCompanyName?.rest_counts?.map(
                      (item) => item.company_name
                    ),
                    checklistApprovalRateByCompanyName?.auditRecord,
                    checklistApprovalRateByCompanyName?.columns

                  );
                }}
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
        )}
      </div>

      <div className="charts-grid mb-4">
        {shouldShow("av-5") && (
          <div
            className={`chart-card ${cardClass("av-5") ? "selected-card" : ""}`}
            onClick={canSelect ? () => handleSelect("av-5") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div className="d-flex justify-content-lg-end justify-content-md-end align-items-center">
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("av-5")}
                checked={selectedCharts.includes("av-5")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer(
                    "left",
                    "Risk level distribution",
                    riskLevel?.rest_counts,
                    riskLevel?.rest_counts?.map(
                      (item) => item.service_type
                    ),
                    riskLevel?.auditRecord,
                    riskLevel?.columns

                  );
                }}
              >
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
        )}
        {shouldShow("av-6") && (
          <div
            className={`chart-card ${cardClass("av-6") ? "selected-card" : ""}`}
            onClick={canSelect ? () => handleSelect("av-6") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div className="d-flex justify-content-end align-items-center">
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("av-6")}
                checked={selectedCharts.includes("av-6")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer(
                    "left",
                    "Escalation Triggered (Y/N) rate by State",
                    escalationTriggeredRateByState?.rest_counts,
                    escalationTriggeredRateByState?.rest_counts?.map(
                      (item) => item.state
                    ),
                    escalationTriggeredRateByState?.auditRecord,
                    escalationTriggeredRateByState?.columns

                  );
                }}
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
        )}
      </div>

      <div className="charts-grid mb-4">
        {shouldShow("av-7") && (
          <div
            className={`chart-card ${cardClass("av-7") ? "selected-card" : ""}`}
            onClick={canSelect ? () => handleSelect("av-7") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div className="d-flex justify-content-lg-end justify-content-md-end align-items-center">
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("av-7")}
                checked={selectedCharts.includes("av-7")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer(
                    "left",
                    "Risk Level breakdown by Service Type",
                    riskLevelBreakdownByServiceType?.rest_counts,
                    riskLevelBreakdownByServiceType?.rest_counts?.map(
                      (item) => item.audit_status
                    ),
                    riskLevelBreakdownByServiceType?.auditRecord,
                    riskLevelBreakdownByServiceType?.columns

                  );
                }}
              >
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
        )}
        {shouldShow("av-8") && (
          <div
            className={`chart-card ${cardClass("av-8") ? "selected-card" : ""}`}
            onClick={canSelect ? () => handleSelect("av-8") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div className="d-flex justify-content-lg-end justify-content-md-end align-items-center">
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("av-8")}
                checked={selectedCharts.includes("av-8")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer(
                    "right",
                    "Proportion of audit status",
                    countOfAuditStatus?.rest_counts,
                    countOfAuditStatus?.rest_counts?.map(
                      (item) => item.audit_status
                    ),
                    countOfAuditStatus?.auditRecord,
                    countOfAuditStatus?.columns

                  );
                }}
              >
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
        )}
      </div>
      <DashboardDrawerGrid
        anchor={drawerAnchor}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={drawerData} //direct array
        title={drawerTitle}
        chartXaxisCategory={chartXaxisCategory}
        isDetailPage={isDetailPage}
        setIsDetailPage={setIsDetailPage}
        isDetailPageData={isDetailPageData}
         filterColumns={filterColumns}
      />
    </div>
  );
};

export default AuditAndVisitDashboard;
