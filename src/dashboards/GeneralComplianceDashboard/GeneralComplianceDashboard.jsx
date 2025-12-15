
import { useState } from 'react';
import Chart from 'react-apexcharts';
import Snackbars from '../../component/Snackbars';
import { decryptData } from '../../page/utils/encrypt';

const GeneralComplianceDashboard = ({ data, current, selectedCharts, setSelectedCharts, shouldShow }) => {
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        message: "",
        severityType: "",
    });
    if (!data || Object.keys(data).length === 0) {
        return <div className='no-data'>{data === 403 ? 'No Data Found' : 'Loading...'}</div>;
    }
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
            colors: [
                '#2E7D32', // Active - Green
                '#D32F2F', // Expired - Red
                '#F57C00', // Expiring - Orange
                '#1976D2'  // In Progress - Blue
            ],
            legend: {
                position: 'bottom'
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            ]
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
    const userRole = decryptData(localStorage.getItem("user_role"));

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

    const canSelect = userRole === 'Admin' || userRole === 'Super-Admin';

    const cardClass = (id, defaultClass = "") =>
        canSelect && selectedCharts.includes(id) ? "selected-card" : defaultClass;


    const handleSelect = (id) => {
        if (canSelect) toggleChartSelection(id);
    };

    return (
        <>
            <Snackbars
                issnackbarsOpen={issnackbarsOpen}
                setIsSnackbarsOpen={setIsSnackbarsOpen}
            />
            <div className='row'>
                {shouldShow("gc-1") && (
                    <div className='col-12 col-md-6 mb-4'>
                        {/* Licenses Section */}
                        <div
                            className={`general-compliance ${cardClass("gc-1")}`}
                            onClick={canSelect ? () => handleSelect("gc-1") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >

                            <h2>Licenses (Total: {data.licenses.total})</h2>
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("gc-1")}
                                checked={selectedCharts.includes("gc-1")}
                                disabled={!current?.user_name}
                            />
                            <Chart
                                options={licensesChart.options}
                                series={licensesChart.series}
                                type="pie"
                                height={290}
                            />
                        </div>
                    </div>
                )}
                {shouldShow("gc-2") && (
                    <div className='col-12 col-md-6 mb-4'>
                        <div
                            className={`general-compliance ${cardClass("gc-2")}`}
                            onClick={canSelect ? () => handleSelect("gc-2") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >

                            <h2>General Compliance</h2>
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("gc-2")}
                                checked={selectedCharts.includes("gc-2")}
                                disabled={!current?.user_name}
                            />
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
                    </div>
                )}

                {/* Payroll Section */}
                {shouldShow("gc-3") && (
                    <div className='col-12 col-md-6 mb-4'>
                        {/* Registers Section */}
                        <div
                            className={`general-compliance ${cardClass("gc-3")}`}
                            onClick={canSelect ? () => handleSelect("gc-3") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("gc-3")}
                                checked={selectedCharts.includes("gc-3")}
                                disabled={!current?.user_name}
                            />
                            <Chart
                                options={registersChart.options}
                                series={registersChart.series}
                                type="bar"
                                height={350}
                            />
                        </div>
                    </div>
                )}
                {shouldShow("gc-4") && (
                    <div className='col-12 col-md-6 mb-4'>
                        {/* Returns Section */}
                        <div
                            className={`general-compliance ${cardClass("gc-4")}`}
                            onClick={canSelect ? () => handleSelect("gc-4") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("gc-4")}
                                checked={selectedCharts.includes("gc-4")}
                                disabled={!current?.user_name}
                            />
                            <Chart
                                options={returnsChart.options}
                                series={returnsChart.series}
                                type="radialBar"
                                height={350}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>

    );
};

export default GeneralComplianceDashboard;