import React, { useState } from 'react'
import Chart from 'react-apexcharts';
const ReturnsAndSubmissions = () => {
    const employeeCountForSystemUse = [
        { serviceType: "SmoothPay", employeeCount: 120 },
        { serviceType: "Opportune", employeeCount: 85 },
        { serviceType: "ZingHR", employeeCount: 60 },
        { serviceType: "Greyt HR", employeeCount: 45 },
    ];

    // Extract categories and data
    const systemCategories = employeeCountForSystemUse.map((item) => item.serviceType);
    const systemEmployeeCounts = employeeCountForSystemUse.map((item) => item.employeeCount);
    const [comparisonOfReturnApplicability, setComparisonOfReturnApplicability] = useState({

        series: [
            {
                name: "Distinct Return Obligations",
                data: systemEmployeeCounts, // Y-axis values (Sum of Employee Count)
            },
        ],
        options: {
            chart: {
                type: "bar",
                // height: 350,
                toolbar: { show: false },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    // borderRadius: 6,
                    //   columnWidth: "55%",
                },
            },
            dataLabels: {
                enabled: false,
                style: {
                    colors: ["#333"],
                },
            },
            xaxis: {
                categories: systemCategories, // X-axis categories (Applicable Returns Count)
                title: {
                    text: "Company Common Name",
                    // style: { fontWeight: "bold" },
                },
            },
            yaxis: {
                title: {
                    text: "Distinct Return Obligations",
                    style: { fontWeight: "bold" },
                },
                min: 0,
                // max: Math.ceil(Math.max(...employeeCounts) / 10) * 10, // auto-adjust up to K
                tickAmount: 5,
            },
            colors: ["#2cafc0ff"],
            fill: {
                opacity: 1,
                colors: ["#2cafc0ff"],
            },
            states: {
                hover: {
                    filter: {
                        type: "none", // 👈 disables the lighten effect
                    },
                },
                active: {
                    filter: {
                        type: "none", // 👈 disables click highlight effect
                    },
                },
            },

            //   title: {
            //     text: "Sum of Employee Count per Payroll Service Type",
            //     align: "center",
            //   },
            //   grid: {
            //     borderColor: "#e7e7e7",
            //     row: {
            //       colors: ["#f3f3f3", "transparent"],
            //       opacity: 0.5,
            //     },
            //   },
        },


    });
    const [applicableReturnsByState, setApplicableReturnsByState] = useState({

        series: [
            {
                name: "Applicable Returns Count",
                data: systemEmployeeCounts, // Y-axis values (Sum of Employee Count)
            },
        ],
        options: {
            chart: {
                type: "bar",
                // height: 350,
                toolbar: { show: false },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    // borderRadius: 6,
                    //   columnWidth: "55%",
                },
            },
            dataLabels: {
                enabled: false,
                style: {
                    colors: ["#333"],
                },
            },
            xaxis: {
                categories: systemCategories, // X-axis categories (Applicable Returns Count)
                title: {
                    text: "Applicable Returns Count",
                    // style: { fontWeight: "bold" },
                },
            },
            yaxis: {
                title: {
                    text: "State",
                    style: { fontWeight: "bold" },
                },
                min: 0,
                // max: Math.ceil(Math.max(...employeeCounts) / 10) * 10, // auto-adjust up to K
                tickAmount: 5,
            },
            colors: ["#5ad5e2ff"],
            fill: {
                opacity: 1,
                colors: ["#5ad5e2ff"],
            },
            states: {
                hover: {
                    filter: {
                        type: "none", // 👈 disables the lighten effect
                    },
                },
                active: {
                    filter: {
                        type: "none", // 👈 disables click highlight effect
                    },
                },
            },

            //   title: {
            //     text: "Sum of Employee Count per Payroll Service Type",
            //     align: "center",
            //   },
            //   grid: {
            //     borderColor: "#e7e7e7",
            //     row: {
            //       colors: ["#f3f3f3", "transparent"],
            //       opacity: 0.5,
            //     },
            //   },
        },


    });
    const [applicableReturnsByLocation, setApplicableReturnsByLocation] = useState({

        series: [
            {
                name: "Applicable Returns Count",
                data: systemEmployeeCounts, // Y-axis values (Sum of Employee Count)
            },
        ],
        options: {
            chart: {
                type: "bar",
                // height: 350,
                toolbar: { show: false },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    // borderRadius: 6,
                    //   columnWidth: "55%",
                },
            },
            dataLabels: {
                enabled: false,
                style: {
                    colors: ["#333"],
                },
            },
            xaxis: {
                categories: systemCategories, // X-axis categories (Company Common Name)
                title: {
                    text: "Applicable Returns Count",
                    // style: { fontWeight: "bold" },
                },
            },
            yaxis: {
                title: {
                    text: "Location Name",
                    style: { fontWeight: "bold" },
                },
                min: 0,
                // max: Math.ceil(Math.max(...employeeCounts) / 10) * 10, // auto-adjust up to K
                tickAmount: 5,
            },
            colors: ["#609bf3ff"],
            fill: {
                opacity: 1,
                colors: ["#609bf3ff"],
            },
            states: {
                hover: {
                    filter: {
                        type: "none", // 👈 disables the lighten effect
                    },
                },
                active: {
                    filter: {
                        type: "none", // 👈 disables click highlight effect
                    },
                },
            },

            //   title: {
            //     text: "Sum of Employee Count per Payroll Service Type",
            //     align: "center",
            //   },
            //   grid: {
            //     borderColor: "#e7e7e7",
            //     row: {
            //       colors: ["#f3f3f3", "transparent"],
            //       opacity: 0.5,
            //     },
            //   },
        },


    });
    const [applicableReturnsByReturnName, setApplicableReturnsByReturnName] = useState({

        series: [
            {
                name: "Completion Rate (%)",
                data: systemEmployeeCounts, // Y-axis values (Sum of Completion Rate (%))
            },
        ],
        options: {
            chart: {
                type: "bar",
                // height: 350,
                toolbar: { show: false },
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    // borderRadius: 6,
                    //   columnWidth: "55%",
                },
            },
            dataLabels: {
                enabled: false,
                style: {
                    colors: ["#333"],
                },
            },
            xaxis: {
                categories: systemCategories, // X-axis categories (Company Common Name)
                title: {
                    text: "Completion Rate (%)",
                    // style: { fontWeight: "bold" },
                },
            },
            yaxis: {
                title: {
                    text: "Return Name",
                    style: { fontWeight: "bold" },
                },
                min: 0,
                // max: Math.ceil(Math.max(...employeeCounts) / 10) * 10, // auto-adjust up to K
                tickAmount: 5,
            },
            colors: ["#609bf3ff"],
            fill: {
                opacity: 1,
                colors: ["#609bf3ff"],
            },
            states: {
                hover: {
                    filter: {
                        type: "none", // 👈 disables the lighten effect
                    },
                },
                active: {
                    filter: {
                        type: "none", // 👈 disables click highlight effect
                    },
                },
            },

            //   title: {
            //     text: "Sum of Employee Count per Payroll Service Type",
            //     align: "center",
            //   },
            //   grid: {
            //     borderColor: "#e7e7e7",
            //     row: {
            //       colors: ["#f3f3f3", "transparent"],
            //       opacity: 0.5,
            //     },
            //   },
        },


    });
    const [applicableReturnsByReturnType, setApplicableReturnsByReturnType] = useState({

        series: [
            {
                name: "Number of Companies",
                data: systemEmployeeCounts, // Y-axis values (Sum of Number of Companies)
            },
        ],
        options: {
            chart: {
                type: "bar",
                // height: 350,
                toolbar: { show: false },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    // borderRadius: 6,
                    //   columnWidth: "55%",
                },
            },
            dataLabels: {
                enabled: false,
                style: {
                    colors: ["#333"],
                },
            },
            xaxis: {
                categories: systemCategories, // X-axis categories (Company Common Name)
                title: {
                    text: "Number of Companies",
                    // style: { fontWeight: "bold" },
                },
            },
            yaxis: {
                title: {
                    text: "Return Type",
                    style: { fontWeight: "bold" },
                },
                min: 0,
                // max: Math.ceil(Math.max(...employeeCounts) / 10) * 10, // auto-adjust up to K
                tickAmount: 5,
            },
            colors: ["#396fd3ff"],
            fill: {
                opacity: 1,
                colors: ["#396fd3ff"],
            },
            states: {
                hover: {
                    filter: {
                        type: "none", // 👈 disables the lighten effect
                    },
                },
                active: {
                    filter: {
                        type: "none", // 👈 disables click highlight effect
                    },
                },
            },

            //   title: {
            //     text: "Sum of Employee Count per Payroll Service Type",
            //     align: "center",
            //   },
            //   grid: {
            //     borderColor: "#e7e7e7",
            //     row: {
            //       colors: ["#f3f3f3", "transparent"],
            //       opacity: 0.5,
            //     },
            //   },
        },


    });
    const [ApplicableReturnsCount, setApplicableReturnsCount] = React.useState({
        series: [44, 55, 41],
        options: {
            chart: {
                type: 'donut',
            },
            states: {
                hover: {
                    filter: {
                        type: "none", // 👈 disables the lighten effect
                    },
                },
                active: {
                    filter: {
                        type: "none", // 👈 disables click highlight effect
                    },
                },
            },
            labels: ['Quarterly Return', 'Half Yearly Return', 'Annual Returns'],
            colors: ["#f5d3cc", "#ffb397", "#ff7c4c"],
            fill: {
                opacity: 1,
                colors: ["#f5d3cc", "#ffb397", "#ff7c4c"],
            },
            legend: {
                position: 'top',
                // offsetY: 0,
                // height: 230,

            },
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
        },

    });
    const [escalationRaisedCategoriesByCompany, setEscalationRaisedCategoriesByCompany] = React.useState({

        series: [{
            name: 'Files Successfully',
            data: [44, 55, 41, 37, 22, 43, 21]
        }, {
            name: 'Received late data from KAO',
            data: [53, 32, 33, 52, 13, 43, 32]
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
            },
            colors: ["#2cafc0ff", "#5ad5e2"],
            fill: {
                opacity: 1,
                colors: ["#2cafc0ff", "#5ad5e2"],
            },
            states: {
                hover: {
                    filter: {
                        type: "none", // 👈 disables the lighten effect
                    },
                },
                active: {
                    filter: {
                        type: "none", // 👈 disables click highlight effect
                    },
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    dataLabels: {
                        total: {
                            enabled: true,
                            offsetX: 0,
                            style: {
                                fontSize: '13px',
                                fontWeight: 900
                            }
                        }
                    }
                },
            },
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            title: {
                text: 'Escalation Counts'
            },
            xaxis: {
                categories: ['SBI General Insurance Co Limited', 'Master Builders Solutions India Private Limited', 'Camsdata Technologies India Private Limited', 'Ferrero India Private Limited', 'Viacom 18 Media Pvt Ltd', 'Adani Wilmar Ltd', 'Indusind Bank Limited'],
                labels: {
                    formatter: function (val) {
                        return val + "K"
                    }
                }
            },
            yaxis: {
                title: {
                    text: undefined
                },
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + "K"
                    }
                }
            },

            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40
            }
        },


    });
    const [riskDistributionByState, setRiskDistributionByState] = useState({

        series: [
            {
                name: "sate",
                data: systemEmployeeCounts, // Y-axis values (Sum of sate)
            },
        ],
        options: {
            chart: {
                type: "bar",
                // height: 350,
                toolbar: { show: false },
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    // borderRadius: 6,
                    //   columnWidth: "55%",
                },
            },
            dataLabels: {
                enabled: false,
                style: {
                    colors: ["#333"],
                },
            },
            xaxis: {
                categories: systemCategories, // X-axis categories (Company Common Name)
                title: {
                    text: "Risk Level (%)",
                    // style: { fontWeight: "bold" },
                },
            },
            yaxis: {
                title: {
                    text: "State",
                    style: { fontWeight: "bold" },
                },
                min: 0,
                // max: Math.ceil(Math.max(...employeeCounts) / 10) * 10, // auto-adjust up to K
                tickAmount: 5,
            },
            colors: ["#2b7bf3ff"],
            fill: {
                opacity: 1,
                colors: ["#2b7bf3ff"],
            },
            states: {
                hover: {
                    filter: {
                        type: "none", // 👈 disables the lighten effect
                    },
                },
                active: {
                    filter: {
                        type: "none", // 👈 disables click highlight effect
                    },
                },
            },

            //   title: {
            //     text: "Sum of Employee Count per Payroll Service Type",
            //     align: "center",
            //   },
            //   grid: {
            //     borderColor: "#e7e7e7",
            //     row: {
            //       colors: ["#f3f3f3", "transparent"],
            //       opacity: 0.5,
            //     },
            //   },
        },


    });
    return (
        <div>
            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Comparison of Return Applicability across Companies</div>
                    <Chart
                        options={comparisonOfReturnApplicability.options} series={comparisonOfReturnApplicability.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Frequency-wise distribution of applicable returns, revealing dominant compliance cycles</div>
                    <Chart
                        options={ApplicableReturnsCount.options} series={ApplicableReturnsCount.series} type="donut" height={380}
                    />
                </div>
            </div>
            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Compliance status comparison across different return types, highlighting returns with the highest completion rates.</div>
                    <Chart
                        options={applicableReturnsByLocation.options} series={applicableReturnsByLocation.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Analysis of applicable return names, identifying the most frequently required returns across companies</div>
                    <Chart
                        options={applicableReturnsByState.options} series={applicableReturnsByState.series} type="bar" height={380}
                    />
                </div>
            </div>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Compliance risk distribution by state, identifying regions with elevated compliance risk levels.</div>
                    <Chart
                        options={riskDistributionByState.options} series={riskDistributionByState.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Breakdown of escalation raised categories by company, revealing escalation hotspots</div>
                    <Chart
                        options={escalationRaisedCategoriesByCompany.options} series={escalationRaisedCategoriesByCompany.series} type="bar" height={380}
                    />
                </div>
            </div>

        </div>
    )
}

export default ReturnsAndSubmissions