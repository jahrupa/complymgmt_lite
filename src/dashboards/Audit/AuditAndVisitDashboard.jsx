import React, { useEffect } from 'react'
import Chart from 'react-apexcharts';
import { fetchAuditByServiceType, fetchAuditMeetingSLAByResponsibleTeam, fetchAuditPlatformsCountByStateSegmented, fetchAuditStatusByCompany, fetchRiskLevelBasedOnServiceType } from '../../api/service';

const AuditAndVisitDashboard = ({ selectedCompany }) => {
    const [AuditCountByServiceType, setAuditCountByServiceType] = React.useState([]);
    const AuditCountByServiceTypeFormat = {
        series: [{
            name: 'Audit Count',
            data: AuditCountByServiceType?.top_counts?.map(item => item.count) || []
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

            xaxis: {
                categories: AuditCountByServiceType?.top_counts?.map(item => item.service_type) || [],
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
    };
    const [AuditCountByStateSegmented, setAuditCountByStateSegmented] = React.useState([]);
    const data = AuditCountByStateSegmented?.top_count || [];

    // Collect all keys except "state"
    const keys = data.length > 0
        ? Object.keys(data[0]).filter(k => k !== "state")
        : [];

    // Function to convert any key into readable series name
    const cleanName = (key) => {
        return key
            // remove prefix count_
            .replace(/^count_/, "")
            // remove suffix _count    
            .replace(/_count$/, "")
            // remove any middle count_    
            .replace(/count_/g, "")
            // replace _ with space    
            .replace(/_/g, " ")
            .toUpperCase();
    };

    // Create dynamic series
    const series = keys.map(key => ({
        name: cleanName(key),
        data: data.map(item => item[key] || 0)
    }));
    const AuditCountByStateSegmentedFormat = {
        series: series,
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
                categories: AuditCountByStateSegmented?.top_counts?.map(item => item.state) || [],
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
    };
    const [AuditPercentageMeetingSLA, setAuditPercentageMeetingSLA] = React.useState([]);
    const AuditPercentageMeetingSLAFormat = {
        series: [{
            name: 'SLA Met (Y)',
            data: AuditPercentageMeetingSLA?.map(item => item.count_y) || []
        },
        {
            name: 'SLA Met (N)',
            data: AuditPercentageMeetingSLA?.map(item => item.count_n) || []
        },],
        options: {
            chart: {
                type: 'bar',
                height: 350,
            },
            colors: ["#5ad5e2", "#f4b841"],
            fill: {
                opacity: 1,
                colors: ["#5ad5e2", "#f4b841"],
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
                categories: AuditPercentageMeetingSLA?.map(item => item.responsible_team) || []
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
    };
    const [ChecklistApprovalRateByCompanyName, setChecklistApprovalRateByCompanyName] = React.useState([]);
    const ChecklistApprovalRateByCompanyNameFormat = {
        series: [{
            name: 'Approval Rate',
            data: ChecklistApprovalRateByCompanyName?.top_counts?.map(item => item.checklist_rate) || []
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
            xaxis: {
                categories: ChecklistApprovalRateByCompanyName?.top_counts?.map(item => item.company_name) || [],
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
    };
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
    const [RiskLevelBreakdownByServiceType, setRiskLevelBreakdownByServiceType] = React.useState([]);
    const RiskLevelBreakdownByServiceTypeFormat = {
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
        {
            name: 'Empty',
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
        }
    }
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

    useEffect(() => {
        const fetchData = async () => {
            const [auditRes, auditSlaRes, auditPlatformsCountByStateSegmentedRes, auditStatusByCompanyRes, riskLevelRes] = await Promise.allSettled([
                fetchAuditByServiceType(selectedCompany),
                fetchAuditMeetingSLAByResponsibleTeam(selectedCompany),
                // need to intrgrate in chart
                fetchAuditPlatformsCountByStateSegmented(selectedCompany),
                fetchAuditStatusByCompany(selectedCompany),
                fetchRiskLevelBasedOnServiceType(selectedCompany),
            ]);
            if (auditRes.status === 'fulfilled') {
                setAuditCountByServiceType(auditRes.value);
            } else {
                console.warn("fetchAll audit failed:", auditRes.reason);
                setAuditCountByServiceType(auditRes.reason?.status || []);
            }
            if (auditSlaRes.status === 'fulfilled') {
                setAuditPercentageMeetingSLA(auditSlaRes.value);
            } else {
                console.warn("fetchAll audit failed:", auditSlaRes.reason);
                setAuditPercentageMeetingSLA(auditSlaRes.reason?.status || []);
            }
            if (auditPlatformsCountByStateSegmentedRes.status === 'fulfilled') {
                setAuditCountByStateSegmented(auditPlatformsCountByStateSegmentedRes.value);
            } else {
                console.warn("fetchAll audit failed:", auditPlatformsCountByStateSegmentedRes.reason);
                setAuditCountByStateSegmented(auditPlatformsCountByStateSegmentedRes.reason?.status || []);
            }
            if (auditStatusByCompanyRes.status === 'fulfilled') {
                setChecklistApprovalRateByCompanyName(auditStatusByCompanyRes.value);
            } else {
                console.warn("fetchAll audit failed:", auditStatusByCompanyRes.reason);
                setChecklistApprovalRateByCompanyName(auditStatusByCompanyRes.reason?.status || []);
            }
            if (riskLevelRes.status === 'fulfilled') {
                setRiskLevelBreakdownByServiceType(riskLevelRes.value);
            } else {
                console.warn("fetchAll audit failed:", riskLevelRes.reason);
                setRiskLevelBreakdownByServiceType(riskLevelRes.reason?.status || []);
            }

        };
        fetchData();
    }, [selectedCompany]);
    return (
        <div>
            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Top 5 audit count by Service Type across all companies</div>
                    <Chart
                        options={AuditCountByServiceTypeFormat.options} series={AuditCountByServiceTypeFormat.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Audit count by State segmented by Audit Platform</div>
                    <Chart
                        options={AuditCountByStateSegmentedFormat.options} series={AuditCountByStateSegmentedFormat.series} type="bar" height={380}
                    />
                </div>
            </div>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Percentage of audits meeting SLA by Responsible Team</div>
                    <Chart
                        options={AuditPercentageMeetingSLAFormat.options} series={AuditPercentageMeetingSLAFormat.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Checklist approval rate by Companyt Name </div>
                    <Chart
                        options={ChecklistApprovalRateByCompanyNameFormat.options} series={ChecklistApprovalRateByCompanyNameFormat.series} type="bar" height={380}
                    />
                </div>
            </div>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Distribution of Key Observations by Audit Scope (here we need to show all risk levels sum)</div>
                    <Chart
                        options={DistributionOfKeyObservationsByAuditScope.options} series={DistributionOfKeyObservationsByAuditScope.series} type="donut" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Checklist approval rate by Auditor Name (duplicate chart)</div>
                    {/* <Chart
                        options={ChecklistApprovalRateByCompanyName.options} series={ChecklistApprovalRateByCompanyName.series} type="bar" height={380}
                    /> */}
                </div>
            </div>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Risk Level breakdown by Service Type</div>
                    <Chart
                        options={RiskLevelBreakdownByServiceTypeFormat.options} series={RiskLevelBreakdownByServiceTypeFormat.series} type="bar" height={380}
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