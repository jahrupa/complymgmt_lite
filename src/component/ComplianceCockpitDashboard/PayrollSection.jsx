import Chart from 'react-apexcharts';
import '../../style/payrollSection.css';

const PayrollSection = () => {
    const barChartOptions = {
        chart: {
            type: 'bar',
            height: 100,
            toolbar: {
                show: false,
            },
        },
        colors: ['#10B981', '#10B981', '#F59E0B', '#E5E7EB'],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '60%',
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: true,
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                return `
          <div class="payroll-tooltip">
            <div class="tooltip-header">
              <h3>Payroll</h3>
              <p>Payroll processor for Month</p>
            </div>
            <div class="tooltip-content">
              <div class="employee-info">
                <span class="label">Employees</span>
                <span class="value">206</span>
              </div>
              <div class="payroll-items">
                <div class="payroll-item">
                  <span class="check">✓</span>
                  <span class="item-text">Challans Filed</span>
                  <span class="code">PF</span>
                </div>
                <div class="payroll-item">
                  <span class="check">✓</span>
                  <span class="item-text">ESI</span>
                  <span class="code">PT</span>
                </div>
                <div class="payroll-item">
                  <span class="check">✓</span>
                  <span class="item-text">LWF</span>
                  <span class="code">LWF</span>
                </div>
              </div>
               <div class="returns-filed">
                <span class="returns-label">Returns Filed</span>
                <span class="returns-value">15/20</span>
            </div>
            </div>
          </div>
        `;
            }
        },
        xaxis: {
            categories: ['', '', '', ''],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
            },
        },
        yaxis: {
            show: false,
        },
        grid: {
            show: false,
        },
    };

    const barChartSeries = [{
        data: [8, 10, 7, 5]
    }];

    return (
        <div className="payroll-section">
            {/* <div className="payroll-header">
                <h2>Payroll</h2>
                <p>Payroll processor for Month</p>

                <div className="employee-count">
                    <span className="count-label">Employees</span>
                    <span className="count-value">206</span>
                </div>
            </div> */}

            {/* <div className="payroll-items">
                <div className="payroll-item">
                    <div className="check-icon">✓</div>
                    <span className="item-label">Challans Filed</span>
                    <span className="item-code">PF</span>
                </div>

                <div className="payroll-item">
                    <div className="check-icon">✓</div>
                    <span className="item-label">ESI</span>
                    <span className="item-code">PT</span>
                </div>

                <div className="payroll-item">
                    <div className="check-icon">✓</div>
                    <span className="item-label">LWF</span>
                    <span className="item-code">LWF</span>
                </div>
            </div> */}
            <div className="health-item">
          <h3>Payroll</h3>
          {/* <div className="health-value">90%</div> */}
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '90%'}}></div>
          </div>
        </div>
            <div className="payroll-run">
                <div className='d-flex justify-content-between'>
                    <h3>Payroll Run</h3>
                    <div className="run-numbers">
                        <span className="run-number">7</span>
                        <span className="run-number">8</span>
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
                    <span className="exp-value">10</span>
                </div>
            </div>

            {/* <div className="returns-filed">
                <span className="returns-label">Returns Filed</span>
                <span className="returns-value">15/20</span>
            </div> */}
        </div>
    );
};

export default PayrollSection;