import Chart from 'react-apexcharts';
import '../../style/cockpitComplinceByCompany.css';

const CockpitComplinceByCompany = ({ data }) => {
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

  return (
    <div className="">
      <div className="dashboard1-header">
        <h1>{companyName}  - Compliance Dashboard</h1>
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
          <div className="cards-grid">
            <div className="metric-card license">
              <div className="card-header">
                <h3>Licenses</h3>
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
          <div className="cards-grid">
            <div className="metric-card returns">
              <div className="card-header">
                <h3>Returns</h3>
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
        <div className="cards-grid">
          <div className="metric-card registers">
            <div className="card-header">
              <h3>Registers</h3>
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
      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>Compliance Score Distribution</h3>
          <Chart
            options={complianceChartOptions}
            series={complianceChartSeries}
            type="donut"
            height={300}
          />
        </div>
      </div>
      <div className="charts-section">
        <div className="chart-card">
          <Chart
            options={progressChartOptions}
            series={progressChartSeries}
            type="bar"
            height={300}
          />
        </div>
      </div>
      {/* Recent Documents */}
      <div className="documents-section">
        <h2>Recent Documents</h2>
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
      <div className="summary-section">
        <h2>Summary Statistics</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-value">{data?.total_clients ?? 0}</div>
            <div className="summary-label">Total Clients</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{data?.total_licenses ?? 0}</div>
            <div className="summary-label">Total Licenses</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{data?.total_returns ?? 0}</div>
            <div className="summary-label">Total Returns</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{data?.total_registers ?? 0}</div>
            <div className="summary-label">Total Registers</div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default CockpitComplinceByCompany;
