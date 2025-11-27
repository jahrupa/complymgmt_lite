import React, { useEffect, useMemo } from 'react'
import Chart from 'react-apexcharts';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { fetchAssignedIndividualsList, fetchDocumentsPendingFrom, fetchIssueCategoryByStatus, fetchStatusCountOfoOpenVsClosedCases, fetchTotalCountOfCommunicationTypes } from '../../api/service';
import { ArrowUpRight, X } from 'lucide-react';

const GeneralHelpdesk = ({ selectedCompany }) => {
    const [closedVsOpenCases, setClosedVsOpenCases] = React.useState({
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
    const closedVsOpenCasesFormat = {
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
    }
    const [assignedUser, setAssignedUser] = React.useState([]);
    const assignedUserFormat = {
        series: [{
            name: 'Count',
            data: assignedUser?.top_assigned_counts?.map((item) => item.count)
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
            xaxis: {
                categories: assignedUser?.top_assigned_counts?.map((item) => item.assigned_to),
            },
            yaxis: {
                title: {
                    text: undefined
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40
            }
        },
    }
    const [documentPendingFrom, setDocumentPendingFrom] = React.useState([]);
    const documentPendingFromFormat = {
        series: documentPendingFrom?.top_docs_pending?.map((item) => item.count || []) || [],
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
            labels: documentPendingFrom?.top_docs_pending?.map((item) => item.documents_pending_from || []) || [],
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
    }
    const [openVsCloseIssueCategory, setOpenVsCloseIssueCategory] = React.useState([]);
    console.log(openVsCloseIssueCategory,'openVsCloseIssueCategory')
    const openVsCloseIssueCategoryFormat = {
         series:  [{
                name: "Open Cases",
                data: openVsCloseIssueCategory?.top_counts?.map((item) => item.count)
            },
            {
                name: "Closed Cases",
                data: openVsCloseIssueCategory?.top_counts?.map((item) => item.count)
            },],
        options: {
            chart: {
                type: "bar",
                height: 350,
                stacked: true,
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
           
            xaxis: {
                categories: openVsCloseIssueCategory?.top_counts?.map((item) => item.issue_category ||[]) || [],
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
    }
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
            const [stausCountres, assignedUser, documentPendingFormRes, openVsCloseIssueCategory] = await Promise.allSettled([
                fetchStatusCountOfoOpenVsClosedCases(selectedCompany),
                fetchAssignedIndividualsList(selectedCompany),
                fetchDocumentsPendingFrom(selectedCompany),
                fetchIssueCategoryByStatus(selectedCompany),
            ]);

            if (stausCountres.status === 'fulfilled') {
                setClosedVsOpenCases(stausCountres.value);
            } else {
                console.warn("fetchStatusCountOfoOpenVsClosedCases failed:", stausCountres.reason);
                setClosedVsOpenCases(stausCountres.reason?.status || []);
            }

            if (assignedUser.status === 'fulfilled') {
                setAssignedUser(assignedUser.value);
            } else {
                console.warn("fetchAssignedIndividualsList failed:", assignedUser.reason);
                setAssignedUser(assignedUser.reason?.status || []);
            }

            if (documentPendingFormRes.status === 'fulfilled') {
                setDocumentPendingFrom(documentPendingFormRes.value);
            } else {
                console.warn("fetchDocumentsPendingFrom failed:", documentPendingFormRes.reason);
                setDocumentPendingFrom(documentPendingFormRes.reason?.status || []);
            }

            if (openVsCloseIssueCategory.status === 'fulfilled') {
                setOpenVsCloseIssueCategory(openVsCloseIssueCategory.value);
            } else {
                console.warn("fetchIssueCategoryByStatus failed:", openVsCloseIssueCategory.reason);
                setOpenVsCloseIssueCategory(openVsCloseIssueCategory.reason?.status || []);
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
                <div
                    className={`chart-card ${selectedCharts.includes("gh-1") ? "selected-card" : ""}`}
                    onClick={() => toggleChartSelection("gh-1")}
                    style={{ cursor: "pointer" }}
                >
                    <div className='d-flex justify-content-end align-items-center' onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            className="chart-select-checkbox"
                            onChange={() => toggleChartSelection("gh-1")}
                            checked={selectedCharts.includes("gh-1")}
                        />
                        <div className='dashboard-icon ms-2'>
                            <ArrowUpRight />
                        </div>
                        <div className='dashboard-icon me-2 ms-1'>
                            <X />
                        </div>
                    </div>

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
                        options={assignedUserFormat.options}
                        series={assignedUserFormat.series}
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
                        options={documentPendingFromFormat.options}
                        series={documentPendingFromFormat.series}
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
                        options={openVsCloseIssueCategoryFormat.options}
                        series={openVsCloseIssueCategoryFormat.series}
                        type="bar"
                        height={380}
                    />
                </div>
            </div>


        </div>
    )
}

export default GeneralHelpdesk