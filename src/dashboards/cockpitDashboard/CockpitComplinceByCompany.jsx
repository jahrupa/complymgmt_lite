import Chart from 'react-apexcharts';
import '../../style/cockpitComplinceByCompany.css';
import { useMemo, useState } from 'react';
import Snackbars from '../../component/Snackbars';

// How many chips to show before collapsing the rest behind a "+N more" toggle.
const CHIP_PREVIEW_COUNT = 6;

// Renders a labelled, collapsible row of chips. Long lists (some clients have
// 40+ locations) stay readable instead of turning the header into a wall of text.
const ChipGroup = ({ label, items, tone }) => {
  const [expanded, setExpanded] = useState(false);

  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!list.length) {
    return (
      <div className="ccbc-info-row">
        <span className="ccbc-info-label">{label}</span>
        <div className="ccbc-chip-list">
          <span className="ccbc-chip ccbc-chip-empty">Not available</span>
        </div>
      </div>
    );
  }

  const visible = expanded ? list : list.slice(0, CHIP_PREVIEW_COUNT);
  const hiddenCount = list.length - visible.length;
  return (
    <div className="ccbc-info-row">
      <span className="ccbc-info-label">
        {label}
        <span className="ccbc-count-badge">{list.length}</span>
      </span>

      <div className="ccbc-chip-list">
        {visible.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={`ccbc-chip ccbc-chip-${tone}`}
            title={item}
          >
            {item}
          </span>
        ))}

        {(hiddenCount > 0 || expanded) && (
          <button
            type="button"
            className="ccbc-chip ccbc-chip-toggle"
            // The header card itself is clickable (chart selection) — don't
            // toggle the card when the user only wants to expand the list.
            onClick={(event) => {
              event.stopPropagation();
              setExpanded((prev) => !prev);
            }}
          >
            {expanded ? 'Show less' : `+${hiddenCount} more`}
          </button>
        )}
      </div>
    </div>
  );
};

