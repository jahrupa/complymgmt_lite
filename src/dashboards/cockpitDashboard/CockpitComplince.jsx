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
import { useNavigate } from "react-router-dom";
import DashboardDrawerGrid from "../DashboardDrawer";
import { fetchChallanCompliance, fetchClientCompliance, fetchClientData, fetchLicenseComplaince, fetchPaginatedRecords, fetchRegistersCompliance, fetchReturnCompliance } from "../../api/service";

const CockpitComplince = ({
  // data,
  selectedCharts,
  setSelectedCharts,
  current,
  shouldShow,
  setPage,
  setLimit,
  selectedCompany,
  page,
  limit
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnchor, setDrawerAnchor] = useState("right");
  const [isDetailPageDataFor, setIsDetailPageDataFor] = useState("Returns");
  const [isDetailPage, setIsDetailPage] = useState(false);
  const [filterColumns, setFilterColumns] = useState([]);
   const [data, setData] = useState({
         licenseComplaince: [],
         registersCompliance: [],
         challanCompliance: [],
         returnCompliance: [],
         paginatedRecords: [],
         clientData: [],
         clientCompliance: [],
     });
  const gridRef = useRef();
  const navigate = useNavigate();
  const userRole = decryptData(localStorage.getItem("user_role"));
  const itemsPerPage = 10; // number of cards per page

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
     useEffect(() => {
      const fetchCockpitData = async () => {
          const results = await Promise.allSettled([
              fetchLicenseComplaince(),
              fetchRegistersCompliance(),
              fetchChallanCompliance(),
              fetchReturnCompliance(),
              fetchPaginatedRecords(page,limit),
              fetchClientData(),
              fetchClientCompliance(),
          ]);
  
          const keys = [
              "licenseComplaince",
              "registersCompliance",
              "challanCompliance",
              "returnCompliance",
              "paginatedRecords",
              "clientData",
              "clientCompliance",
          ];
  
          const updatedData = {};
  
          results.forEach((res, index) => {
              updatedData[keys[index]] =
                  res.status === "fulfilled" ? res.value : [];
          });
  
          setData(updatedData);
      };
  
      fetchCockpitData();
  }, [selectedCompany]);

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="no-data">
        {!data || Object.keys(data).length === 0 ? "No Data Found" : "Loading..."}
      </div>
    );
  }
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
  const handleOpenDrawer = (anchor, filterColumn) => {
    setDrawerAnchor(anchor);
    setDrawerOpen(true);
    setFilterColumns(filterColumn);
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
                1234567 missing
                {/* {data?.total_clients?.toLocaleString()} */}
              </span>
              <span className="stat-label-cock-pit-complince">
                Total Clients
              </span>
            </div>
            <div className="header-stat">
              <span className="stat-value">
                {/* {data?.overall_compliance_score}% */}
                8666665%
              </span>
              <span className="stat-label-cock-pit-complince">
                Overall Score
              </span>
            </div>
            <div className="align-content-center">
              <button
                className="btn btn-primary "
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer("left");
                }}
              >
                View Details
              </button>
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
                  <div className="metric-value">{data?.licenseComplaince?.total_license}</div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(data?.licenseComplaince?.active_license  /
                              data?.licenseComplaince?.total_license) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {data?.licenseComplaince?.active_license } / {data?.licenseComplaince?.total_license}{" "}
                      completed 
                    </span>
                  </div>
                  <div className="compliance-score">
                    {data?.licenseComplaince?.overall_license_compliance_score}% compliance
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
                  <div className="metric-value">
                    {data?.returnCompliance?.applicable_returns} total 
                    </div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(data?.returnCompliance?.completed_returns /
                              data?.returnCompliance?.applicable_returns) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {data?.returnCompliance?.completed_returns} / {data?.returnCompliance?.applicable_returns}{" "}
                      completed
                    </span>
                  </div>
                  <div className="compliance-score">
                    {data?.returnCompliance?.compliance_score}% compliance
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
                  <div className="metric-value">
                    {data?.registersCompliance?.applicable_registers}
                  </div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                         style={{
                          width: `${(data?.registersCompliance?.completed_registers /
                             data?.registersCompliance?.applicable_registers) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {data?.registersCompliance?.completed_registers} / {data?.registersCompliance?.applicable_registers}{" "}
                      completed
                    </span>
                  </div>
                  <div className="compliance-score">
                    {data?.registersCompliance?.compliance_score}%
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
                  <div className="metric-value">
                    {data?.challanCompliance?.total_challans}
                  </div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(data?.challanCompliance?.completed_challans /
                              data.challanCompliance?.total_challans) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {data?.challanCompliance?.completed_challans} / {data.challanCompliance?.total_challans}{" "}
                       completed
                    </span>
                  </div>
                  <div className="compliance-score">
                    {data?.challanCompliance?.compliance_score}% compliance
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
              {/* <Chart
                options={overallChartOptions}
                series={overallChartSeries}
                type="radialBar"
                height={350}
              /> */}
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
              {/* <Chart
                options={completionChartOptions}
                series={completionChartSeries}
                type="bar"
                height={400}
              /> */}
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
              <div className="performers-grid client-performance-table-sm">
                clent card after implementation remove
                {/* {currentClients.map((client, index) => {
                  const score = client.average_compliance_score || 0;

                  const getClassName = (score) => {
                    if (score > 300) return "excellent";
                    if (score > 100 && score < 300) return "high-performer";
                    if (score > 80 && score <= 100) return "compliant";
                    if (score >= 50 && score <= 80) return "good";
                    if (score > 0 && score < 50) return "moderate";
                    if (score === 0) return "needs-attention";
                    return "";
                  };

                  return (
                    <div
                      key={index}
                      className={`performer-card ${getClassName(score)}`}
                    >
                      <div className="performer-header">
                        <h4>{client.name}</h4>
                        <span
                          className={`performance-badge ${getClassName(score)}`}
                        >
                          Compliance Score
                        </span>
                      </div>

                      <div className="performer-score">
                        <span className="score-value">{score}%</span>
                        <div className="score-bar">
                          <div
                            className="score-fill"
                            style={{ width: `${Math.min(score, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })} */}
              </div>
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
                    {/* {(
                      ((data.total_licenses_completed +
                        data.total_returns_completed +
                        data.total_challans_completed) /
                        (data.total_licenses +
                          data.total_returns +
                          data.total_challans)) *
                      100
                    ).toFixed(1)} */}
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
                    {/* {data.total_licenses_pending +
                      data.total_returns_pending +
                      data.total_registers_pending} */}
                    1234567
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
                    {/* Challans ({data.overall_challan_compliance_score}%) */}
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
                    {/* Registers ({data.overall_register_compliance_score}%) */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <DashboardDrawerGrid
        anchor={drawerAnchor}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setIsDetailPageDataFor("Returns");
        }}
        // this is wirking
        data={
          isDetailPageDataFor === "Challans"
            ? data?.paginatedRecords?.challan?.records
            : isDetailPageDataFor === "Licenses"
              ? data?.paginatedRecords?.license?.records
              : isDetailPageDataFor === "Registers"
                ? data?.paginatedRecords?.register?.records
                : data?.paginatedRecords?.return?.records
        } //direct array
        title={"Compliance Details - " + isDetailPageDataFor}
        isDetailPage={isDetailPage}
        setIsDetailPage={setIsDetailPage}
        // this was pass for view detail page
        isDetailPageData={
          isDetailPageDataFor === "Challans"
            ? data?.paginatedRecords?.challan?.records
            : isDetailPageDataFor === "Licenses"
              ? data?.paginatedRecords?.license?.records
              : isDetailPageDataFor === "Registers"
                ? data?.paginatedRecords?.register?.records
                : data?.paginatedRecords?.return?.records
        } //direct array but not working properly
        filterColumns={filterColumns}
        isCockpitComplianceDetailPage={true}
        setIsDetailPageDataFor={setIsDetailPageDataFor}
        isDetailPageDataFor={isDetailPageDataFor}
        buttons={["Returns", "Challans", "Licenses", "Registers"]}
        setPage={setPage}
        setLimit={setLimit}
        totalPage={
          isDetailPageDataFor === "Challans"
            ? data?.paginatedRecords?.challan?.total
            : isDetailPageDataFor === "Licenses"
              ? data?.paginatedRecords?.license?.total
              : isDetailPageDataFor === "Registers"
                ? data?.paginatedRecords?.register?.total
                : data?.paginatedRecords?.return?.total
        }
        fetchPaginatedRecords={fetchPaginatedRecords}
        isPaginatedRecords={true}
      />
    </div>
  );
};

export default CockpitComplince;
