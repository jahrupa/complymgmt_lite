// import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import '../../style/cockpitComplinceByCompany.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import ClientComplianceTable from './ClientComplianceTable';
import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Settings2 } from 'lucide-react';
import { AnimatedSearchBar } from '../../component/AnimatedSearchBar';


// Sample of the larger dataset
// const data = {
//   "total_clients": 3774,
//   "total_licenses": 343,
//   "total_licenses_completed": 111,
//   "total_licenses_pending": 216,
//   "total_registers": 10254,
//   "total_registers_completed": 0,
//   "total_registers_pending": 6217,
//   "total_returns": 2772,
//   "total_returns_completed": 1497,
//   "total_returns_pending": 78,
//   "total_challans": 1104,
//   "total_challans_completed": 724,
//   "overall_compliance_score": 16.11,
//   "overall_license_compliance_score": 32.36,
//   "overall_register_compliance_score": 0,
//   "overall_return_compliance_score": 54.00,
//   "overall_challan_compliance_score": 65.58
// };

// Sample client data
// const sampleClients = [
//   { name: "ADP Private Limited", average_compliance_score: 120, type: "High Performer" },
//   { name: "AGD Biomedicals Private Limited", average_compliance_score: 100, type: "Compliant" },
//   { name: "AMH Services Private Limited", average_compliance_score: 0, type: "Needs Attention" },
//   { name: "Aujas Cybersecurity Limited", average_compliance_score: 45.28, type: "Moderate" },
//   { name: "BNP Paribas", average_compliance_score: 375, type: "Excellent" },
//   { name: "Ferrero India Private Limited", average_compliance_score: 113.04, type: "High Performer" },
//   { name: "Qatar Airways", average_compliance_score: 77.78, type: "Good" },
//   { name: "SBI General Insurance", average_compliance_score: 99.48, type: "High Performer" }
// ];

