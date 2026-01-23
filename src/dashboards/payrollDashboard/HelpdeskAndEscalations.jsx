import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import {
  fetchHelpDeskPendingForSelectedIssueSubtypes,
  fetchHelpdeskStatusBasedOnIssueSubType,
  fetchHelpdeskTicketsRaisedByCompany,
  fetchTicketsDistributionAssignedToCount,
  fetchTotalCountOfCommunicationTypes,
  fetchTotalDelayFlagsByClient,
  fetchTotalDelayFlagsByGovt,
} from "../../api/service";
import DashboardDrawerGrid from "../DashboardDrawer";
import { ArrowUpRight, X } from "lucide-react";
import Snackbars from "../../component/Snackbars";
import { decryptData } from "../../page/utils/encrypt";

ModuleRegistry.registerModules([AllCommunityModule]);
const HelpdeskAndEscalations = ({ selectedCompany, current,
  selectedCharts,
  setSelectedCharts,
  shouldShow,
}) => {
  const [closedVsOpenCases, setCloseVsOpenCases] = React.useState([]);
  const closeVsOpenIssueFormat = {
    series: [
      {
        name: "Open Cases",
        data: closedVsOpenCases?.top_issue_sub_type_status?.map(
          (item) => item.count_Open
        ),
      },
      {
        name: "Closed Cases",
        data: closedVsOpenCases?.top_issue_sub_type_status?.map(
          (item) => item.count_Closed
        ),
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },
      colors: ["#f45b5b", "#38b68c",],
      fill: {
        opacity: 1,
        colors: ["#f45b5b", "#38b68c"],
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
          closedVsOpenCases?.top_issue_sub_type_status?.map(
            (item) => item.issue_sub_type || []
          ) || [],
        labels: {
          formatter: function (val) {
            return val + "K";
          },
        },
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "K";
          },
        },
      },

      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    },
  };

  const [ProportionOfCases, setProportionofcases] = React.useState([]);
  const ProportionOfCasesFormat = {
    series: [
      {
        name: "Count",
        data:
          ProportionOfCases?.top_count?.map(
            (item) => item.count_issue_types ?? 0
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
        active: {
          filter: {
            type: "none", // 👈 disables click highlight effect
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
      title: {
        text: "Proportion of Cases Pending",
      },
      xaxis: {
        categories:
          ProportionOfCases?.top_count?.map((item) => item.pending_from ?? 0) ||
          [],
        // labels: {
        //   formatter: function (val) {
        //     return val + "K";
        //   },
        // },
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      // tooltip: {
      //   y: {
      //     formatter: function (val) {
      //       return val + "K";
      //     },
      //   },
      // },

      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    },
  };
  const [clientDelayFlags, setClientDelayFlags] = React.useState([]);
  const clientDelayFlagsFormat = {
    series: clientDelayFlags?.client_delay?.map((item) => item.count) || [],
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

      labels:
        clientDelayFlags?.client_delay?.map((item) => item.delay_type) || [],
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
  const [governmentDelayFlags, setGovernmentDelayFlags] = React.useState([]);
  const governmentDelayFlagsFormat = {
    series: governmentDelayFlags?.govt_delay?.map((item) => item.count) || [],
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

      labels:
        governmentDelayFlags?.govt_delay?.map((item) => item.delay_type) || [],
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
  const [ticketDistribution, setTicketDistribution] = React.useState([]);
  const ticketDistributionFormat = {
    series: [
      {
        name: "Excluding Doc Pending %",
        data:
          ticketDistribution?.top_assigned_to_counts?.map(
            (item) => item.count || []
          ) || [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: false,
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
      title: {
        text: "Escalation Counts",
      },
      xaxis: {
        categories:
          ticketDistribution?.top_assigned_to_counts?.map(
            (item) => item.assigned_to || []
          ) || [],
        // labels: {
        //     formatter: function (val) {
        //         return val + "K"
        //     }
        // }
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      // // tooltip: {
      //     y: {
      //         formatter: function (val) {
      //             return val + "K"
      //         }
      //     }
      // },

      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    },
  };
  const [communicationType, setCommunicationType] = React.useState([]);
  const communicationTypeFormat = {
    series: [
      {
        name: "Number of Tickets",
        data: communicationType?.map((item) => item.count || []) || [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: false,
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
      title: {
        text: "Number of Tickets",
      },
      xaxis: {
        categories:
          communicationType?.map((item) => item.communication_type || []) || [],
        // labels: {
        //     formatter: function (val) {
        //         return val + "K"
        //     }
        // }
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      tooltip: {
        // y: {
        //     formatter: function (val) {
        //         return val + "K"
        //     }
        // }
      },

      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    },
  };
  const [helpdeskTicketsRaisedByCompany, setHelpdeskTicketsRaisedByCompany] =
    React.useState([]);
  const helpdeskTicketsRaisedByCompanyFormat = {
    series:
      helpdeskTicketsRaisedByCompany?.top_company_tickets_count?.map(
        (item) => item.count || []
      ) || [],
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

      tooltip: {
        theme: "light", // makes all tooltip text black
        style: {
          fontSize: "12px",
          color: "#000",
        },
      },

      // ⭐ Label (value & name) text color black
      dataLabels: {
        enabled: true,
        style: {
          // colors: ['#000'], // text black
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: false,
              name: {
                color: "#000",
              },
              value: {
                color: "#000",
              },
              total: {
                color: "#000",
              },
            },
          },
        },
      },
      states: {
        hover: {
          filter: { type: "none" },
        },
        active: {
          filter: { type: "none" },
        },
      },

      labels:
        helpdeskTicketsRaisedByCompany?.top_company_tickets_count?.map(
          (item) => item.company_name || []
        ) || [],
      legend: {
        position: "top",
        horizontalAlign: "center",
        fontSize: "14px",
        markers: { radius: 12 },
        labels: { colors: "#333" },
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 250 },
            legend: { position: "bottom" },
          },
        },
      ],
    },
  };
  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    severityType: "",
  });
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

  const userRole = decryptData(localStorage.getItem("user_role"));

  useEffect(() => {
    const fetchData = async () => {
      const [
        communicationTypeRes,
        helpdeskTicketsRes,
        helpdeskStatusRes,
        ticketsDistributionRes,
        helpdeskPendingRes,
        totalDelayFlags,
        totalDelayFlagsByGovt,
      ] = await Promise.allSettled([
        fetchTotalCountOfCommunicationTypes(selectedCompany),
        fetchHelpdeskTicketsRaisedByCompany(selectedCompany),
        fetchHelpdeskStatusBasedOnIssueSubType(selectedCompany),
        fetchTicketsDistributionAssignedToCount(selectedCompany),
        fetchHelpDeskPendingForSelectedIssueSubtypes(selectedCompany),
        fetchTotalDelayFlagsByClient(selectedCompany),
        fetchTotalDelayFlagsByGovt(selectedCompany),
      ]);
      if (communicationTypeRes.status === "fulfilled") {
        setCommunicationType(communicationTypeRes.value);
      } else {
        console.warn(
          "fetchAll communication type failed:",
          communicationTypeRes.reason
        );
        setCommunicationType(communicationTypeRes.reason?.status || []);
      }
      if (helpdeskTicketsRes.status === "fulfilled") {
        setHelpdeskTicketsRaisedByCompany(helpdeskTicketsRes.value);
      } else {
        console.warn(
          "fetchAll helpdesk tickets failed:",
          helpdeskTicketsRes.reason
        );
        setHelpdeskTicketsRaisedByCompany(
          helpdeskTicketsRes.reason?.status || []
        );
      }
      if (helpdeskStatusRes.status === "fulfilled") {
        setCloseVsOpenCases(helpdeskStatusRes.value);
      } else {
        console.warn(
          "fetchAll helpdesk status failed:",
          helpdeskStatusRes.reason
        );
        setCloseVsOpenCases(helpdeskStatusRes.reason?.status || []);
      }
      if (ticketsDistributionRes.status === "fulfilled") {
        setTicketDistribution(ticketsDistributionRes.value);
      } else {
        console.warn(
          "fetchAll tickets distribution failed:",
          ticketsDistributionRes.reason
        );
        setTicketDistribution(ticketsDistributionRes.reason?.status || []);
      }
      if (helpdeskPendingRes.status === "fulfilled") {
        setProportionofcases(helpdeskPendingRes.value);
      } else {
        console.warn(
          "fetchAll helpdesk pending failed:",
          helpdeskPendingRes.reason
        );
        setProportionofcases(helpdeskPendingRes.reason?.status || []);
      }
      if (totalDelayFlags.status === "fulfilled") {
        setClientDelayFlags(totalDelayFlags.value);
      } else {
        console.warn("fetchAll delay flags failed:", totalDelayFlags.reason);
        setClientDelayFlags(totalDelayFlags.reason?.status || []);
      }
      if (totalDelayFlagsByGovt.status === "fulfilled") {
        setGovernmentDelayFlags(totalDelayFlagsByGovt.value);
      } else {
        console.warn(
          "fetchAll delay flags failed:",
          totalDelayFlagsByGovt.reason
        );
        setGovernmentDelayFlags(totalDelayFlagsByGovt.reason?.status || []);
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

  const canSelect = userRole === 'Admin' || userRole === 'Super-Admin';

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
        {shouldShow("he-1") && (
          <div
            className={`chart-card ${cardClass("he-1") ? "selected-card" : ""
              }`}
            onClick={canSelect ? () => handleSelect("he-1") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div
              className="d-flex justify-content-end align-items-center"

            >
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("he-1")}
                checked={selectedCharts.includes("he-1")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();   // prevent parent click from firing
                  handleOpenDrawer(
                    "right",
                    "Proportion of cases pending from department vs. pending from client for selected Issue Sub-Types in PF_ESIC_Helpdesk",
                    ProportionOfCases?.rest_count,
                    ProportionOfCases?.rest_count?.map(
                      (item) => item.pending_from
                    )
                  )
                }

                }
              >
                <ArrowUpRight />
              </div>
            </div>
            <div className="mb-3 fw-600">
              Top 5 Proportion of cases pending from department vs. pending from
              client for selected Issue Sub-Types in PF_ESIC_Helpdesk
            </div>
            <Chart
              options={ProportionOfCasesFormat.options}
              series={ProportionOfCasesFormat.series}
              type="bar"
              height={380}
            />
          </div>
        )}
        {shouldShow("he-2") && (
          <div
            className={`chart-card ${cardClass("he-2") ? "selected-card" : ""
              }`}
            onClick={canSelect ? () => handleSelect("he-2") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div
              className="d-flex justify-content-end align-items-center"

            >
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("he-2")}
                checked={selectedCharts.includes("he-2")}
                disabled={!current?.user_name}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();   // prevent parent click from firing
                  handleOpenDrawer(
                    "left",
                    "Comparison of closed vs. open cases for top 5 Issue Sub-Types in PF_ESIC_Helpdesk",
                    closedVsOpenCases?.rest_issue_sub_type_status,
                    closedVsOpenCases?.rest_issue_sub_type_status?.map(
                      (item) => item.issue_sub_type
                    )
                  )
                }

                }
              >
                <ArrowUpRight />
              </div>
            </div>
            <div className="mb-3 fw-600">
              Top 5 Comparison of closed vs. open cases for top 5 Issue Sub-Types
              in PF_ESIC_Helpdesk
            </div>
            <Chart
              options={closeVsOpenIssueFormat.options}
              series={closeVsOpenIssueFormat.series}
              type="bar"
              height={380}
            />
          </div>
        )}
      </div>

      <div className="charts-grid mb-4">
        {shouldShow("he-3") && (
          <div className={`chart-card ${cardClass("he-3") ? "selected-card" : ""
            }`}
            onClick={canSelect ? () => handleSelect("he-3") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}>
            <div
              className="d-flex justify-content-lg-end justify-content-md-end align-items-center"

            >
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("he-3")}
                checked={selectedCharts.includes("he-3")}
                disabled={!current?.user_name}
              />
              <div className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();   // prevent parent click from firing
                  setIsSnackbarsOpen({
                    ...issnackbarsOpen,
                    open: true,
                    message: "No Data available",
                    severityType: "info",
                  });
                }}
              >
                <ArrowUpRight />
              </div>
            </div>
            <div className="mb-3 fw-600">
              Analysis of client delay flags tickets in PF_ESIC_Helpdesk
            </div>
            <Chart
              options={clientDelayFlagsFormat.options}
              series={clientDelayFlagsFormat.series}
              type="donut"
              height={380}
            />
          </div>
        )}
      </div>

      <div className="charts-grid mb-4">
        {shouldShow("he-4") && (
          <div className={`chart-card ${cardClass("he-4") ? "selected-card" : ""
            }`}
            onClick={canSelect ? () => handleSelect("he-4") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}>
            <div
              className="d-flex justify-content-lg-end justify-content-md-end align-items-center"

            >
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("he-4")}
                checked={selectedCharts.includes("he-4")}
                disabled={!current?.user_name}
              />
              <div className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();   // prevent parent click from firing
                  setIsSnackbarsOpen({
                    ...issnackbarsOpen,
                    open: true,
                    message: "No Data available",
                    severityType: "info",
                  });
                }}
              >
                <ArrowUpRight />
              </div>
            </div>
            <div className="mb-3 fw-600">
              Number of tickets by Communication Type in PF_ESIC_Helpdesk
            </div>
            <Chart
              options={communicationTypeFormat.options}
              series={communicationTypeFormat.series}
              type="bar"
              height={380}
            />
          </div>
        )}
        {shouldShow("he-5") && (
          <div
            className={`chart-card ${cardClass("he-5") ? "selected-card" : ""
              }`}
            onClick={canSelect ? () => handleSelect("he-5") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div
              className="d-flex justify-content-end align-items-center"

            >
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("he-5")}
                checked={selectedCharts.includes("he-5")}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer(
                    "left",
                    "Companies by total helpdesk tickets raised in PF_ESIC_Helpdesk",
                    ticketDistribution?.rest_assigned_to_counts,
                    ticketDistribution?.rest_assigned_to_counts?.map(
                      (item) => item.assigned_to
                    )
                  )
                }}
              >
                <ArrowUpRight />
              </div>
            </div>
            <div className="mb-3 fw-600">
              Ticket distribution by Assigned To for top 5 users in
              PF_ESIC_Helpdesk
            </div>
            <Chart
              options={ticketDistributionFormat.options}
              series={ticketDistributionFormat.series}
              type="bar"
              height={380}
            />
          </div>
        )}
      </div>

      <div className="charts-grid mb-4">
        {shouldShow("he-6") && (
          <div className={`chart-card ${cardClass("he-6") ? "selected-card" : ""
            }`}
            onClick={canSelect ? () => handleSelect("he-6") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}>
            <div
              className="d-flex justify-content-lg-end justify-content-md-end align-items-center"

            >
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("he-6")}
                checked={selectedCharts.includes("he-6")}
                disabled={!current?.user_name}
              />
              <div className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();   // prevent parent click from firing
                  setIsSnackbarsOpen({
                    ...issnackbarsOpen,
                    open: true,
                    message: "No Data available",
                    severityType: "info",
                  });
                }}
              >
                <ArrowUpRight />
              </div>
            </div>
            <div className="mb-3 fw-600">
              Government delay flags tickets in PF_ESIC_Helpdesk
            </div>
            <Chart
              options={governmentDelayFlagsFormat.options}
              series={governmentDelayFlagsFormat.series}
              type="donut"
              height={380}
            />
          </div>
        )}
        {shouldShow("he-7") && (
          <div
            className={`chart-card ${cardClass("he-7") ? "selected-card" : ""
              }`}
            onClick={canSelect ? () => handleSelect("he-7") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div
              className="d-flex justify-content-end align-items-center"

            >
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("he-7")}
                checked={selectedCharts.includes("he-7")}
              />
              <div
                className="dashboard-icon ms-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer(
                    "left",
                    "Companies by total helpdesk tickets raised in PF_ESIC_Helpdesk",
                    helpdeskTicketsRaisedByCompany?.rest_company_tickets_count,
                    helpdeskTicketsRaisedByCompany?.rest_company_tickets_count?.map(
                      (item) => item.company_name
                    )
                  )
                }}
              >
                <ArrowUpRight />
              </div>
            </div>
            <div className="mb-3 fw-600">
              Top 5 companies by total helpdesk tickets raised in PF_ESIC_Helpdesk
            </div>
            <Chart
              options={helpdeskTicketsRaisedByCompanyFormat.options}
              series={helpdeskTicketsRaisedByCompanyFormat.series}
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
      />
    </div>
  );
};

export default HelpdeskAndEscalations;