const CockpitComplinceByCompany = ({cockpitDataByClient, companyName, data, current, selectedCharts, setSelectedCharts }) => {
  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    severityType: "",
  });
  // Location / state / modules come from the onboarding API, which returns
  // `client_info` keyed by company name — not from the cockpit `data`.
  const clientInfo = useMemo(() => {
    const info = cockpitDataByClient?.client_info;

    if (!info || !companyName) return null;

    if (info[companyName]) return info[companyName];

    // Company names can differ in case/spacing between the two APIs.
    const target = String(companyName).trim().toLowerCase();
    const matchedKey = Object.keys(info).find(
      (key) => key.trim().toLowerCase() === target
    );

    return matchedKey ? info[matchedKey] : null;
  }, [cockpitDataByClient, companyName]);
  const locationNames = clientInfo?.location ?? data?.location_names ?? [];
  const stateNames = clientInfo?.state ?? data?.state ?? [];
  const modulesSubscribed =
    clientInfo?.modules_subscribed ?? data?.modules_subscribed ?? [];

  // Overall score: prefer the value from the API, otherwise derive it as a
  // weighted average of the four categories (weighted by item count).
  const overallScore = useMemo(() => {
    if (data?.average_compliance_score != null) {
      return Number(data.average_compliance_score);
    }

    const categories = [
      {
        total: data?.total_licenses || 0,
        score: data?.licenses_compliance_score || 0,
      },
      {
        total: data?.total_returns || 0,
        score: data?.returns_compliance_score || 0,
      },
      {
        total: data?.applicable_registers || 0,
        score: data?.registers_compliance_score || 0,
      },
      {
        total: data?.total_challans || 0,
        score: data?.challans_compliance_score || 0,
      },
    ];

    const totalItems = categories.reduce((sum, item) => sum + item.total, 0);

    if (!totalItems) return 0;

    const weightedScore = categories.reduce(
      (sum, item) => sum + item.score * item.total,
      0
    );

    return Number((weightedScore / totalItems).toFixed(2));
  }, [data]);

  // Compliance Score Donut Chart
  const complianceChartOptions = {
    chart: {
      type: 'donut',
      height: 300,
    },
    colors: ['#10b981', '#f59e0b', '#ef4444', '#777777'],
    labels: ['License', 'Returns', 'Registers', 'Challans'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Overall Score',
              formatter: () => `${overallScore ?? 0}%`
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
    data?.licenses_compliance_score ?? 0,
    data?.returns_compliance_score ?? 0,
    data?.registers_compliance_score ?? 0,
    data?.challans_compliance_score ?? 0
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
      categories: ['Licenses', 'Returns', 'Registers', 'Challans'],
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
        data?.active_licenses ?? 0,
        data?.completed_returns ?? 0,
        data?.completed_registers ?? 0,
        data?.completed_challans ?? 0
      ]
    },
    {
      name: 'Pending',
      data: [
        data?.expired_licenses ?? 0,
        data?.total_returns_pending ?? 0,
        data?.missing_registers ?? 0,
        data?.pending_challans ?? 0
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
        <div className="ccbc-client-info">
          <ChipGroup label="States" items={stateNames} tone="state" />
          <ChipGroup label="Locations" items={locationNames} tone="location" />
          <ChipGroup label="Modules" items={modulesSubscribed} tone="module" />
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
                    <div className="score">{data?.licenses_compliance_score ?? 0}%</div>
                  </div>
                  <div className="card-stats">
                    <div className="stat">
                      <span className="stat-label">Completed</span>
                      <span className="stat-value">{data?.active_licenses ?? 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Pending</span>
                      <span className="stat-value">{data?.total_data?.totals?.pending_licenses ?? 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Total</span>
                      <span className="stat-value">{data?.total_licenses ?? 0}</span>
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
                    <div className="score">{data?.returns_compliance_score ?? 0}%</div>
                  </div>
                  <div className="card-stats">
                    <div className="stat">
                      <span className="stat-label">Completed</span>
                      <span className="stat-value">{data?.completed_returns ?? 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Pending</span>
                      <span className="stat-value">{data?.total_data?.totals?.pending_returns?? 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Total</span>
                      <span className="stat-value">{data?.total_returns ?? 0}</span>
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
                    <div className="score">{data?.registers_compliance_score ?? 0}%</div>
                  </div>
                  <div className="card-stats">
                    <div className="stat">
                      <span className="stat-label">Completed</span>
                      <span className="stat-value">{data?.completed_registers ?? 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Pending</span>
                      <span className="stat-value">{data?.total_data?.totals?.pending_registers ?? 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Total</span>
                      <span className="stat-value">{data?.total_data?.totals?.total_registers ?? 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col'>
              <div
                className={`cards-grid ${selectedCharts.includes("ccbc-13") ? "selected-card " : "challans"
                  }`}
                onClick={() => {
                  toggleChartSelection("ccbc-13");
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="metric-card challans">
                  <div className="card-header">
                    <h3>Challans</h3>
                    <input
                      type="checkbox"
                      className="chart-select-checkbox"
                      onChange={() => toggleChartSelection("ccbc-13")}
                      checked={selectedCharts.includes("ccbc-13")}
                      disabled={!current?.user_name}
                    />
                    <div className="score">
                      {data?.challans_compliance_score ?? 0}%
                    </div>
                  </div>

                  <div className="card-stats">
                    <div className="stat">
                      <span className="stat-label">Resolved</span>
                      <span className="stat-value">
                        {data?.completed_challans ?? 0}
                      </span>
                    </div>

                    <div className="stat">
                      <span className="stat-label">Pending</span>
                      <span className="stat-value">
                        {data?.total_data?.totals?.pending_challans ?? 0}
                      </span>
                    </div>

                    <div className="stat">
                      <span className="stat-label">Total</span>
                      <span className="stat-value">
                        {data?.total_challans ?? 0}
                      </span>
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
      <div className={`summary-section ${selectedCharts.includes("ccbc-8") ? "selected-card" : ""
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
            <div className="summary-value">{locationNames?.length ?? 0}</div>
            <div className="summary-label">Total Locations</div>
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
            <div className="summary-value">{data?.applicable_registers ?? 0}</div>
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
