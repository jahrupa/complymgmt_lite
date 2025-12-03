import Chart from 'react-apexcharts';
import '../../style/cockpitComplinceByCompany.css';
import { useState } from 'react';
import Snackbars from '../../component/Snackbars';

const CockpitComplinceByCompany = ({ data, current, selectedCharts, setSelectedCharts }) => {
  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    severityType: "",
  });
  if (!data || !data.compliance_info) {
    return <div className='no-data'>{data === 403 || data === 500 ? 'No Data Found' : 'Loading...'}</div>;;
  }
  const companyName = Object?.keys(data?.compliance_info)[0];
  const complianceData = data?.compliance_info?.[companyName];
  const clientInfo = data?.client_info?.[companyName];

  // Compliance Score Donut Chart
  const complianceChartOptions = {
    chart: {
      type: 'donut',
      height: 300,
    },
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    labels: ['License', 'Returns', 'Registers'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Overall Score',
              formatter: () => `${complianceData?.average_compliance_score ?? 0}%`
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`
    },
    legend: {
      position: 'bottom',
      fontSize: '14px'
    }
  };

  const complianceChartSeries = [
    complianceData?.license?.compliance_score ?? 0,
    complianceData?.returns?.compliance_score ?? 0,
    complianceData?.registers?.compliance_score ?? 0
  ];

  // Progress Bar Chart
  const progressChartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      horizontal: true,
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b'],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}`
    },
    xaxis: {
      categories: ['Licenses', 'Returns', 'Registers'],
      title: {
        text: 'Count'
      }
    },
    yaxis: {
      title: {
        text: 'Compliance Areas'
      }
    },
    title: {
      text: 'Completion Status',
      align: 'center'
    }
  };

  const progressChartSeries = [
    {
      name: 'Completed',
      data: [
        complianceData?.license?.completed_count ?? 0,
        complianceData?.returns?.completed_count ?? 0,
        complianceData?.registers?.completed_count ?? 0
      ]
    },
    {
      name: 'Pending',
      data: [
        complianceData?.license?.pending_count ?? 0,
        complianceData?.returns?.pending_count ?? 0,
        complianceData?.registers?.pending_count ?? 0
      ]
    }
  ];

  // Recent Documents
  const recentDocs = data?.recent_documents || [];

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
  return (
    <div className="">
      <Snackbars
        issnackbarsOpen={issnackbarsOpen}
        setIsSnackbarsOpen={setIsSnackbarsOpen}
      />
      <div className={`dashboard1-header ${selectedCharts.includes("ccbc-1") ? "selected-card" : ""
        }`}
        onClick={() => {
          toggleChartSelection("ccbc-1");
        }}
        style={{ cursor: "pointer" }}>
        <h1>{companyName}  - Compliance Dashboard</h1>
        <input
          type="checkbox"
          className="chart-select-checkbox"
          onChange={() => toggleChartSelection("ccbc-1")}
          checked={selectedCharts.includes("ccbc-1")}
          disabled={!current?.user_name} // if user_name empty → disable
        />
        <div className="client-info">
          <div className="info-item">
            <span className="label">Location:</span>
            <span className="value">
              {clientInfo?.location?.join(', ')}, {clientInfo?.state?.join(', ')}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Modules:</span>
            <span className="value">{clientInfo?.modules_subscribed?.join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="dashboard1-grid">
        {/* Overview Cards */}
        <div className="overview-section">
          <h2>Compliance Overview</h2>
          <div className='row'>
            <div className='col'>
              <div className={`cards-grid ${selectedCharts.includes("ccbc-2") ? "selected-card " : "license"
                }`}
                onClick={() => {
                  toggleChartSelection("ccbc-2");
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="metric-card license">
                  <div className="card-header">
                    <h3>Licenses</h3>
                    <input
                      type="checkbox"
                      className="chart-select-checkbox"
                      onChange={() => toggleChartSelection("ccbc-2")}
                      checked={selectedCharts.includes("ccbc-2")}
                      disabled={!current?.user_name}
                    />
                    <div className="score">{complianceData?.license?.compliance_score ?? 0}%</div>
                  </div>
                  <div className="card-stats">
                    <div className="stat">
                      <span className="stat-label">Completed</span>
                      <span className="stat-value">{complianceData?.license?.completed_count ?? 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Pending</span>
                      <span className="stat-value">{complianceData?.license?.pending_count ?? 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Total</span>
                      <span className="stat-value">{complianceData?.license?.location_count ?? 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className={`cards-grid ${selectedCharts.includes("ccbc-3") ? "selected-card " : "returns"
                }`}
                onClick={() => {
                  toggleChartSelection("ccbc-3");
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="metric-card returns">
                  <div className="card-header">
                    <h3>Returns</h3>
                    <input
                      type="checkbox"
                      className="chart-select-checkbox"
                      onChange={() => toggleChartSelection("ccbc-3")}
                      checked={selectedCharts.includes("ccbc-3")}
                      disabled={!current?.user_name}
                    />
                    <div className="score">{complianceData?.returns?.compliance_score ?? 0}%</div>
                  </div>
                  <div className="card-stats">
                    <div className="stat">
                      <span className="stat-label">Completed</span>
                      <span className="stat-value">{complianceData?.returns?.completed_count ?? 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Pending</span>
                      <span className="stat-value">{complianceData?.returns?.pending_count ?? 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Total</span>
                      <span className="stat-value">{complianceData?.returns?.location_count ?? 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className={`cards-grid ${selectedCharts.includes("ccbc-4") ? "selected-card " : "registers"
                }`}
                onClick={() => {
                  toggleChartSelection("ccbc-4");
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="metric-card registers">
                  <div className="card-header">
                    <h3>Registers</h3>
                    <input
                      type="checkbox"
                      className="chart-select-checkbox"
                      onChange={() => toggleChartSelection("ccbc-4")}
                      checked={selectedCharts.includes("ccbc-4")}
                      disabled={!current?.user_name}
                    />
                    <div className="score">{complianceData?.registers?.compliance_score ?? 0}%</div>
                  </div>
                  <div className="card-stats">
                    <div className="stat">
                      <span className="stat-label">Completed</span>
                      <span className="stat-value">{complianceData?.registers?.completed_count ?? 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Pending</span>
                      <span className="stat-value">{complianceData?.registers?.pending_count ?? 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Total</span>
                      <span className="stat-value">{complianceData?.registers?.location_count ?? 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className='row'>
        <div className='col'>
          <div className="charts-section">
            <div className={`chart-card ${selectedCharts.includes("ccbc-5") ? "selected-card" : ""
              }`}
              onClick={() => {
                toggleChartSelection("ccbc-5");
              }}
              style={{ cursor: "pointer" }}>
              <h3>Compliance Score Distribution</h3>
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("ccbc-5")}
                checked={selectedCharts.includes("ccbc-5")}
                disabled={!current?.user_name}
              />
              <Chart
                options={complianceChartOptions}
                series={complianceChartSeries}
                type="donut"
                height={300}
              />
            </div>
          </div>
        </div>
        <div className='col'>
          <div className="charts-section">
            <div className={`chart-card ${selectedCharts.includes("ccbc-6") ? "selected-card" : ""
              }`}
              onClick={() => {
                toggleChartSelection("ccbc-6");
              }}
              style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                className="chart-select-checkbox"
                onChange={() => toggleChartSelection("ccbc-6")}
                checked={selectedCharts.includes("ccbc-6")}
                disabled={!current?.user_name}
              />
              <Chart
                options={progressChartOptions}
                series={progressChartSeries}
                type="bar"
                height={300}
              />
            </div>
          </div>
        </div>
      </div>


      {/* Recent Documents */}
      <div className={`documents-section ${selectedCharts.includes("ccbc-7") ? "selected-card" : ""
        }`}
        onClick={() => {
          toggleChartSelection("ccbc-7");
        }}
        style={{ cursor: "pointer" }}>
        <h2>Recent Documents</h2>
        <input
          type="checkbox"
          className="chart-select-checkbox"
          onChange={() => toggleChartSelection("ccbc-7")}
          checked={selectedCharts.includes("ccbc-7")}
          disabled={!current?.user_name}
        />
        <div className="documents-list">
          {recentDocs.slice(0, 5).map((doc, index) => (
            <div key={index} className="document-item">
              <div className="doc-info">
                <h4>{doc?.file_name}</h4>
                <p>Document ID: {doc?.document_id}</p>
                <span className="doc-date">{doc?.created_at ? new Date(doc.created_at).toLocaleDateString() : ''}</span>
              </div>
              <div className={`doc-status ${doc?.approval_status === 1 ? 'approved' : 'pending'}`}>
                {doc?.approval_status === 1 ? 'Approved' : 'Pending'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div  className={`summary-section ${selectedCharts.includes("ccbc-8") ? "selected-card" : ""
        }`}
        onClick={() => {
          toggleChartSelection("ccbc-8");
        }}
        style={{ cursor: "pointer" }}>
        <h2>Summary Statistics</h2>
         <input
          type="checkbox"
          className="chart-select-checkbox"
          onChange={() => toggleChartSelection("ccbc-8")}
          checked={selectedCharts.includes("ccbc-8")}
          disabled={!current?.user_name}
        />
        <div className="summary-grid">
          <div className={`summary-item ${selectedCharts.includes("ccbc-9") ? "selected-card" : ""
        }`}
        onClick={() => {
          toggleChartSelection("ccbc-9");
        }}
        style={{ cursor: "pointer" }}
        >
            <div className="summary-value">{data?.total_clients ?? 0}</div>
            <div className="summary-label">Total Clients</div>
            <input
          type="checkbox"
          className="chart-select-checkbox"
          onChange={() => toggleChartSelection("ccbc-9")}
          checked={selectedCharts.includes("ccbc-9")}
          disabled={!current?.user_name}
        />
          </div>
          <div className={`summary-item ${selectedCharts.includes("ccbc-10") ? "selected-card" : ""
        }`}
        onClick={() => {
          toggleChartSelection("ccbc-10");
        }}
        style={{ cursor: "pointer" }}>
            <div className="summary-value">{data?.total_licenses ?? 0}</div>
            <div className="summary-label">Total Licenses</div>
            <input
          type="checkbox"
          className="chart-select-checkbox"
          onChange={() => toggleChartSelection("ccbc-10")}
          checked={selectedCharts.includes("ccbc-10")}
          disabled={!current?.user_name}
        />
          </div>
          <div className={`summary-item ${selectedCharts.includes("ccbc-11") ? "selected-card" : ""
        }`}
        onClick={() => {
          toggleChartSelection("ccbc-11");
        }}
        style={{ cursor: "pointer" }}>
            <div className="summary-value">{data?.total_returns ?? 0}</div>
            <div className="summary-label">Total Returns</div>
            <input
          type="checkbox"
          className="chart-select-checkbox"
          onChange={() => toggleChartSelection("ccbc-11")}
          checked={selectedCharts.includes("ccbc-11")}
          disabled={!current?.user_name}
        />
          </div>
          <div className={`summary-item ${selectedCharts.includes("ccbc-12") ? "selected-card" : ""
        }`}
        onClick={() => {
          toggleChartSelection("ccbc-12");
        }}
        style={{ cursor: "pointer" }}>
            <div className="summary-value">{data?.total_registers ?? 0}</div>
            <div className="summary-label">Total Registers</div>
            <input
          type="checkbox"
          className="chart-select-checkbox"
          onChange={() => toggleChartSelection("ccbc-12")}
          checked={selectedCharts.includes("ccbc-12")}
          disabled={!current?.user_name}
        />
          </div>
        </div>
      </div>
    </div>

  );
};

export default CockpitComplinceByCompany;
