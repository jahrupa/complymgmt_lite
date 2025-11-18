import React from 'react'
import Chart from 'react-apexcharts';

const NoticeDashboard = () => {
    const [NoticeDistributionByAuthority, setNoticeDistributionByAuthority] = React.useState({

        series: [{
            name: 'Notice Count',
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
                text: 'Notice Count',
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
    const [NoticeCountByStateSegmented, setNoticeCountByStateSegmented] = React.useState({
        series: [{
            name: 'Notice Count',
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
                text: 'Notice Count',
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
    const [numberOfNoticesAssignedToEachTeamMember, setNumberOfNoticesAssignedToEachTeamMember] = React.useState({

        series: [{
            name: 'Number of Notices Assigned',
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
                text: 'Number of Notices Assigned',
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
    const [acknowledgementRatesByIndividual, setAcknowledgementRatesByIndividual] = React.useState({

        series: [{
            name: 'Acknowledgement Rates',
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
                text: 'Acknowledgement Rates',
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
    const [ApplicableActsAnalysis, setApplicableActsAnalysis] = React.useState({

        series: [{
            name: 'Applicable Acts Count',
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
                text: 'Applicable Acts Count',
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
    const [noticeTypeBreakdown, setNoticeTypeBreakdown] = React.useState({
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
    const [responseStatusDistribution, setResponseStatusDistribution] = React.useState({
        series: [17, 18, 30, ],
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

            labels: ["Filed", "IN Progress", "No", ],
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
  
    const [clientDocumentSubmission, setClientDocumentSubmission] = React.useState({
        series: [17, 18],
        options: {
            chart: {
                width: 380,
                type: "donut",
            },
            colors: ["#2dd4bf", "#5eead4"],
            fill: {
                opacity: 1,
                colors: ["#14b8a6", "#2dd4bf"],
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

            labels: ["Yes", "No"],
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
    return (
        <div>
            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Distribution of notices across different authorities to identify which regulatory bodies are most active.</div>
                    <Chart
                        options={NoticeDistributionByAuthority.options} series={NoticeDistributionByAuthority.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">State-wise notice count comparison to highlight regional compliance activity.</div>
                    <Chart
                        options={NoticeCountByStateSegmented.options} series={NoticeCountByStateSegmented.series} type="bar" height={380}
                    />
                </div>
            </div>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Breakdown of notice types to show the most common compliance actions</div>
                    <Chart
                        options={noticeTypeBreakdown.options} series={noticeTypeBreakdown.series} type="donut" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Analysis of applicable acts to reveal legal focus areas</div>
                    <Chart
                        options={ApplicableActsAnalysis.options} series={ApplicableActsAnalysis.series} type="bar" height={380}
                    />
                </div>
            </div>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Number of notices assigned to each team member to assess workload distribution</div>
                    <Chart
                        options={numberOfNoticesAssignedToEachTeamMember.options} series={numberOfNoticesAssignedToEachTeamMember.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Comparison of acknowledgement rates by different individuals to evaluate responsiveness.</div>
                    <Chart
                        options={acknowledgementRatesByIndividual.options} series={acknowledgementRatesByIndividual.series} type="bar" height={380}
                    />
                </div>
            </div>
            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Distribution of response status to track resolution progress</div>
                    <Chart
                        options={responseStatusDistribution.options} series={responseStatusDistribution.series} type="donut" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Proportion of notices with client document submission (Y/N) to measure client engagement.</div>
                    <Chart
                        options={clientDocumentSubmission.options} series={clientDocumentSubmission.series} type="donut" height={380}
                    />
                </div>
            </div>
        </div>
    )
}

export default NoticeDashboard