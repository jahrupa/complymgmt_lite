import React, { useEffect, useMemo } from 'react'
import Chart from 'react-apexcharts';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { fetchHelpdeskStatusBasedOnIssueSubType, fetchHelpdeskTicketsRaisedByCompany, fetchTicketsDistributionAssignedToCount, fetchTotalCountOfCommunicationTypes } from '../../api/service';

ModuleRegistry.registerModules([AllCommunityModule]);
const HelpdeskAndEscalations = ({ selectedCompany }) => {
    const [closedVsOpenCases, setCloseVsOpenCases] = React.useState([]);
    const closeVsOpenIssueFormat = {
        series: [
            {
                name: 'Closed Cases',
                data: closedVsOpenCases?.top_issue_sub_type_status?.map(
                    (item) => item.count_Closed ?? 0
                ) || [],
            },
            {
                name: 'Total Open Cases',
                data: closedVsOpenCases?.top_issue_sub_type_status?.map(
                    (item) => item.count_Open ?? 0
                ) || [],
            }
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
                    filter: { type: "none" },
                },
                active: {
                    filter: { type: "none" },
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    dataLabels: {
                        total: {
                            enabled: true,
                            offsetX: 0,
                            style: { fontSize: '13px', fontWeight: 900 }
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
                categories: closedVsOpenCases?.top_issue_sub_type_status?.map(
                    (item) => item.issue_sub_type ?? ""
                ) || [],
                title: {
                    text: 'Issue Sub-Types'
                },
            },
            yaxis: {
                title: {
                    text: 'closed vs. open cases'
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40
            }
        }
    }

    const [ProportionOfCases, setProportionofcases] = React.useState({
        series: [
            {
                name: "Pending from Department",
                data: [30, 40, 35, 50, 20]
            },
            {
                name: "Pending from Client",
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
        series: [17, 18, 5],
        options: {
            chart: {
                width: 380,
                type: "pie",
            },
            colors: ["#cfa4f080", "#e8a8ee", "#a16ade80"],
            fill: {
                opacity: 1,
                colors: ["#cfa4f080", "#e8a8ee", "#a16ade80"],
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

            labels: ["Yes", "No", "Null"],
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
    const [ticketDistribution, setTicketDistribution] = React.useState([]);
    const ticketDistributionFormat = {
        series: [{
            name: 'Excluding Doc Pending %',
            data: ticketDistribution?.top_assigned_to_counts?.map((item) => item.count || []) || [],
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
                categories: ticketDistribution?.top_assigned_to_counts?.map((item) => item.assigned_to || []) || [],
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
            // // tooltip: {
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
    }
    const [communicationType, setCommunicationType] = React.useState([]);
    const communicationTypeFormat = {
        series: [{
            name: 'Number of Tickets',
            data: communicationType?.map((item) => item.count || []) || [],
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
                text: 'Number of Tickets'
            },
            xaxis: {
                categories: communicationType?.map((item) => item.communication_type || []) || [],
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
            tooltip: {
                // y: {
                //     formatter: function (val) {
                //         return val + "K"
                //     }
                // }
            },

            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40
            }
        },
    }
    const [helpdeskTicketsRaisedByCompany, setHelpdeskTicketsRaisedByCompany] = React.useState([]);
    const helpdeskTicketsRaisedByCompanyFormat = {
        series: helpdeskTicketsRaisedByCompany?.top_company_tickets_count?.map((item) => item.count || []) || [],
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

            tooltip: {
                theme: 'light', // makes all tooltip text black
                style: {
                    fontSize: '12px',
                    color: '#000',
                }
            },

            // ⭐ Label (value & name) text color black
            dataLabels: {
                enabled: true,
                style: {
                    // colors: ['#000'], // text black
                }
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: false,
                            name: {
                                color: '#000'
                            },
                            value: {
                                color: '#000'
                            },
                            total: {
                                color: '#000'
                            }
                        }
                    }
                }
            },
            states: {
                hover: {
                    filter: { type: "none" },
                },
                active: {
                    filter: { type: "none" },
                }
            },

            labels: helpdeskTicketsRaisedByCompany?.top_company_tickets_count?.map((item) => item.company_common_name || []) || [],
            legend: {
                position: "top",
                horizontalAlign: "center",
                fontSize: "14px",
                markers: { radius: 12 },
                labels: { colors: "#333" },
            },

            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: { width: 250 },
                        legend: { position: "bottom" },
                    },
                },
            ],
        },
    };

    const columnDefs = useMemo(
        () => [
            { headerName: "percentage of claims that have been settled", field: "settled", sortable: true, filter: true, flex: '1' },
            { headerName: "percentage of claims that are still pending", field: "pending", sortable: true, filter: true, flex: '1' },
        ],
        []
    );
    const oldClaimData = [
        {
            "settled": 2053,
            "pending": 1
        },
        {
            "settled": 528,
            "pending": 1
        },
        {
            "settled": 401,
            "pending": 2
        }
    ]


    useEffect(() => {
        const fetchData = async () => {
            const [communicationTypeRes, helpdeskTicketsRes, helpdeskStatusRes, ticketsDistributionRes] = await Promise.allSettled([
                fetchTotalCountOfCommunicationTypes(selectedCompany),
                fetchHelpdeskTicketsRaisedByCompany(selectedCompany),
                fetchHelpdeskStatusBasedOnIssueSubType(selectedCompany),
                fetchTicketsDistributionAssignedToCount(selectedCompany),
            ]);
            if (communicationTypeRes.status === 'fulfilled') {
                setCommunicationType(communicationTypeRes.value);
            } else {
                console.warn("fetchAll communication type failed:", communicationTypeRes.reason);
                setCommunicationType(communicationTypeRes.reason?.status || []);
            }
            if (helpdeskTicketsRes.status === 'fulfilled') {
                setHelpdeskTicketsRaisedByCompany(helpdeskTicketsRes.value);
            } else {
                console.warn("fetchAll helpdesk tickets failed:", helpdeskTicketsRes.reason);
                setHelpdeskTicketsRaisedByCompany(helpdeskTicketsRes.reason?.status || []);
            }
            if (helpdeskStatusRes.status === 'fulfilled') {
                setCloseVsOpenCases(helpdeskStatusRes.value);
            } else {
                console.warn("fetchAll helpdesk status failed:", helpdeskStatusRes.reason);
                setCloseVsOpenCases(helpdeskStatusRes.reason?.status || []);
            }
            if (ticketsDistributionRes.status === 'fulfilled') {
                setTicketDistribution(ticketsDistributionRes.value);
            } else {
                console.warn("fetchAll tickets distribution failed:", ticketsDistributionRes.reason);
                setTicketDistribution(ticketsDistributionRes.reason?.status || []);
            }
        };
        fetchData();
    }, [selectedCompany]);
    return (
        <div>
            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Proportion of cases pending from department vs. pending from client for selected Issue Sub-Types in PF_ESIC_Helpdesk</div>
                    <Chart
                        options={ProportionOfCases.options} series={ProportionOfCases.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Comparison of closed vs. open cases for top 5 Issue Sub-Types in PF_ESIC_Helpdesk</div>
                    <Chart
                        options={closeVsOpenIssueFormat.options} series={closeVsOpenIssueFormat.series} type="bar" height={380}
                    />
                </div>
            </div>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Analysis of client vs. government delay flags for open tickets in PF_ESIC_Helpdesk</div>
                    <Chart
                        options={clientVsGovernmentDelayFlags.options} series={clientVsGovernmentDelayFlags.series} type="pie" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Excluding Transfer % compared to Excluding Doc Pending % for recent claim periods in Summary Old Claim Data</div>
                    {/* <Chart
                        options={ExcludingTransfer.options} series={ExcludingTransfer.series} type="bar" height={380}
                    /> */}
                </div>
            </div>

            <div className="table_div p-3 mb-4">
                <div className="ag-theme-quartz" style={{ height: '300px', width: '100%', }}>
                    <div className=" fw-600">
                        Settled Claim % vs. Total Pending % over time in Summary Old Claim Data
                    </div>
                    <AgGridReact
                        theme="legacy"
                        rowData={oldClaimData}
                        columnDefs={columnDefs}
                        pagination={true}
                        paginationPageSize={5}
                    />
                </div>
            </div>


            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Number of tickets by Communication Type in PF_ESIC_Helpdesk</div>
                    <Chart
                        options={communicationTypeFormat.options} series={communicationTypeFormat.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Ticket distribution by Assigned To for top 5 users in PF_ESIC_Helpdesk</div>
                    <Chart
                        options={ticketDistributionFormat.options} series={ticketDistributionFormat.series} type="bar" height={380}
                    />
                </div>
            </div>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Ticket volume by State for PF, ESIC, and LWF categories in PF_ESIC_Helpdesk</div>
                    <Chart
                        options={ExcludingTransfer.options} series={ExcludingTransfer.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Top 5 companies by total helpdesk tickets raised in PF_ESIC_Helpdesk</div>
                    <Chart
                        options={helpdeskTicketsRaisedByCompanyFormat.options} series={helpdeskTicketsRaisedByCompanyFormat.series} type="donut" height={380}
                    />
                </div>
            </div>
        </div>
    )
}

export default HelpdeskAndEscalations