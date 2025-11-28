import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts';
import { fetchAnalysisOfApplicableAct, fetchAuthorityDistributionCount, fetchCountOfAcknowledgmentRates, fetchCountOfClientDocSubmission, fetchDistributionOfResponseStatus, fetchNoticesAssignedTo, fetchStateWiseNoticeCount, fetchTypesOfNoticeOrInspection } from '../../api/service';
import DashboardDrawerGrid from '../DashboardDrawer';
import { ArrowUpRight, X } from 'lucide-react';

const NoticeDashboard = ({ selectedCompany }) => {
    const [NoticeDistributionByAuthority, setNoticeDistributionByAuthority] = React.useState([]);
    const NoticeDistributionByAuthorityFormat = {
        series: [{
            name: 'Notice Count',
            data: NoticeDistributionByAuthority?.map(item => item.count) || []
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
                categories: NoticeDistributionByAuthority?.map(item => item.authority) || []
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
    const [stateWiseNoticeCount, setStateWiseNoticeCount] = React.useState([]);
    const stateWiseNoticeCountFormat = {
        series: [{
            name: 'Notice Count',
            data: stateWiseNoticeCount?.top_counts?.map(item => item.count) || []
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
                categories: stateWiseNoticeCount?.top_counts?.map(item => item.state) || [],
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
    const [noticeTypeBreakdown, setNoticeTypeBreakdown] = React.useState([]);
    const noticeTypeBreakdownFormat = {
        series: noticeTypeBreakdown?.map(item => item.count) || [],
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

            labels: noticeTypeBreakdown?.map(item => item.type_of_notice_inspection) || [],
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
    const [ApplicableActsAnalysis, setApplicableActsAnalysis] = React.useState([]);
    const ApplicableActsAnalysisFormat = {
        series: [{
            name: 'Applicable Acts Count',
            data: ApplicableActsAnalysis?.top_counts?.map(item => item.count) || []
        },],
        options: {
            chart: {
                type: 'bar',
                height: 350,
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
                categories: ApplicableActsAnalysis?.top_counts?.map(item => item.applicable_act) || [],
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
    const [numberOfNoticesAssignedToEachTeamMember, setNumberOfNoticesAssignedToEachTeamMember] = React.useState([]);
    const numberOfNoticesAssignedToEachTeamMemberFormat = {
        series: [{
            name: 'Number of Notices Assigned',
            data: numberOfNoticesAssignedToEachTeamMember?.top_counts?.map(item => item.count) || []
        },],
        options: {
            chart: {
                type: 'bar',
                height: 350,
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
                categories: numberOfNoticesAssignedToEachTeamMember?.top_counts?.map(item => item.assigned_to) || [],
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
    const [countOfAcknowledgmentRates, setCountOfAcknowledgmentRates] = React.useState([]);
    const countOfAcknowledgmentRatesFormat = {
        series: [{
            name: 'Acknowledgement Rates',
            data: countOfAcknowledgmentRates?.top_counts?.map(item => item.count) || []
        },],
        options: {
            chart: {
                type: 'bar',
                height: 350,
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
                categories: countOfAcknowledgmentRates?.top_counts?.map(item => item.acknowledged_by) || [],
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
    }

    const [distributionOfResponseStatus, setDistributionOfResponseStatus] = React.useState([]);
    const distributionOfResponseStatusFormat = {
        series: distributionOfResponseStatus?.map(item => item.count) || [],
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

            labels: distributionOfResponseStatus?.map(item => item.response_status) || [],
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
    const [clientDocumentSubmission, setClientDocumentSubmission] = React.useState([]);
    const clientDocumentSubmissionFormat = {
        series: clientDocumentSubmission?.map(item => item.count) || [],
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

            labels: clientDocumentSubmission?.map(item => item.doc_submission_by_client) || [],
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


    const [selectedCharts, setSelectedCharts] = React.useState([]);
    const toggleChartSelection = (id) => {
        setSelectedCharts((prev) =>
            prev.includes(id)
                ? prev.filter(item => item !== id)   // remove if existed
                : [...prev, id]                      // add new ID
        );
    };
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [drawerAnchor, setDrawerAnchor] = React.useState("right");
    const [drawerTitle, setDrawerTitle] = useState("");
    const [drawerData, setDrawerData] = useState("");
    const [chartXaxisCategory, setChartXaxisCategory] = React.useState("");
    const handleOpenDrawer = (anchor, title, data = [], chartXaxisCategory) => {
        setDrawerAnchor(anchor);
        setDrawerTitle(title);
        setDrawerOpen(true);
        setDrawerData(data);
        setChartXaxisCategory(chartXaxisCategory);
    };

    useEffect(() => {
        const fetchData = async () => {
            const [noticeDistributionByAuthorityRes, stateWiseNoticeCountRes, typesOfNoticeOrInspectionRes, analysisOfApplicableActRes, noticesAssignedToRes, countOfAcknowledgmentRates, distributionOfResponseStatus, countOfClientDocSubmission] = await Promise.allSettled([
                fetchAuthorityDistributionCount(selectedCompany),
                fetchStateWiseNoticeCount(selectedCompany),
                fetchTypesOfNoticeOrInspection(selectedCompany),
                fetchAnalysisOfApplicableAct(selectedCompany),
                fetchNoticesAssignedTo(selectedCompany),
                fetchCountOfAcknowledgmentRates(selectedCompany),
                fetchDistributionOfResponseStatus(selectedCompany),
                fetchCountOfClientDocSubmission(selectedCompany),
            ]);
            if (noticeDistributionByAuthorityRes.status === 'fulfilled') {
                setNoticeDistributionByAuthority(noticeDistributionByAuthorityRes.value);
            } else {
                console.warn("fetch notice distribution by authority failed:", noticeDistributionByAuthorityRes.reason);
                // Optionally set to empty or default data on failure
                setNoticeDistributionByAuthority(noticeDistributionByAuthorityRes.reason?.status || []);
            }
            if (stateWiseNoticeCountRes.status === 'fulfilled') {
                setStateWiseNoticeCount(stateWiseNoticeCountRes.value);
            } else {
                console.warn("fetch state wise notice count failed:", stateWiseNoticeCountRes.reason);
                // Optionally set to empty or default data on failure
                setStateWiseNoticeCount(stateWiseNoticeCountRes.reason?.status || []);
            }
            if (typesOfNoticeOrInspectionRes.status === 'fulfilled') {
                setNoticeTypeBreakdown(typesOfNoticeOrInspectionRes.value);
            } else {
                console.warn("fetch types of notice or inspection failed:", typesOfNoticeOrInspectionRes.reason);
                setNoticeTypeBreakdown(typesOfNoticeOrInspectionRes.reason?.status || []);
            }
            if (analysisOfApplicableActRes.status === 'fulfilled') {
                setApplicableActsAnalysis(analysisOfApplicableActRes.value);
            } else {
                console.warn("fetch analysis of applicable act failed:", analysisOfApplicableActRes.reason);
                setApplicableActsAnalysis(analysisOfApplicableActRes.reason?.status || []);
            }
            if (noticesAssignedToRes.status === 'fulfilled') {
                setNumberOfNoticesAssignedToEachTeamMember(noticesAssignedToRes.value);
            } else {
                console.warn("fetch notices assigned to failed:", noticesAssignedToRes.reason);
                setNumberOfNoticesAssignedToEachTeamMember(noticesAssignedToRes.reason?.status || []);
            }
            if (countOfAcknowledgmentRates.status === 'fulfilled') {
                setCountOfAcknowledgmentRates(countOfAcknowledgmentRates.value);
            } else {
                console.warn("fetch count of acknowledgment rates failed:", countOfAcknowledgmentRates.reason);
                setCountOfAcknowledgmentRates(countOfAcknowledgmentRates.reason?.status || []);
            }
            if (distributionOfResponseStatus.status === 'fulfilled') {
                setDistributionOfResponseStatus(distributionOfResponseStatus.value);
            } else {
                console.warn("fetch distribution of response status failed:", distributionOfResponseStatus.reason);
                setDistributionOfResponseStatus(distributionOfResponseStatus.reason?.status || []);
            }
            if (countOfClientDocSubmission.status === 'fulfilled') {
                setClientDocumentSubmission(countOfClientDocSubmission.value);
            } else {
                console.warn("fetch count of client document submission failed:", countOfClientDocSubmission.reason);
                setClientDocumentSubmission(countOfClientDocSubmission.reason?.status || []);
            }
        };
        fetchData();
    }, [selectedCompany]);
    return (
        <div>
            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Distribution of notices across different authorities to identify which regulatory bodies are most active.</div>
                    <Chart
                        options={NoticeDistributionByAuthorityFormat.options} series={NoticeDistributionByAuthorityFormat.series} type="bar" height={380}
                    />
                </div>

                <div className={`chart-card ${selectedCharts.includes("ni-2") ? "selected-card" : ""}`}
                    onClick={() => toggleChartSelection("ni-2")}
                    style={{ cursor: "pointer" }}>
                    <div className='d-flex justify-content-end align-items-center' onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            className="chart-select-checkbox"
                            onChange={() => toggleChartSelection("ni-2")}
                            checked={selectedCharts.includes("ni-2")}
                        />
                        <div className='dashboard-icon ms-2'
                            onClick={() =>
                                handleOpenDrawer(
                                    "right",
                                    "State-wise notice count comparison to highlight regional compliance activity",
                                    stateWiseNoticeCount?.rest_counts,
                                    stateWiseNoticeCount?.rest_counts?.map((item) => item.state),
                                )
                            }
                        >
                            <ArrowUpRight />
                        </div>
                        <div className='dashboard-icon me-2 ms-1'>
                            <X />
                        </div>
                    </div>
                    <div className="mb-3 fw-600">Top 5 State-wise notice count comparison to highlight regional compliance activity.</div>
                    <Chart
                        options={stateWiseNoticeCountFormat.options} series={stateWiseNoticeCountFormat.series} type="bar" height={380}
                    />
                </div>
               
            </div>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Breakdown of notice types to show the most common compliance actions</div>
                    <Chart
                        options={noticeTypeBreakdownFormat.options} series={noticeTypeBreakdownFormat.series} type="donut" height={380}
                    />
                </div>

                  <div className={`chart-card ${selectedCharts.includes("ni-4") ? "selected-card" : ""}`}
                    onClick={() => toggleChartSelection("ni-4")}
                    style={{ cursor: "pointer" }}>
                    <div className='d-flex justify-content-end align-items-center' onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            className="chart-select-checkbox"
                            onChange={() => toggleChartSelection("ni-4")}
                            checked={selectedCharts.includes("ni-4")}
                        />
                        <div className='dashboard-icon ms-2'
                            onClick={() =>
                                handleOpenDrawer(
                                    "right",
                                    "Analysis of applicable acts to reveal legal focus areas",
                                    ApplicableActsAnalysis?.rest_counts,
                                    ApplicableActsAnalysis?.rest_counts?.map((item) => item.applicable_act),
                                )
                            }
                        >
                            <ArrowUpRight />
                        </div>
                        <div className='dashboard-icon me-2 ms-1'>
                            <X />
                        </div>
                    </div>
                    <div className="mb-3 fw-600">Top 5 Analysis of applicable acts to reveal legal focus areas</div>
                    <Chart
                        options={ApplicableActsAnalysisFormat.options} series={ApplicableActsAnalysisFormat.series} type="bar" height={380}
                    />
                </div>
            </div>

            <div className='charts-grid mb-4'>
                <div className={`chart-card ${selectedCharts.includes("ni-5") ? "selected-card" : ""}`}
                    onClick={() => toggleChartSelection("ni-5")}
                    style={{ cursor: "pointer" }}>
                    <div className='d-flex justify-content-end align-items-center' onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            className="chart-select-checkbox"
                            onChange={() => toggleChartSelection("ni-5")}
                            checked={selectedCharts.includes("ni-5")}
                        />
                        <div className='dashboard-icon ms-2'
                            onClick={() =>
                                handleOpenDrawer(
                                    "right",
                                    "Number of notices assigned to each team member to assess workload distribution",
                                    numberOfNoticesAssignedToEachTeamMember?.rest_counts,
                                    numberOfNoticesAssignedToEachTeamMember?.rest_counts?.map((item) => item.assigned_to),
                                )
                            }
                        >
                            <ArrowUpRight />
                        </div>
                        <div className='dashboard-icon me-2 ms-1'>
                            <X />
                        </div>
                    </div>
                    <div className="mb-3 fw-600">Top 5 Number of notices assigned to each team member to assess workload distribution</div>
                    <Chart
                        options={numberOfNoticesAssignedToEachTeamMemberFormat.options} series={numberOfNoticesAssignedToEachTeamMemberFormat.series} type="bar" height={380}
                    />
                </div>

                <div className={`chart-card ${selectedCharts.includes("ni-6") ? "selected-card" : ""}`}
                    onClick={() => toggleChartSelection("ni-6")}
                    style={{ cursor: "pointer" }}>
                    <div className='d-flex justify-content-end align-items-center' onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            className="chart-select-checkbox"
                            onChange={() => toggleChartSelection("ni-6")}
                            checked={selectedCharts.includes("ni-6")}
                        />
                        <div className='dashboard-icon ms-2'
                            onClick={() =>
                                handleOpenDrawer(
                                    "left",
                                    "Comparison of acknowledgement rates by different individuals to evaluate responsiveness",
                                    countOfAcknowledgmentRates?.rest_counts,
                                    countOfAcknowledgmentRates?.rest_counts?.map((item) => item.acknowledged_by),
                                )
                            }
                        >
                            <ArrowUpRight />
                        </div>
                        <div className='dashboard-icon me-2 ms-1'>
                            <X />
                        </div>
                    </div>
                     <div className="mb-3 fw-600">Top 5 comparison of acknowledgement rates by different individuals to evaluate responsiveness.</div>
                    <Chart
                        options={countOfAcknowledgmentRatesFormat.options} series={countOfAcknowledgmentRatesFormat.series} type="bar" height={380}
                    />
                </div>
                
            </div>
            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Distribution of response status to track resolution progress</div>
                    <Chart
                        options={distributionOfResponseStatusFormat.options} series={distributionOfResponseStatusFormat.series} type="donut" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Proportion of notices with client document submission (Y/N) to measure client engagement.</div>
                    <Chart
                        options={clientDocumentSubmissionFormat.options} series={clientDocumentSubmissionFormat.series} type="donut" height={380}
                    />
                </div>
            </div>
            <DashboardDrawerGrid
                anchor={drawerAnchor}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                data={drawerData}        //direct array
                title={drawerTitle}
                chartXaxisCategory={chartXaxisCategory}
            />
        </div>
    )
}

export default NoticeDashboard