const CockpitComplince = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOption, setMenuOption] = useState('card');
  // console.log(menuOption, 'menuOption')
  // console.log(anchorEl, 'anchorEl')
  const gridRef = useRef();

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
      'quickFilterText',
      document.getElementById('filter-text-box').value
    );
  }, []);
  if (!data || !data.client_info) {
    return <div>Loading...</div>;
  }
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const sampleClients = Object.entries(data.compliance_info).map(([name, details]) => ({
    name,
    average_compliance_score: details.average_compliance_score || 0,
    type: Object.keys(details).find((key) => key !== "average_compliance_score") || "general",
  }));

  // Step 2: Pagination logic
  const totalPages = Math.ceil(sampleClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClients = sampleClients.slice(startIndex, startIndex + itemsPerPage);

  // Overall Compliance Chart
  const overallChartOptions = {
    chart: {
      type: 'radialBar',
      height: 350,
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '16px',
          },
          value: {
            fontSize: '14px',
          },
          total: {
            show: true,
            label: 'Overall Score',
            formatter: () => `${data?.overall_compliance_score}%`
          }
        }
      }
    },
    labels: ['Licenses', 'Returns', 'Challans', 'Registers', 'Overall'],
  };

  const overallChartSeries = [
    data?.overall_license_compliance_score,
    data?.overall_return_compliance_score,
    data?.overall_challan_compliance_score,
    data?.overall_register_compliance_score,
    data?.overall_compliance_score
  ];

  // Completion Status Chart
  const completionChartOptions = {
    chart: {
      type: 'bar',
      height: 400,
      stacked: true,
    },
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
      }
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: ['Licenses', 'Returns', 'Registers', 'Challans'],
    },
    yaxis: {
      title: {
        text: 'Count'
      }
    },
    legend: {
      position: 'top',
    },
    title: {
      text: 'Completion Status Across All Modules',
      align: 'center'
    }
  };

  const completionChartSeries = [
    {
      name: 'Completed',
      data: [
        data?.total_licenses_completed,
        data?.total_returns_completed,
        data?.total_registers_completed,
        data?.total_challans_completed
      ]
    },
    {
      name: 'Pending',
      data: [
        data.total_licenses_pending,
        data.total_returns_pending,
        data.total_registers_pending,
        0 // challans don't have pending
      ]
    },
    {
      name: 'Total',
      data: [
        data?.total_licenses,
        data?.total_returns,
        data?.total_registers,
        data?.total_challans
      ]
    }
  ];

  // Client Performance Chart
  // const clientChartOptions = {
  //   chart: {
  //     type: 'scatter',
  //     height: 400,
  //   },
  //   colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  //   xaxis: {
  //     title: {
  //       text: 'Client Index'
  //     }
  //   },
  //   yaxis: {
  //     title: {
  //       text: 'Compliance Score'
  //     }
  //   },
  //   title: {
  //     text: 'Client Performance Distribution',
  //     align: 'center'
  //   }
  // };

  // const clientChartSeries = [{
  //   name: 'Compliance Score',
  //   data: Object.entries(data?.compliance_info || {}).map(([clientName, clientData]) => ({
  //     x: clientName,
  //     y: clientData?.average_compliance_score || 0
  //   }))
  // }];


  return (
    <div className="">
      <div className="dashboard2-header">
        <h1>Multi-Client Compliance Analytics</h1>
        <div className="header-stats">
          <div className="header-stat">
            <span className="stat-value">{data?.total_clients?.toLocaleString()}</span>
            <span className="stat-label-cock-pit-complince">Total Clients</span>
          </div>
          <div className="header-stat">
            <span className="stat-value">{data?.overall_compliance_score}%</span>
            <span className="stat-label-cock-pit-complince">Overall Score</span>
          </div>
        </div>
      </div>

      <div className="dashboard2-grid">
        {/* Key Metrics */}
        <div className="metrics-section">
          <h2>Key Performance Indicators</h2>
          <div className="metrics-grid">
            <div className="metric-card licenses">
              <div className="metric-icon">📋</div>
              <div className="metric-content">
                <h3>Licenses</h3>
                <div className="metric-value">{data?.total_licenses}</div>
                <div className="metric-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(data?.total_licenses_completed / data?.total_licenses) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {data?.total_licenses_completed} / {data?.total_licenses} completed
                  </span>
                </div>
                <div className="compliance-score">{data.overall_license_compliance_score}% compliance</div>
              </div>
            </div>

            <div className="metric-card returns">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <h3>Returns</h3>
                <div className="metric-value">{data.total_returns}</div>
                <div className="metric-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(data.total_returns_completed / data.total_returns) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {data.total_returns_completed} / {data.total_returns} completed
                  </span>
                </div>
                <div className="compliance-score">{data.overall_return_compliance_score}% compliance</div>
              </div>
            </div>

            <div className="metric-card registers">
              <div className="metric-icon">📚</div>
              <div className="metric-content">
                <h3>Registers</h3>
                <div className="metric-value">{data.total_registers}</div>
                <div className="metric-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(data.total_registers_completed / data.total_registers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {data.total_registers_completed} / {data.total_registers} completed
                  </span>
                </div>
                <div className="compliance-score">{data.overall_register_compliance_score}% compliance</div>
              </div>
            </div>

            <div className="metric-card challans">
              <div className="metric-icon">💰</div>
              <div className="metric-content">
                <h3>Challans</h3>
                <div className="metric-value">{data.total_challans}</div>
                <div className="metric-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(data.total_challans_completed / data.total_challans) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {data.total_challans_completed} / {data.total_challans} completed
                  </span>
                </div>
                <div className="compliance-score">{data.overall_challan_compliance_score}% compliance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <Chart
              options={overallChartOptions}
              series={overallChartSeries}
              type="radialBar"
              height={350}
            />
          </div>

          <div className="chart-card">
            <Chart
              options={completionChartOptions}
              series={completionChartSeries}
              type="bar"
              height={400}
            />
          </div>

        </div>
        {/* <div className="chart-card">
          <Chart
            options={clientChartOptions}
            series={clientChartSeries}
            type="scatter"
            height={400}
          />
        </div> */}

        {/* Top Performers */}

        <div className="performers-section">
          <div className='d-lg-flex  d-md-flex justify-content-between align-items-center mb-3'>
            <h2>Client Performance Overview</h2>
            <div className='d-lg-flex d-md-flex  justify-content-between'>

              {menuOption === 'table' && <AnimatedSearchBar placeholder="Search..." type="text" id="filter-text-box" onInput={onFilterTextBoxChanged} />}

              <div className='client-performance-table-sm'>
                {/* <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}> */}
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 0 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Settings2 />
                  </IconButton>
                </Tooltip>
                {/* </Box> */}
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
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&::before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => { handleClose(); setMenuOption('table'); }}>
                    Table View
                  </MenuItem>
                  <MenuItem onClick={() => { handleClose(); setMenuOption('card'); }}>
                    Card View
                  </MenuItem>
                </Menu>
              </div>
            </div>

          </div>
          {menuOption === 'table' ?
            <div className="client-performance-table">
              <ClientComplianceTable data={data} gridRef={gridRef} />
            </div>
            :
            <div className="performers-grid client-performance-table-sm">
              {currentClients.map((client, index) => {
                const score = client.average_compliance_score || 0;

                // function to decide className
                const getClassName = (score) => {
                  if (score > 300) return "excellent";
                  if (score > 100 && score < 300) return "high-performer";
                  if (score > 80 && score <= 100) return "compliant";
                  if (score >= 50 && score <= 80) return "good";
                  if (score > 0 && score < 50) return "moderate";
                  if (score === 0) return "needs-attention";
                  return ""; // default
                };

                return (
                  <div key={index} className={`performer-card ${getClassName(score)}`}>
                    <div className="performer-header">
                      <h4>{client.name}</h4>
                      <span className={`performance-badge ${getClassName(score)}`}>
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
              })}
            </div>}
          {/* Pagination Controls */}
          {menuOption === 'card' && 
           <div className="justify-content-end d-flex gap-2 mt-3 client-performance-table-sm">
            <button
              className='client-performance-table-sm'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              style={{
                background: currentPage === 1 ? 'gray' : 'black',
                color: 'white',
                borderRadius: '5px',
              }}>
              Prev
            </button>
            <button
              className='client-performance-table-sm'
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={{
                background: 'black',
                color: 'white',
                borderRadius: '5px',
              }}
            >
              Next
            </button>
          </div>
          }
         
        </div>

        {/* Analytics Summary */}
        <div className="analytics-section">
          <h2>Analytics Summary</h2>
          <div className="analytics-grid">
            <div className="analytics-item">
              <div className="analytics-icon">🎯</div>
              <div className="analytics-content">
                <h4>Average Completion Rate</h4>
                <div className="analytics-value">
                  {((data.total_licenses_completed + data.total_returns_completed + data.total_challans_completed) /
                    (data.total_licenses + data.total_returns + data.total_challans) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="analytics-item">
              <div className="analytics-icon">⚠️</div>
              <div className="analytics-content">
                <h4>Items Requiring Attention</h4>
                <div className="analytics-value">
                  {data.total_licenses_pending + data.total_returns_pending + data.total_registers_pending}
                </div>
              </div>
            </div>

            <div className="analytics-item">
              <div className="analytics-icon">📈</div>
              <div className="analytics-content">
                <h4>Best Performing Area</h4>
                <div className="analytics-value">Challans ({data.overall_challan_compliance_score}%)</div>
              </div>
            </div>

            <div className="analytics-item">
              <div className="analytics-icon">🔍</div>
              <div className="analytics-content">
                <h4>Needs Improvement</h4>
                <div className="analytics-value">Registers ({data.overall_register_compliance_score}%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CockpitComplince;