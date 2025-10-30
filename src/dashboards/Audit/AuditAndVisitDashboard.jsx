import React from 'react'
import Chart from 'react-apexcharts';

const AuditAndVisitDashboard = () => {
    const [AuditCountByServiceType, setAuditCountByServiceType] = React.useState({

        series: [{
            name: 'Audit Count',
            data: [44, 55, 41, 37, 22, 43, 21]
        },],
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
                text: 'Audit Count',
            },
            xaxis: {
                categories: ['SBI General Insurance Co Limited', 'Master Builders Solutions India Private Limited', 'Camsdata Technologies India Private Limited', 'Ferrero India Private Limited', 'Viacom 18 Media Pvt Ltd', 'Adani Wilmar Ltd', 'Indusind Bank Limited'],
                // labels: {
                //     formatter: function (val) {
                //         return val + "K"
                //     }
                // }
            },
            yaxis: {
                title: {
                    text: undefined
                },
            },
            // tooltip: {
            //     y: {
            //         formatter: function (val) {
            //             return val + "K"
            //         }
            //     }
            // },

            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40
            }
        },


    });
    const [AuditCountByStateSegmented, setAuditCountByStateSegmented] = React.useState({

        series: [{
            name: 'Both',
            data: [44, 55, 41, 37, 22, 43, 21]
        }, {
            name: 'Excel',
            data: [53, 32, 33, 52, 13, 43, 32]
        }, {
            name: 'JLL Overview Portal',
            data: [53, 32, 33, 52, 13, 43, 32]
        },
        {
            name: 'WeChecked',
            data: [53, 32, 33, 52, 13, 43, 32]
        }
        ],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
            },
            colors: ["#2cafc0ff", "#5ad5e2", "#f4b841", "#f45b5b"],
            fill: {
                opacity: 1,
                colors: ["#2cafc0ff", "#5ad5e2", "#f4b841", "#f45b5b"],
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
                    horizontal: true,
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
                // labels: {
                //     formatter: function (val) {
                //         return val + "K"
                //     }
                // }
            },
            yaxis: {
                title: {
                    text: undefined
                },
            },
            // tooltip: {
            //     y: {
            //         formatter: function (val) {
            //             return val + "K"
            //         }
            //     }
            // },

            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40
            }
        },


    });
    const [AuditPercentageMeetingSLA, setAuditPercentageMeetingSLA] = React.useState({

        series: [{
            name: 'SLA Met Percentage',
            data: [44, 55, 41,]
        },],
        options: {
            chart: {
                type: 'bar',
                height: 350,
            },
            colors: ["#5ad5e2"],
            fill: {
                opacity: 1,
                colors: ["#5ad5e2"],
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
                    horizontal: true,
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
                text: 'SLA Met Percentage',
            },
            xaxis: {
                categories: ['SBI General Insurance Co Limited', 'Master Builders Solutions India Private Limited', 'Camsdata Technologies India Private Limited',],
                // labels: {
                //     formatter: function (val) {
                //         return val + "K"
                //     }
                // }
            },
            yaxis: {
                title: {
                    text: undefined
                },
            },
            // tooltip: {
            //     y: {
            //         formatter: function (val) {
            //             return val + "K"
            //         }
            //     }
            // },

            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40
            }
        },


    });
    const [ChecklistApprovalRateByAuditorName, setChecklistApprovalRateByAuditorName] = React.useState({

        series: [{
            name: 'Approval Rate (%)',
            data: [44, 55, 41, 37, 22, 43, 21]
        },],
        options: {
            chart: {
                type: 'bar',
                height: 350,
            },
            colors: ["#5ad5e2"],
            fill: {
                opacity: 1,
                colors: ["#5ad5e2"],
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
                text: 'Approval Rate (%)',
            },
            xaxis: {
                categories: ['Auditor 1', 'Auditor 2', 'Auditor 3', 'Auditor 4', 'Auditor 5', 'Auditor 6', 'Auditor 7'],
                // labels: {
                //     formatter: function (val) {
                //         return val + "K"
                //     }
                // }
            },
            yaxis: {
                title: {
                    text: undefined
                },
            },
            // tooltip: {
            //     y: {
            //         formatter: function (val) {
            //             return val + "K"
            //         }
            //     }
            // },

            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40
            }
        },


    });
    const [DistributionOfKeyObservationsByAuditScope, setDistributionOfKeyObservationsByAuditScope] = React.useState({
        series: [17, 18, 30, 20, 25],
        options: {
            chart: {
                width: 380,
                type: "donut",
            },
            colors: ["#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#c8fdf1ff"],
            fill: {
                opacity: 1,
                colors: ["#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#c8fdf1ff"],

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

            labels: ["Process", "Compliance", "Financial", "Operational", "IT Security"],
            legend: {
                position: "top", // 👈 moves Yes/No below the chart
                horizontalAlign: "center",
                fontSize: "14px",
                markers: {
                    radius: 12,
                },
                labels: {
                    colors: "#333",
                },
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 250,
                        },
                        legend: {
                            position: "bottom",
                        },
                    },
                },
            ],
        },
    });
    const [RiskLevelBreakdownByServiceType, setRiskLevelBreakdownByServiceType] = React.useState({
        
        series: [{
            name: 'High',
            data: [44, 55, 41, 37, 22, 43, 21]
        },
        {
            name: 'Medium',
            data: [53, 32, 33, 52, 13, 43, 32]
        },
        {
            name: 'Low',
            data: [12, 17, 11, 9, 15, 11, 20]
        },

    ],
        options: {
            chart: {
                type: 'bar',
                height: 350,
            },
            colors: ["#2cafc0ff", "#5ad5e2", "#f4b841"],
            fill: {
                opacity: 1,
                colors: ["#2cafc0ff", "#5ad5e2", "#f4b841"],
            },
            states: {
                hover: {
                    filter: {
                        type: "none", // 👈 disables the lighten effect
                    }
                }
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
                text: 'Risk Level Breakdown',
            },
            xaxis: {
                categories: ['SBI General Insurance Co Limited', 'Master Builders Solutions India Private Limited', 'Camsdata Technologies India Private Limited', 'Ferrero India Private Limited', 'Viacom 18 Media Pvt Ltd', 'Adani Wilmar Ltd', 'Indusind Bank Limited'],
            },
            yaxis: {
                title: {
                    text: undefined
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40,
            },
            // tooltip: {
            //     y: {
            //         formatter: function (val) {
            //             return val + "K"
            //         }
            //     },
            //     marker: {
            //         show: true
            //     }
            // }
        }
    });
    const [EscalationTriggeredByState, setEscalationTriggeredByState] = React.useState({
        series: [{
            name: 'Escalation Triggered - Yes',
            data: [44, 55, 41, 37, 22, 43, 21]
        },
        {
            name: 'Escalation Triggered - No',
            data: [53, 32, 33, 52, 13, 43, 32]
        },

    ],
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
                    }
                }
            },
            plotOptions: {
                bar: {
                    horizontal: true,
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
                text: 'Escalation Triggered by State',
            },
            xaxis: {
                categories: ['SBI General Insurance Co Limited', 'Master Builders Solutions India Private Limited', 'Camsdata Technologies India Private Limited', 'Ferrero India Private Limited', 'Viacom 18 Media Pvt Ltd', 'Adani Wilmar Ltd', 'Indusind Bank Limited'],
            },
            yaxis: {
                title: {
                    text: undefined
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40,
            },
        }
    });

    return (
        <div>
            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Audit count by Service Type across all companies</div>
                    <Chart
                        options={AuditCountByServiceType.options} series={AuditCountByServiceType.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Audit count by State segmented by Audit Platform</div>
                    <Chart
                        options={AuditCountByStateSegmented.options} series={AuditCountByStateSegmented.series} type="bar" height={380}
                    />
                </div>
            </div>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Percentage of audits meeting SLA by Responsible Team</div>
                    <Chart
                        options={AuditPercentageMeetingSLA.options} series={AuditPercentageMeetingSLA.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Checklist approval rate by Auditor Name</div>
                    <Chart
                        options={ChecklistApprovalRateByAuditorName.options} series={ChecklistApprovalRateByAuditorName.series} type="bar" height={380}
                    />
                </div>
            </div>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Distribution of Key Observations by Audit Scope</div>
                    <Chart
                        options={DistributionOfKeyObservationsByAuditScope.options} series={DistributionOfKeyObservationsByAuditScope.series} type="donut" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Checklist approval rate by Auditor Name</div>
                    <Chart
                        options={ChecklistApprovalRateByAuditorName.options} series={ChecklistApprovalRateByAuditorName.series} type="bar" height={380}
                    />
                </div>
            </div>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Risk Level breakdown by Service Type</div>
                    <Chart
                        options={RiskLevelBreakdownByServiceType.options} series={RiskLevelBreakdownByServiceType.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Escalation Triggered (Y/N) rate by State</div>
                    <Chart
                        options={EscalationTriggeredByState.options} series={EscalationTriggeredByState.series} type="bar" height={380}
                    />
                </div>
            </div>
        </div>
    )
}

export default AuditAndVisitDashboard