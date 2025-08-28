import React from 'react';
import Chart from 'react-apexcharts';
import '../../style/complianceHealth.css';

const ComplianceHealth = () => {
  const circularChartOptions = {
    chart: {
      type: 'donut',
      height: 120,
    },
    colors: ['#10B981', '#E5E7EB'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        }
      }
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      width: 0,
    }
  };

  return (
    <div className="compliance-health-container">
      <div className="health-card">
        <div className="health-item">
          <h3>Compliance Health</h3>
          <div className="health-value">90%</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '90%'}}></div>
          </div>
        </div>
        
        <div className="health-item">
          <h3>Open Issues</h3>
          <div className="health-value">8</div>
          <div className="progress-bar secondary">
            <div className="progress-fill" style={{width: '40%'}}></div>
          </div>
        </div>
      </div>

      <div className="outsourcing-card">
        <h3>Outsourcing</h3>
        <div className="employee-lifecycle">
          <h4>Employee Life Cycle</h4>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '85%'}}></div>
          </div>
        </div>
        
        <div className="chart-container">
          <Chart
            options={circularChartOptions}
            series={[150, 50]}
            type="donut"
            height={120}
          />
          <div className="chart-stats">
            <div className="stat-item">
              <span className="stat-label">Headcount</span>
              <span className="stat-value">150</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Claims</span>
              <span className="stat-value">5</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Grievances</span>
              <span className="stat-value">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceHealth;