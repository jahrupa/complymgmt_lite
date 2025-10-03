// import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import '../../style/cockpitComplinceByCompany.css';


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
const sampleClients = [
  { name: "ADP Private Limited", score: 120, type: "High Performer" },
  { name: "AGD Biomedicals Private Limited", score: 100, type: "Compliant" },
  { name: "AMH Services Private Limited", score: 0, type: "Needs Attention" },
  { name: "Aujas Cybersecurity Limited", score: 45.28, type: "Moderate" },
  { name: "BNP Paribas", score: 375, type: "Excellent" },
  { name: "Ferrero India Private Limited", score: 113.04, type: "High Performer" },
  { name: "Qatar Airways", score: 77.78, type: "Good" },
  { name: "SBI General Insurance", score: 99.48, type: "High Performer" }
];

const CockpitComplince = ({ data }) => {
  if (!data || !data.client_info) {
    return <div>Loading...</div>;
  }
  // const [selectedMetric, setSelectedMetric] = useState('overall');
// Remove or fix the invalid console.log to prevent runtime errors
// If you want to debug, check if compliance_info exists first:
// if (data.compliance_info && data.compliance_info.object && data.compliance_info.object.key) {
  // console.log(Object.keys(data?.compliance_info));
// }
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
  const clientChartOptions = {
    chart: {
      type: 'scatter',
      height: 400,
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    xaxis: {
      title: {
        text: 'Client Index'
      }
    },
    yaxis: {
      title: {
        text: 'Compliance Score'
      }
    },
    title: {
      text: 'Client Performance Distribution',
      align: 'center'
    }
  };

  const clientChartSeries = [{
    name: 'Compliance Score',
    data: sampleClients?.map((client, index) => [index + 1, client?.score])
  }];

  return (
    <div className="">
      <div className="dashboard2-header">
        <h1>Multi-Client Compliance Analytics</h1>
        <div className="header-stats">
          <div className="header-stat">
            <span className="stat-value">{data?.total_clients?.toLocaleString()}</span>
            <span className="stat-label">Total Clients</span>
          </div>
          <div className="header-stat">
            <span className="stat-value">{data?.overall_compliance_score}%</span>
            <span className="stat-label">Overall Score</span>
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
        <div className="chart-card">
          <Chart
            options={clientChartOptions}
            series={clientChartSeries}
            type="scatter"
            height={400}
          />
        </div>

        {/* Top Performers */}
        <div className="performers-section">
          <h2>Client Performance Overview</h2>
          <div className="performers-grid">
            {sampleClients.map((client, index) => (
              <div key={index} className={`performer-card ${client.type.toLowerCase().replace(' ', '-')}`}>
                <div className="performer-header">
                  <h4>{client.name}</h4>
                  <span className={`performance-badge ${client.type.toLowerCase().replace(' ', '-')}`}>
                    Complaince Score
                    {/* {client.type} */}
                  </span>
                </div>
                <div className="performer-score">
                  <span className="score-value">{client.score}%</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{ width: `${Math.min(client.score, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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