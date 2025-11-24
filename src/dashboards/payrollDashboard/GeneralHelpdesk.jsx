import React, { useEffect, useMemo } from 'react'
import Chart from 'react-apexcharts';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { fetchTotalCountOfCommunicationTypes } from '../../api/service';

const GeneralHelpdesk = ({ selectedCompany }) => {
    const [closedVsOpenCases, setProportionofcases] = React.useState({
        series: [
            {
                name: "Open Cases",
                data: [30, 40, 35, 50, 20]
            },
            {
                name: "Closed Cases",
                data: [20, 30, 25, 40, 10]
            }
        ],
        options: {
            chart: {
                type: "bar",
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
                text: 'Proportion of Cases Pending'
            },
            xaxis: {
                categories: ['SBI General Insurance Co Limited', 'Master Builders Solutions India Private Limited', 'Camsdata Technologies India Private Limited', 'Ferrero India Private Limited', 'Viacom 18 Media Pvt Ltd'],
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
    const [clientVsGovernmentDelayFlags, setDistributionOfEmployee] = React.useState({
        series: [17, 18],
        options: {
            chart: {
                width: 380,
                type: "donut",
            },
            colors: ["#f5d3cc", "#ffb397",],
            fill: {
                opacity: 1,
                colors: ["#f5d3cc", "#ffb397",],
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

            labels: ["Client", "Karma"],
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
    const [ExcludingTransfer, setExcludingTransfer] = React.useState({

        series: [{
            name: 'Excluding Doc Pending %',
            data: [44, 55, 41, 37, 22, 43, 21]
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                stacked: false,
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
    const [communicationType, setCommunicationType] = React.useState([]);
    const [selectedCharts, setSelectedCharts] = React.useState([]);

    const toggleChartSelection = (id) => {
        setSelectedCharts((prev) =>
            prev.includes(id)
                ? prev.filter(item => item !== id)   // remove if existed
                : [...prev, id]                      // add new ID
        );
    };


    useEffect(() => {
        const fetchData = async () => {
            const [communicationTypeRes] = await Promise.allSettled([
                fetchTotalCountOfCommunicationTypes(selectedCompany),
            ]);
            if (communicationTypeRes.status === 'fulfilled') {
                setCommunicationType(communicationTypeRes.value);
            } else {
                console.warn("fetchAll communication type failed:", communicationTypeRes.reason);
                setCommunicationType(communicationTypeRes.reason?.status || []);
            }
        };
        fetchData();
    }, [selectedCompany]);
    return (
        <div>
            <button
                className="btn btn-primary mb-3"
                onClick={() => console.log("Selected Chart IDs:", selectedCharts)}
            >
                Save
            </button>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <input
                        type="checkbox"
                        className="chart-select-checkbox"
                        onChange={() => toggleChartSelection("chart_closed_open")}
                        checked={selectedCharts.includes("chart_closed_open")}
                    />
                    <div className="mb-3 fw-600">
                        Comparison of closed vs. open cases for top 5 Assigned users
                    </div>

                    <Chart
                        options={closedVsOpenCases.options}
                        series={closedVsOpenCases.series}
                        type="bar"
                        height={380}
                    />
                </div>
                <div className="chart-card">
                    <input
                        type="checkbox"
                        onChange={() => toggleChartSelection("chart_assigned_users")}
                        checked={selectedCharts.includes("chart_assigned_users")}
                    />
                    <div className="mb-3 fw-600">Top 5 Assigned users</div>

                    <Chart
                        options={ExcludingTransfer.options}
                        series={ExcludingTransfer.series}
                        type="bar"
                        height={380}
                    />
                </div>
            </div>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <input
                        type="checkbox"
                        onChange={() => toggleChartSelection("chart_client_karma")}
                        checked={selectedCharts.includes("chart_client_karma")}
                    />
                    <div className="mb-3 fw-600">
                        Documents Pending From Client vs. Karma
                    </div>

                    <Chart
                        options={clientVsGovernmentDelayFlags.options}
                        series={clientVsGovernmentDelayFlags.series}
                        type="donut"
                        height={380}
                    />
                </div>

                <div className="chart-card">
                    <input
                        type="checkbox"
                        onChange={() => toggleChartSelection("chart_issue_status")}
                        checked={selectedCharts.includes("chart_issue_status")}
                    />
                    <div className="mb-3 fw-600">
                        Open and closed issue status by Issue Category
                    </div>

                    <Chart
                        options={closedVsOpenCases.options}
                        series={closedVsOpenCases.series}
                        type="bar"
                        height={380}
                    />
                </div>
            </div>


        </div>
    )
}

export default GeneralHelpdesk