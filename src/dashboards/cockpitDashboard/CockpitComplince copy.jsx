// import React, { useState } from 'react';
import Chart from "react-apexcharts";
import "../../style/cockpitComplinceByCompany.css";
import { useCallback, useEffect, useRef, useState } from "react";
import ClientComplianceTable from "./ClientComplianceTable";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Settings2 } from "lucide-react";
import { AnimatedSearchBar } from "../../component/AnimatedSearchBar";
import Snackbars from "../../component/Snackbars";
import { decryptData } from "../../page/utils/encrypt";
import { Link, useNavigate } from "react-router-dom";
import { fetchComplainceCockpit } from "../../api/service";

const CockpitComplince = ({
  // data,
  selectedCharts,
  setSelectedCharts,
  current,
  shouldShow,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOption, setMenuOption] = useState("card");
  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    severityType: "",
  });
  const [data, setData] = useState([]);
  const gridRef = useRef();
  const navigate = useNavigate();
  const userRole = decryptData(localStorage.getItem("user_role"));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setMenuOption("table"); // force table on mobile
      }
    };
    // run on mount
    handleResize();
    // run on resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      "quickFilterText",
      document.getElementById("filter-text-box").value,
    );
  }, []);

  // if (!data || Object.keys(data).length === 0) {
  //   return (
  //     <div className="no-data">
  //       {data === 403 || data === 500 ? "No Data Found" : "Loading..."}
  //     </div>
  //   );
  // }

   useEffect(() => {
          const fetchCockpitData = async () => {
              const [ b] = await Promise.allSettled([
                  // fetchComplainceCockpitByCompany(selectedCompany),
                  fetchComplainceCockpit()
              ]);
  
              setData(b.status === "fulfilled" ? b.value : []);
          };
          fetchCockpitData();
      }, []);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

 

  // Overall Compliance Chart
  const overallChartOptions = {
    chart: {
      type: "radialBar",
      height: 350,
      events: {
        dataPointSelection(event, chartContext, opts) {

          const index = opts.dataPointIndex;
          if (index === undefined || index === -1) return;

          const clickedLabel = opts.w.globals.labels[index];
          const clickedValue = opts.w.globals.series[index];
          if (clickedValue === 0) return;
          navigate(
            "/compliance_cockpit/dashboard/overall_compliance_score",
            {
              state: {
                score: clickedValue,
                seriesName: clickedLabel,
                index: index,
              },
            }
          );
        },
      },


    },

    colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],

    title: {
      text: "Overall Compliance Score",
      align: "center",
    },

    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "16px",
          },
          value: {
            fontSize: "14px",
          },
          total: {
            show: true,
            label: "Overall Score",
            formatter: () => `${data?.overall_compliance_score}%`,
          },
        },
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ w }) {
        const labels = w.globals.labels;
        const series = w.globals.series;

        let html = `<div style="padding:10px">`;

        labels.forEach((label, index) => {
          const value = series[index];

          html += `
        <div
          style="
            display:flex;
            justify-content:space-between;
            cursor:pointer;
            padding:4px 0;
          "
          onclick="window.__apexTooltipClick(${index})"
        >
          <span>${label}</span>
          <b>${value}%</b>
        </div>
      `;
        });

        html += `</div>`;
        return html;
      },
    },


    labels: ["Licenses", "Returns", "Challans", "Registers", "Overall"],
  };

  const overallChartSeries = [
    data?.overall_license_compliance_score,
    data?.overall_return_compliance_score,
    data?.overall_challan_compliance_score,
    data?.overall_register_compliance_score,
    data?.overall_compliance_score,
  ];

  // Completion Status Chart
  const completionChartOptions = {
    chart: {
      type: "bar",
      height: 400,
      stacked: true,
      events: {
        click(event, chartContext, opts) {
          const seriesData = opts?.config?.series?.[opts?.seriesIndex]?.data?.[opts?.dataPointIndex];
          const seriesName = opts?.config?.series?.[opts?.seriesIndex]?.name;

          if (seriesData === undefined || seriesName === undefined) {
            return; // exit early if data or name is missing
          }
          navigate(
            "/compliance_cockpit/dashboard/completion_status_across_all_modules",
            {
              state: {
                score: seriesData,
                seriesName: seriesName,
              },
            },
          );
        },
      },
    },
    colors: ["#43A047", "#FB8C00", "#1E88E5"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: ["Licenses", "Returns", "Registers", "Challans"],
    },
    yaxis: {
      title: {
        text: "Count",
      },
    },
    legend: {
      position: "top",
    },
    title: {
      text: "Completion Status Across All Modules",
      align: "center",
    },
  };

  const completionChartSeries = [
    {
      name: "Completed",
      data: [
        data?.total_licenses_completed,
        data?.total_returns_completed,
        data?.total_registers_completed,
        data?.total_challans_completed,
      ],
    },
    {
      name: "Pending",
      data: [
        data.total_licenses_pending,
        data.total_returns_pending,
        data.total_registers_pending,
        0, // challans don't have pending
      ],
    },
    {
      name: "Total",
      data: [
        data?.total_licenses,
        data?.total_returns,
        data?.total_registers,
        data?.total_challans,
      ],
    },
  ];
  const handleChartNavigate = () => {
    if (!current?.user_name) {
      navigate("/compliance_cockpit/dashboard/overall_compliance_score", {
        state: {
          score: overallChartSeries,
          overallComplianceScore: data?.overall_compliance_score,
        },
      });
    }
    // alert("First you need to select a user");
  };
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
        : [...prev, chartId],
    );
  };
  const canSelect = userRole === "Admin" || userRole === "Super-Admin";

  const cardClass = (id, defaultClass = "") =>
    canSelect && selectedCharts.includes(id) ? "selected-card" : defaultClass;
  const handleSelect = (id) => {
    if (canSelect) toggleChartSelection(id);
  };

  return (
    <div className="">
      <Snackbars
        issnackbarsOpen={issnackbarsOpen}
        setIsSnackbarsOpen={setIsSnackbarsOpen}
      />
      {shouldShow("cc-1") && (
        <div
          className={`dashboard2-header ${cardClass("cc-1")}`}
          onClick={canSelect ? () => handleSelect("cc-1") : undefined}
          style={{ cursor: canSelect ? "pointer" : "default" }}
        >
          <div className="d-lg-flex d-md-flex gap-2 align-items-center">
            {canSelect && (
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => handleSelect("cc-1")}
                checked={selectedCharts.includes("cc-1")}
              />
            )}
            <h1>Multi-Client Compliance Analytics</h1>
          </div>

          <div className="header-stats">
            <div className="header-stat">
              <span className="stat-value">
                {data?.total_clients?.toLocaleString()}
              </span>
              <span className="stat-label-cock-pit-complince">
                Total Clients
              </span>
            </div>
            <div className="header-stat">
              <span className="stat-value">
                {data?.overall_compliance_score}%
              </span>
              <span className="stat-label-cock-pit-complince">
                Overall Score
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard2-grid">
        {/* Key Metrics */}
        <div className="metrics-section">
          <div className="metrics-grid">
            {/* CC-2 - Licenses */}
            {shouldShow("cc-2") && (
              <div
                className={`metric-card ${cardClass("cc-2", "license")}`}
                onClick={canSelect ? () => handleSelect("cc-2") : undefined}
                style={{ cursor: canSelect ? "pointer" : "default" }}
              >
                <div className="d-lg-flex d-md-flex justify-content-between">
                  <div className="metric-icon">📋</div>

                  {canSelect && (
                    <input
                      type="checkbox"
                      className="chart-select-checkbox"
                      onChange={() => handleSelect("cc-2")}
                      checked={selectedCharts.includes("cc-2")}
                    />
                  )}
                </div>

                <div className="metric-content">
                  <h3>Licenses</h3>
                  <div className="metric-value">{data?.total_licenses}</div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(data?.total_licenses_completed /
                            data?.total_licenses) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {data?.total_licenses_completed} / {data?.total_licenses}{" "}
                      completed
                    </span>
                  </div>
                  <div className="compliance-score">
                    {data.overall_license_compliance_score}% compliance
                  </div>
                </div>
              </div>
            )}

            {/* CC-3 - Returns */}
            {shouldShow("cc-3") && (
              <div
                className={`metric-card ${cardClass("cc-3", "returns")}`}
                onClick={canSelect ? () => handleSelect("cc-3") : undefined}
                style={{ cursor: canSelect ? "pointer" : "default" }}
              >
                <div className="d-lg-flex d-md-flex justify-content-between">
                  <div className="metric-icon">📊</div>

                  {canSelect && (
                    <input
                      type="checkbox"
                      className="chart-select-checkbox"
                      onChange={() => handleSelect("cc-3")}
                      checked={selectedCharts.includes("cc-3")}
                    />
                  )}
                </div>

                <div className="metric-content">
                  <h3>Returns</h3>
                  <div className="metric-value">{data.total_returns}</div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(data.total_returns_completed /
                            data.total_returns) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {data.total_returns_completed} / {data.total_returns}{" "}
                      completed
                    </span>
                  </div>
                  <div className="compliance-score">
                    {data.overall_return_compliance_score}% compliance
                  </div>
                </div>
              </div>
            )}

            {/* CC-4 - Registers */}
            {shouldShow("cc-4") && (
              <div
                className={`metric-card ${cardClass("cc-4", "registers")}`}
                onClick={canSelect ? () => handleSelect("cc-4") : undefined}
                style={{ cursor: canSelect ? "pointer" : "default" }}
              >
                <div className="d-lg-flex d-md-flex justify-content-between">
                  <div className="metric-icon">📚</div>

                  {canSelect && (
                    <input
                      type="checkbox"
                      className="chart-select-checkbox"
                      onChange={() => handleSelect("cc-4")}
                      checked={selectedCharts.includes("cc-4")}
                    />
                  )}
                </div>

                <div className="metric-content">
                  <h3>Registers</h3>
                  <div className="metric-value">{data.total_registers}</div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(data.total_registers_completed /
                            data.total_registers) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {data.total_registers_completed} / {data.total_registers}{" "}
                      completed
                    </span>
                  </div>
                  <div className="compliance-score">
                    {data.overall_register_compliance_score}% compliance
                  </div>
                </div>
              </div>
            )}

            {/* CC-5 - Challans */}
            {shouldShow("cc-5") && (
              <div
                className={`metric-card ${cardClass("cc-5", "challans")}`}
                onClick={canSelect ? () => handleSelect("cc-5") : undefined}
                style={{ cursor: canSelect ? "pointer" : "default" }}
              >
                <div className="d-lg-flex d-md-flex justify-content-between">
                  <div className="metric-icon">💰</div>

                  {canSelect && (
                    <input
                      type="checkbox"
                      className="chart-select-checkbox"
                      onChange={() => handleSelect("cc-5")}
                      checked={selectedCharts.includes("cc-5")}
                    />
                  )}
                </div>

                <div className="metric-content">
                  <h3>Challans</h3>
                  <div className="metric-value">{data.total_challans}</div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(data.total_challans_completed /
                            data.total_challans) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {data.total_challans_completed} / {data.total_challans}{" "}
                      completed
                    </span>
                  </div>
                  <div className="compliance-score">
                    {data.overall_challan_compliance_score}% compliance
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* CC-6 */}
          {shouldShow("cc-6") && (
            <div
              className={`chart-card ${cardClass("cc-6")}`}
              onClick={canSelect ? () => handleSelect("cc-6") : undefined}
              style={{ cursor: canSelect ? "pointer" : "default" }}
            >
              {canSelect && (
                <input
                  type="checkbox"
                  className="chart-select-checkbox"
                  onChange={() => handleSelect("cc-6")}
                  checked={selectedCharts.includes("cc-6")}
                />
              )}
              <Chart
                options={overallChartOptions}
                series={overallChartSeries}
                type="radialBar"
                height={350}
              />
            </div>
          )}
          {/* CC-7 */}
          {shouldShow("cc-7") && (
            <div
              className={`chart-card ${cardClass("cc-7")}`}
              onClick={canSelect ? () => handleSelect("cc-7") : undefined}
              style={{ cursor: canSelect ? "pointer" : "default" }}
            >
              {canSelect && (
                <input
                  type="checkbox"
                  className="chart-select-checkbox"
                  onChange={() => handleSelect("cc-7")}
                  checked={selectedCharts.includes("cc-7")}
                />
              )}
              <Chart
                options={completionChartOptions}
                series={completionChartSeries}
                type="bar"
                height={400}
              />
            </div>
          )}
        </div>

        {/* CC-8 - Performers Section */}
        {/* -------------------- CC-8 CLIENT PERFORMANCE OVERVIEW -------------------- */}
        {shouldShow("cc-8") && (
          <div
            className={`performers-section ${cardClass("cc-8")}`}
            onClick={canSelect ? () => handleSelect("cc-8") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <div className="d-lg-flex  d-md-flex justify-content-between align-items-center mb-3">
              <h2>Client Performance Overview</h2>

              {canSelect && (
                <input
                  type="checkbox"
                  className="chart-select-checkbox"
                  onChange={() => handleSelect("cc-8")}
                  checked={selectedCharts.includes("cc-8")}
                />
              )}

              <div className="d-lg-flex d-md-flex  justify-content-between">
                {menuOption === "table" && (
                  <AnimatedSearchBar
                    placeholder="Search..."
                    type="text"
                    id="filter-text-box"
                    onInput={onFilterTextBoxChanged}
                  />
                )}

                {/* SETTINGS MENU UNCHANGED */}
                <div className="client-performance-table-sm">
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      sx={{ ml: 0 }}
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                    >
                      <Settings2 />
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        setMenuOption("table");
                      }}
                    >
                      Table View
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        setMenuOption("card");
                      }}
                    >
                      Card View
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>

            {/* TABLE VIEW */}
            {menuOption === "table" ? (
              <div className="client-performance-table">
                <ClientComplianceTable data={data} gridRef={gridRef} />
              </div>
            ) : (
              /* CARD VIEW */
              ''
            )}

            {/* PAGINATION */}
            {menuOption === "card" && (
              <div className="justify-content-end d-flex gap-2 mt-3 client-performance-table-sm">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  style={{
                    background: currentPage === 1 ? "gray" : "black",
                    color: "white",
                    borderRadius: "5px",
                  }}
                >
                  Prev
                </button>

                <button
                  // disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  style={{
                    background: "black",
                    color: "white",
                    borderRadius: "5px",
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
        {/* CC-9 Analytics Summary */}
        {shouldShow("cc-9") && (
          <div
            className={`analytics-section ${cardClass("cc-9")}`}
            onClick={canSelect ? () => handleSelect("cc-9") : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
          >
            <h2>Analytics Summary</h2>

            {canSelect && (
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => handleSelect("cc-9")}
                checked={selectedCharts.includes("cc-9")}
              />
            )}

            <div className="analytics-grid">
              {/* CC-10 */}
              <div
                className={`analytics-item ${cardClass("cc-10")}`}
                onClick={canSelect ? () => handleSelect("") : undefined}
                style={{ cursor: canSelect ? "pointer" : "default" }}
              >
                <div className="analytics-icon">🎯</div>
                <div className="analytics-content">
                  <h4>Average Completion Rate</h4>

                  {canSelect && (
                    <input
                      type="checkbox"
                      className="chart-select-checkbox"
                      onChange={() => handleSelect("")}
                      checked={selectedCharts.includes("")}
                    />
                  )}

                  <div className="analytics-value">
                    {(
                      ((data.total_licenses_completed +
                        data.total_returns_completed +
                        data.total_challans_completed) /
                        (data.total_licenses +
                          data.total_returns +
                          data.total_challans)) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                </div>
              </div>

              {/* CC-11 */}
              <div
                className={`analytics-item ${cardClass("cc-11")}`}
                onClick={canSelect ? () => handleSelect("") : undefined}
                style={{ cursor: canSelect ? "pointer" : "default" }}
              >
                <div className="analytics-icon">⚠️</div>
                <div className="analytics-content">
                  <h4>Total Pending</h4>

                  {canSelect && (
                    <input
                      type="checkbox"
                      className="chart-select-checkbox"
                      onChange={() => handleSelect("")}
                      checked={selectedCharts.includes("")}
                    />
                  )}

                  <div className="analytics-value">
                    {data.total_licenses_pending +
                      data.total_returns_pending +
                      data.total_registers_pending}
                  </div>
                </div>
              </div>

              {/* CC-12 */}
              <div
                className={`analytics-item ${cardClass("cc-12")}`}
                onClick={canSelect ? () => handleSelect("") : undefined}
                style={{ cursor: canSelect ? "pointer" : "default" }}
              >
                <div className="analytics-icon">📈</div>
                <div className="analytics-content">
                  <h4>Challan Compliance Score</h4>

                  {canSelect && (
                    <input
                      type="checkbox"
                      className="chart-select-checkbox"
                      onChange={() => handleSelect("")}
                      checked={selectedCharts.includes("")}
                    />
                  )}

                  <div className="analytics-value">
                    Challans ({data.overall_challan_compliance_score}%)
                  </div>
                </div>
              </div>

              {/* CC-13 */}
              <div
                className={`analytics-item ${cardClass("cc-13")}`}
                onClick={canSelect ? () => handleSelect("") : undefined}
                style={{ cursor: canSelect ? "pointer" : "default" }}
              >
                <div className="analytics-icon">🔍</div>
                <div className="analytics-content">
                  <h4>Register Compliance Score</h4>

                  {canSelect && (
                    <input
                      type="checkbox"
                      className="chart-select-checkbox"
                      onChange={() => handleSelect("")}
                      checked={selectedCharts.includes("")}
                    />
                  )}

                  <div className="analytics-value">
                    Registers ({data.overall_register_compliance_score}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CockpitComplince;
