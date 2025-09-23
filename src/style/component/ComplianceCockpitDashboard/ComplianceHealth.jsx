import React from "react";
import Chart from "react-apexcharts";
import "../../style/complianceHealth.css";
const complianceData = {
  healthMetrics: [
    {
      title: "Compliance Health",
      value: "90%",
      progressPercent: 90
    },
    {
      title: "Open Issues",
      value: 8,
      progressPercent: 40
    }
  ],
  outsourcing: {
    title: "Outsourcing",
    employeeLifeCycle: {
      title: "Employee Life Cycle",
      progressPercent: 85
    },
    chart: {
      type: "donut",
      height: 120,
      colors: ["#10B981", "#E5E7EB"],
      series: [150, 50],
      plotOptions: {
        pie: {
          donut: {
            size: "70%"
          }
        }
      },
      dataLabelsEnabled: false,
      legendShown: false,
      strokeWidth: 0
    },
    stats: [
      {
        label: "Headcount",
        value: 150
      },
      {
        label: "Claims",
        value: 5
      },
      {
        label: "Grievances",
        value: 2
      }
    ]
  }
};

const ComplianceHealth = () => {
  const { healthMetrics, outsourcing } = complianceData;

  // Prepare chart options dynamically from JSON
  const circularChartOptions = {
    chart: {
      type: outsourcing.chart.type,
      height: outsourcing.chart.height
    },
    colors: outsourcing.chart.colors,
    plotOptions: outsourcing.chart.plotOptions,
    dataLabels: {
      enabled: outsourcing.chart.dataLabelsEnabled
    },
    legend: {
      show: outsourcing.chart.legendShown
    },
    stroke: {
      width: outsourcing.chart.strokeWidth
    }
  };

  return (
    <div className="compliance-health-container">
      <div className="health-card">
        {healthMetrics.map((metric, idx) => (
          <div key={idx} className="health-item">
            <h3>{metric.title}</h3>
            <div className="health-value">{metric.value}</div>
            <div className={`progress-bar${metric.title === "Open Issues" ? " secondary" : ""}`}>
              <div
                className="progress-fill"
                style={{ width: `${metric.progressPercent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="outsourcing-card">
        <h3>{outsourcing.title}</h3>

        <div className="employee-lifecycle">
          <h4>{outsourcing.employeeLifeCycle.title}</h4>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${outsourcing.employeeLifeCycle.progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="chart-container">
          <Chart
            options={circularChartOptions}
            series={outsourcing.chart.series}
            type={outsourcing.chart.type}
            height={outsourcing.chart.height}
          />
          <div className="chart-stats">
            {outsourcing.stats.map((stat, idx) => (
              <div key={idx} className="stat-item">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceHealth;
