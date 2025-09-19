<<<<<<< HEAD

import React from 'react';
=======
<<<<<<< HEAD
>>>>>>> df9eb14 (dashboard for cockpit - wip)
import Chart from 'react-apexcharts';

=======
<<<<<<< HEAD:src/component/GeneralComplianceDashboard/GeneralComplianceDashboard.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const GeneralComplianceDashboard = () => {
    const data = {
        licenses: {
            active: 265,
            expired: 21,
            expiring: 0,
            inprogress: 51,
            total: 343
        },
        payroll: {
            completed: 0,
            in_progress: 0,
            overdue: 0,
            pending: 0,
            total_payroll: 0
        },
        registers: {
            applicable_registers: 5384,
            available_registers: 0,
            completed_registers: 0,
            missing_registers: 918,
            partial_registers: 4466
        },
        returns: {
            total_returns_applicable: 1175,
            total_returns_at_risk: 80,
            total_returns_completed: 1577,
            total_returns_delayed: 80,
            total_returns_pending: 9
        }
    };
=======
import Chart from 'react-apexcharts';

>>>>>>> ea6cf3d (dashboard for cockpit - wip)
const GeneralComplianceDashboard = ({data}) => {
    
    // const data = {
    //     licenses: {
    //         active: 265,
    //         expired: 21,
    //         expiring: 0,
    //         inprogress: 51,
    //         total: 343
    //     },
    //     payroll: {
    //         completed: 0,
    //         in_progress: 0,
    //         overdue: 0,
    //         pending: 0,
    //         total_payroll: 0
    //     },
    //     registers: {
    //         applicable_registers: 5384,
    //         available_registers: 0,
    //         completed_registers: 0,
    //         missing_registers: 918,
    //         partial_registers: 4466
    //     },
    //     returns: {
    //         total_returns_applicable: 1175,
    //         total_returns_at_risk: 80,
    //         total_returns_completed: 1577,
    //         total_returns_delayed: 80,
    //         total_returns_pending: 9
    //     }
    // };
<<<<<<< HEAD
=======
>>>>>>> ecfa1ea (dashboard for cockpit - wip):src/dashboards/GeneralComplianceDashboard/GeneralComplianceDashboard.jsx
>>>>>>> ea6cf3d (dashboard for cockpit - wip)


  // Payroll display items generated from data
const payrollData = [
    {
        icon: '✔', label: 'Completed',
        value: data.payroll.completed,
        status: data.payroll.completed > 0 ? 'normal' : 'warning'
    },
    {
        icon: '↻', label: 'In Progress',
        value: data.payroll.in_progress,
        status: data.payroll.in_progress > 0 ? 'progress' : 'normal'
    },
    {
        icon: '⚠', label: 'Overdue',
        value: data.payroll.overdue,
        status: data.payroll.overdue > 0 ? 'warning' : 'normal'
    },
    {
        icon: '⏳', label: 'Pending',
        value: data.payroll.pending,
        status: data.payroll.pending > 0 ? 'normal' : 'muted'
    }
];

    // Licenses Pie Chart
    const licensesChart = {
        series: [
            data.licenses.active,
            data.licenses.expired,
            data.licenses.expiring,
            data.licenses.inprogress
        ],
        options: {
            chart: {
                type: 'pie',
                height: 350
            },
            labels: ['Active', 'Expired', 'Expiring', 'In Progress'],
            // title: {
            //     text: `Licenses (Total: ${data.licenses.total})`
            // },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
    };

    // Registers Bar Chart
    const registersChart = {
        series: [{
            data: [
                data.registers.applicable_registers,
                data.registers.available_registers,
                data.registers.completed_registers,
                data.registers.missing_registers,
                data.registers.partial_registers
            ]
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: ['Applicable', 'Available', 'Completed', 'Missing', 'Partial']
            },
            title: {
                text: 'Registers'
            }
        }
    };

    // Returns Radial Bar Chart
    const returnsChart = {
        series: [
            data.returns.total_returns_completed / data.returns.total_returns_applicable * 100 || 0,
            data.returns.total_returns_at_risk / data.returns.total_returns_applicable * 100 || 0,
            data.returns.total_returns_delayed / data.returns.total_returns_applicable * 100 || 0,
            data.returns.total_returns_pending / data.returns.total_returns_applicable * 100 || 0
        ],
        options: {
            chart: {
                height: 350,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            show: true,
                        },
                        value: {
                            show: true,
                        },
                        total: {
                            show: true,
                            label: 'Applicable',
                            formatter: function () {
                                return data.returns.total_returns_applicable;
                            }
                        }
                    }
                }
            },
            labels: ['Completed', 'At Risk', 'Delayed', 'Pending'],
            title: {
                text: 'Returns'
            }
        }
    };

    return (
        <div className='row'>
            <div className='col-12 col-md-6 mb-4'>
                {/* Licenses Section */}
                <div className="general-compliance">
                     <h2>Licenses (Total: {data.licenses.total})</h2>
                    <Chart
                        options={licensesChart.options}
                        series={licensesChart.series}
                        type="pie"
                        height={290}
                    />
                </div>
            </div>
            <div className='col-12 col-md-6 mb-4'>
                <div className="general-compliance">
                    <h2>General Compliance</h2>

                    <div className="compliance-items">
                        {payrollData?.map((item, index) => (
                            <div key={index} className={`compliance-item ${item.status}`}>
                                <div className="compliance-icon">{item.icon}</div>
                                <span className="compliance-label">{item.label}</span>
                                <span className="compliance-value">{item.value}</span>
                                {item.status === 'progress' && (
                                    <div className="progress-indicator">
                                        <div className="progress-bar-small">
                                            <div className="progress-fill-small" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {/* <div className="bg-white p-5 rounded-lg shadow-md">
                    <Chart
                        options={payrollChart.options}
                        series={payrollChart.series}
                        type="donut"
                        height={350}
                    />
                </div> */}
            </div>
            {/* Payroll Section */}

            <div className='col-12 col-md-6 mb-4'>
                {/* Registers Section */}
                <div className="general-compliance">
                    <Chart
                        options={registersChart.options}
                        series={registersChart.series}
                        type="bar"
                        height={350}
                    />
                </div>
            </div>
            <div className='col-12 col-md-6 mb-4'>
                {/* Returns Section */}
                <div className="general-compliance">
                    <Chart
                        options={returnsChart.options}
                        series={returnsChart.series}
                        type="radialBar"
                        height={350}
                    />
                </div>
            </div>
        </div>
    );
};

export default GeneralComplianceDashboard;