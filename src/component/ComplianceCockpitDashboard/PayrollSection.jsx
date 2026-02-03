import React from 'react';
import Chart from 'react-apexcharts';
import '../../style/payrollSection.css';
import { useNavigate } from 'react-router-dom';

// Simple JSON data object
const payrollData = {
  header: "Payroll",
  progressPercentage: 90,
  runNumbers: [7, 8, 9, 10],   // Added 9 and 10 to match chart data length
  experiences: 10,
  chartData: [8, 10, 7, 5],
  tooltip: {
    title: "Payroll",
    subtitle: "Payroll processor for Month",
    employees: 206,
    returnsFiled: "15/20",
    items: [
      { label: "Challans Filed", code: "PF" },
      { label: "ESI", code: "PT" },
      { label: "LWF", code: "LWF" }
    ]
  }
};

const PayrollSection = () => {
  // Destructure the data for easier access
  const {
    header,
    progressPercentage,
    runNumbers,
    experiences,
    chartData,
    tooltip
  } = payrollData;
  const navigate = useNavigate();

  // ApexCharts options with dynamic tooltip rendering and fixed navigation event
  const barChartOptions = {
    chart: {
      type: 'bar',
      height: 100,
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const dataPointIndex = config.dataPointIndex;
          const runNumber = runNumbers[dataPointIndex];
          const seriesName = "Payroll Data";
          navigate(`/details/${encodeURIComponent(seriesName)}/${runNumber}`);
        },
      },
    },
    colors: ['#10B981', '#10B981', '#F59E0B', '#E5E7EB'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
      },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      custom: function () {
        return `
          <div class="payroll-tooltip">
            <div class="tooltip-header">
              <h3>${tooltip.title}</h3>
              <p>${tooltip.subtitle}</p>
            </div>
            <div class="tooltip-content">
              <div class="employee-info">
                <span class="label">Employees</span>
                <span class="value">${tooltip.employees}</span>
              </div>
              <div class="payroll-items">
                ${tooltip.items.map(item => `
                  <div class="payroll-item">
                    <span class="check">✓</span>
                    <span class="item-text">${item.label}</span>
                    <span class="code">${item.code}</span>
                  </div>
                `).join('')}
              </div>
              <div class="returns-filed">
                <span class="returns-label">Returns Filed</span>
                <span class="returns-value">${tooltip.returnsFiled}</span>
              </div>
            </div>
          </div>
        `;
      }
    },
    xaxis: {
      categories: runNumbers.map(String),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
  };

  // Chart series uses the dynamic chartData from JSON with a name for navigation clarity
  const barChartSeries = [{
    name: "Payroll Data",
    data: chartData
  }];

  
  return (
    <div className="payroll-section">
      <div className="health-item">
        <h3>{header}</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="payroll-run">
        <div className="d-flex justify-content-between">
          <h3>Payroll Run</h3>
          <div className="run-numbers">
            {runNumbers.map((num, i) => (
              <span key={i} className="run-number">{num}</span>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <Chart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={60}
          />
        </div>

        <div className="experiences">
          <span className="exp-label">Experiences</span>
          <span className="exp-value">{experiences}</span>
        </div>
      </div>
    </div>
  );
};

export default PayrollSection;
