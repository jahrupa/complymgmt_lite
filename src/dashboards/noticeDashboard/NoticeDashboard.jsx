import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import {
    fetchAnalysisOfApplicableAct,
    fetchAuthorityDistributionCount,
    fetchCountOfAcknowledgmentRates,
    fetchCountOfClientDocSubmission,
    fetchDistributionOfResponseStatus,
    fetchNoticesAssignedTo,
    fetchStateWiseNoticeCount,
    fetchTypesOfNoticeOrInspection,
} from "../../api/service";
import DashboardDrawerGrid from "../DashboardDrawer";
import { ArrowUpRight, X } from "lucide-react";
import Snackbars from "../../component/Snackbars";
import { decryptData } from "../../page/utils/encrypt";

const NoticeDashboard = ({
    selectedCompany,
    current,
    selectedCharts,
    setSelectedCharts,
    shouldShow,
}) => {
    const [NoticeDistributionByAuthority, setNoticeDistributionByAuthority] =
        React.useState([]);
    const NoticeDistributionByAuthorityFormat = {
        series: [
            {
                name: "Notice Count",
                data: NoticeDistributionByAuthority?.top_counts?.map((item) => item.count) || [],
            },
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
                                fontSize: "13px",
                                fontWeight: 900,
                            },
                        },
                    },
                },
            },
            stroke: {
                width: 1,
                colors: ["#fff"],
            },
            title: {
                text: "Notice Count",
            },
            xaxis: {
                categories:
                    NoticeDistributionByAuthority?.top_counts?.map((item) => item.authority) || [],
            },
            yaxis: {
                title: {
                    text: undefined,
                },
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                offsetX: 40,
            },
        },
    };
    const [stateWiseNoticeCount, setStateWiseNoticeCount] = React.useState([]);
    const stateWiseNoticeCountFormat = {
        series: [
            {
                name: "Notice Count",
                data: stateWiseNoticeCount?.top_counts?.map((item) => item.count) || [],
            },
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
                    horizontal: false,
                    dataLabels: {
                        total: {
                            enabled: true,
                            offsetX: 0,
                            style: {
                                fontSize: "13px",
                                fontWeight: 900,
                            },
                        },
                    },
                },
            },
            stroke: {
                width: 1,
                colors: ["#fff"],
            },
            title: {
                text: "Notice Count",
            },
            xaxis: {
                categories:
                    stateWiseNoticeCount?.top_counts?.map((item) => item.state) || [],
            },
            yaxis: {
                title: {
                    text: undefined,
                },
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                offsetX: 40,
            },
        },
    };
    const [noticeTypeBreakdown, setNoticeTypeBreakdown] = React.useState([]);
    const noticeTypeBreakdownFormat = {
        series: noticeTypeBreakdown?.top_counts?.map((item) => item?.count) || [],
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
                theme: "light", // makes all tooltip text black
                style: {
                    fontSize: "12px",
                    color: "#000",
                },
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

            labels:
                noticeTypeBreakdown?.top_counts?.map((item) => item?.type_of_notice_inspection) ||
                [],
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
    };
    const [ApplicableActsAnalysis, setApplicableActsAnalysis] = React.useState(
        []
    );
    const ApplicableActsAnalysisFormat = {
        series: [
            {
                name: "Applicable Acts Count",
                data:
                    ApplicableActsAnalysis?.top_counts?.map((item) => item.count) || [],
            },
        ],
        options: {
            chart: {
                type: "bar",
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
                                fontSize: "13px",
                                fontWeight: 900,
                            },
                        },
                    },
                },
            },
            stroke: {
                width: 1,
                colors: ["#fff"],
            },
            title: {
                text: "Applicable Acts Count",
            },
            xaxis: {
                categories:
                    ApplicableActsAnalysis?.top_counts?.map(
                        (item) => item.applicable_act
                    ) || [],
            },
            yaxis: {
                title: {
                    text: undefined,
                },
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                offsetX: 40,
            },
        },
    };
    const [
        numberOfNoticesAssignedToEachTeamMember,
        setNumberOfNoticesAssignedToEachTeamMember,
    ] = React.useState([]);
    const numberOfNoticesAssignedToEachTeamMemberFormat = {
        series: [
            {
                name: "Number of Notices Assigned",
                data:
                    numberOfNoticesAssignedToEachTeamMember?.top_counts?.map(
                        (item) => item.count
                    ) || [],
            },
        ],
        options: {
            chart: {
                type: "bar",
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
                                fontSize: "13px",
                                fontWeight: 900,
                            },
                        },
                    },
                },
            },
            stroke: {
                width: 1,
                colors: ["#fff"],
            },
            title: {
                text: "Number of Notices Assigned",
            },
            xaxis: {
                categories:
                    numberOfNoticesAssignedToEachTeamMember?.top_counts?.map(
                        (item) => item.assigned_to
                    ) || [],
            },
            yaxis: {
                title: {
                    text: undefined,
                },
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                offsetX: 40,
            },
        },
    };
    const [countOfAcknowledgmentRates, setCountOfAcknowledgmentRates] =
        React.useState([]);
    const countOfAcknowledgmentRatesFormat = {
        series: [
            {
                name: "Acknowledgement Rates",
                data:
                    countOfAcknowledgmentRates?.top_counts?.map((item) => item.count) ||
                    [],
            },
        ],
        options: {
            chart: {
                type: "bar",
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
                                fontSize: "13px",
                                fontWeight: 900,
                            },
                        },
                    },
                },
            },
            stroke: {
                width: 1,
                colors: ["#fff"],
            },
            title: {
                text: "Acknowledgement Rates",
            },
            xaxis: {
                categories:
                    countOfAcknowledgmentRates?.top_counts?.map(
                        (item) => item.acknowledged_by
                    ) || [],
                // labels: {
                //     formatter: function (val) {
                //         return val + "K"
                //     }
                // }
            },
            yaxis: {
                title: {
                    text: undefined,
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
                position: "top",
                horizontalAlign: "left",
                offsetX: 40,
            },
        },
    };

    const [distributionOfResponseStatus, setDistributionOfResponseStatus] =
        React.useState([]);
    const distributionOfResponseStatusFormat = {
        series: distributionOfResponseStatus?.top_counts?.map((item) => item.count) || [],
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

            labels:
                distributionOfResponseStatus?.top_counts?.map((item) => item.response_status) || [],
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
    };
    const [clientDocumentSubmission, setClientDocumentSubmission] =
        React.useState([]);
    const clientDocumentSubmissionFormat = {
        series: clientDocumentSubmission?.top_counts?.map((item) => item.count) || [],
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

            labels:
                clientDocumentSubmission?.top_counts?.map(
                    (item) => item.doc_submission_by_client
                ) || [],
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
    };
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        message: "",
        severityType: "",
    });
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [drawerAnchor, setDrawerAnchor] = React.useState("right");
    const [drawerTitle, setDrawerTitle] = useState("");
    const [drawerData, setDrawerData] = useState("");
    const [chartXaxisCategory, setChartXaxisCategory] = React.useState("");
    const [isDetailPage, setIsDetailPage] = useState(false);
    const [isDetailPageData, setIsDetailPageData] = useState([]);
    const [filterColumns, setFilterColumns] = useState([]);
    const handleOpenDrawer = (anchor, title, data = [], chartXaxisCategory, isDetailData, filterColumn) => {
        setDrawerAnchor(anchor);
        setDrawerTitle(title);
        setDrawerOpen(true);
        setDrawerData(data);
        setChartXaxisCategory(chartXaxisCategory);
        setFilterColumns(filterColumn);
        setIsDetailPageData(isDetailData);
    };
    const userRole = decryptData(localStorage.getItem("user_role"));

    useEffect(() => {
        const fetchData = async () => {
            const [
                noticeDistributionByAuthorityRes,
                stateWiseNoticeCountRes,
                typesOfNoticeOrInspectionRes,
                analysisOfApplicableActRes,
                noticesAssignedToRes,
                countOfAcknowledgmentRates,
                distributionOfResponseStatus,
                countOfClientDocSubmission,
            ] = await Promise.allSettled([
                fetchAuthorityDistributionCount(selectedCompany),
                fetchStateWiseNoticeCount(selectedCompany),
                fetchTypesOfNoticeOrInspection(selectedCompany),
                fetchAnalysisOfApplicableAct(selectedCompany),
                fetchNoticesAssignedTo(selectedCompany),
                fetchCountOfAcknowledgmentRates(selectedCompany),
                fetchDistributionOfResponseStatus(selectedCompany),
                fetchCountOfClientDocSubmission(selectedCompany),
            ]);
            if (noticeDistributionByAuthorityRes.status === "fulfilled") {
                setNoticeDistributionByAuthority(
                    noticeDistributionByAuthorityRes.value
                );
            } else {
                // Optionally set to empty or default data on failure
                setNoticeDistributionByAuthority(
                    noticeDistributionByAuthorityRes.reason?.status || []
                );
            }
            if (stateWiseNoticeCountRes.status === "fulfilled") {
                setStateWiseNoticeCount(stateWiseNoticeCountRes.value);
            } else {
                // Optionally set to empty or default data on failure
                setStateWiseNoticeCount(stateWiseNoticeCountRes.reason?.status || []);
            }
            if (typesOfNoticeOrInspectionRes.status === "fulfilled") {
                setNoticeTypeBreakdown(typesOfNoticeOrInspectionRes.value);
            } else {
                setNoticeTypeBreakdown([]);
            }
            if (analysisOfApplicableActRes.status === "fulfilled") {
                setApplicableActsAnalysis(analysisOfApplicableActRes.value);
            } else {
                setApplicableActsAnalysis(
                    analysisOfApplicableActRes.reason?.status || []
                );
            }
            if (noticesAssignedToRes.status === "fulfilled") {
                setNumberOfNoticesAssignedToEachTeamMember(noticesAssignedToRes.value);
            } else {

                setNumberOfNoticesAssignedToEachTeamMember(
                    noticesAssignedToRes.reason?.status || []
                );
            }
            if (countOfAcknowledgmentRates.status === "fulfilled") {
                setCountOfAcknowledgmentRates(countOfAcknowledgmentRates.value);
            } else {

                setCountOfAcknowledgmentRates(
                    countOfAcknowledgmentRates.reason?.status || []
                );
            }
            if (distributionOfResponseStatus.status === "fulfilled") {
                setDistributionOfResponseStatus(distributionOfResponseStatus.value);
            } else {
                setDistributionOfResponseStatus(
                    distributionOfResponseStatus.reason?.status || []
                );
            }
            if (countOfClientDocSubmission.status === "fulfilled") {
                setClientDocumentSubmission(countOfClientDocSubmission.value);
            } else {
                setClientDocumentSubmission(
                    countOfClientDocSubmission.reason?.status || []
                );
            }
        };
        fetchData();
    }, [selectedCompany]);

    useEffect(() => {
        setSelectedCharts([]);
    }, [current?.user_name]);

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
        <div>
            <Snackbars
                issnackbarsOpen={issnackbarsOpen}
                setIsSnackbarsOpen={setIsSnackbarsOpen}
            />
            <div className="charts-grid mb-4">
                {shouldShow("ni-1") && (
                    <div
                        className={`chart-card ${cardClass("ni-1") ? "selected-card" : ""}`}
                        onClick={canSelect ? () => handleSelect("ni-1") : undefined}
                        style={{ cursor: canSelect ? "pointer" : "default" }}
                    >
                        <div className="d-flex justify-content-end align-items-center">
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("ni-1")}
                                checked={selectedCharts.includes("ni-1")}
                                disabled={!current?.user_name}
                            />

                            <div
                                className="dashboard-icon ms-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDrawer(
                                        "right",
                                        "Distribution of notices across different authorities",
                                        NoticeDistributionByAuthority?.rest_counts,
                                        NoticeDistributionByAuthority?.rest_counts?.map(
                                            (item) => item.assigned_to
                                        ),
                                        NoticeDistributionByAuthority?.notice_records,
                                        NoticeDistributionByAuthority?.columns
                                    );
                                }}
                            >
                                <ArrowUpRight />
                            </div>
                        </div>

                        <div className="mb-3 fw-600">
                            Distribution of notices across different authorities
                        </div>

                        <Chart
                            options={NoticeDistributionByAuthorityFormat.options}
                            series={NoticeDistributionByAuthorityFormat.series}
                            type="bar"
                            height={380}
                        />
                    </div>
                )}

                {shouldShow("ni-2") && (
                    <div
                        className={`chart-card ${cardClass("ni-2") ? "selected-card" : ""
                            }`}
                        onClick={canSelect ? () => handleSelect("ni-2") : undefined}
                        style={{ cursor: canSelect ? "pointer" : "default" }}
                    >
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("ni-2")}
                                checked={selectedCharts.includes("ni-2")}
                                disabled={!current?.user_name}
                            />
                            <div
                                className="dashboard-icon ms-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDrawer(
                                        "right",
                                        "Number of notices assigned...",
                                        numberOfNoticesAssignedToEachTeamMember?.rest_counts,
                                        numberOfNoticesAssignedToEachTeamMember?.rest_counts?.map(
                                            (item) => item.assigned_to
                                        ),
                                        numberOfNoticesAssignedToEachTeamMember?.notice_records,
                                        numberOfNoticesAssignedToEachTeamMember?.columns
                                    );
                                }}
                            >
                                <ArrowUpRight />
                            </div>
                        </div>
                        <div className="mb-3 fw-600">
                            Top 5 State-wise notice count comparison to highlight regional
                            compliance activity.
                        </div>
                        <Chart
                            options={stateWiseNoticeCountFormat.options}
                            series={stateWiseNoticeCountFormat.series}
                            type="bar"
                            height={380}
                        />
                    </div>
                )}

            </div>

            <div className="charts-grid mb-4">
                {shouldShow("ni-3") && (
                    <div className={`chart-card ${cardClass("ni-3") ? "selected-card" : ""
                        }`}
                        onClick={canSelect ? () => handleSelect("ni-3") : undefined}
                        style={{ cursor: canSelect ? "pointer" : "default" }}>
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("ni-3")}
                                checked={selectedCharts.includes("ni-3")}
                                disabled={!current?.user_name}
                            />
                            <div
                                className="dashboard-icon ms-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDrawer(
                                        "left",
                                        "Breakdown of notice types to show the most common compliance actions",
                                        noticeTypeBreakdown?.rest_counts,
                                        noticeTypeBreakdown?.rest_counts?.map(
                                            (item) => item.applicable_act
                                        ),
                                        noticeTypeBreakdown?.notice_records,
                                        noticeTypeBreakdown?.columns
                                    )
                                }}
                            >
                                <ArrowUpRight />
                            </div>
                        </div>
                        <div className="mb-3 fw-600">
                            Breakdown of notice types to show the most common compliance actions
                        </div>
                        <Chart
                            options={noticeTypeBreakdownFormat.options}
                            series={noticeTypeBreakdownFormat.series}
                            type="donut"
                            height={380}
                        />
                    </div>

                )}

                {shouldShow("ni-4") && (
                    <div
                        className={`chart-card ${cardClass("ni-4") ? "selected-card" : ""
                            }`}
                        onClick={canSelect ? () => handleSelect("ni-4") : undefined}
                        style={{ cursor: canSelect ? "pointer" : "default" }}
                    >
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("ni-4")}
                                checked={selectedCharts.includes("ni-4")}
                                disabled={!current?.user_name}
                            />
                            <div
                                className="dashboard-icon ms-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDrawer(
                                        "left",
                                        "Analysis of applicable acts to reveal legal focus areas",
                                        ApplicableActsAnalysis?.rest_counts,
                                        ApplicableActsAnalysis?.rest_counts?.map(
                                            (item) => item.applicable_act
                                        ),
                                        ApplicableActsAnalysis?.notice_records,
                                        ApplicableActsAnalysis?.columns
                                    )
                                }}
                            >
                                <ArrowUpRight />
                            </div>
                        </div>
                        <div className="mb-3 fw-600">
                            Top 5 Analysis of applicable acts to reveal legal focus areas
                        </div>
                        <Chart
                            options={ApplicableActsAnalysisFormat.options}
                            series={ApplicableActsAnalysisFormat.series}
                            type="bar"
                            height={380}
                        />
                    </div>

                )}

            </div>

            <div className="charts-grid mb-4">
                {shouldShow("ni-5") && (
                    <div
                        className={`chart-card ${cardClass("ni-5") ? "selected-card" : ""
                            }`}
                        onClick={canSelect ? () => handleSelect("ni-5") : undefined}
                        style={{ cursor: canSelect ? "pointer" : "default" }}
                    >
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("ni-5")}
                                checked={selectedCharts.includes("ni-5")}
                                disabled={!current?.user_name}
                            />
                            <div
                                className="dashboard-icon ms-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDrawer(
                                        "right",
                                        "Number of notices assigned to each team member to assess workload distribution",
                                        numberOfNoticesAssignedToEachTeamMember?.rest_counts,
                                        numberOfNoticesAssignedToEachTeamMember?.rest_counts?.map(
                                            (item) => item.assigned_to
                                        ),
                                       numberOfNoticesAssignedToEachTeamMember?.notice_records,
                                       numberOfNoticesAssignedToEachTeamMember?.columns
                                    )
                                }

                                }
                            >
                                <ArrowUpRight />
                            </div>
                        </div>
                        <div className="mb-3 fw-600">
                            Top 5 Number of notices assigned to each team member to assess
                            workload distribution
                        </div>
                        <Chart
                            options={numberOfNoticesAssignedToEachTeamMemberFormat.options}
                            series={numberOfNoticesAssignedToEachTeamMemberFormat.series}
                            type="bar"
                            height={380}
                        />
                    </div>
                )}
                {shouldShow("ni-6") && (
                    <div
                        className={`chart-card ${cardClass("ni-6") ? "selected-card" : ""
                            }`}
                        onClick={canSelect ? () => handleSelect("ni-6") : undefined}
                        style={{ cursor: canSelect ? "pointer" : "default" }}
                    >
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("ni-6")}
                                checked={selectedCharts.includes("ni-6")}
                                disabled={!current?.user_name}
                            />
                            <div
                                className="dashboard-icon ms-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDrawer(
                                        "right",
                                        "Comparison of acknowledgement rates by different individuals to evaluate responsiveness",
                                        countOfAcknowledgmentRates?.rest_counts,
                                        countOfAcknowledgmentRates?.rest_counts?.map(
                                            (item) => item.acknowledged_by
                                        ),
                                        countOfAcknowledgmentRates?.notice_records,
                                        countOfAcknowledgmentRates?.columns
                                    )
                                }

                                }
                            >
                                <ArrowUpRight />
                            </div>
                            {/* <div
                                className={`chart-card ${cardClass("ni-6") ? "selected-card" : ""
                                    }`}
                                onClick={canSelect ? () => handleSelect("ni-6") : undefined}
                                style={{ cursor: canSelect ? "pointer" : "default" }}
                            >
                                <div
                                    className="d-flex justify-content-end align-items-center"

                                >
                                    <input
                                        type="checkbox"
                                        className="chart-select-checkbox"
                                        onChange={() => toggleChartSelection("ni-6")}
                                        checked={selectedCharts.includes("ni-6")}
                                        disabled={!current?.user_name}
                                    />
                                    <div
                                        className="dashboard-icon ms-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenDrawer(
                                                "right",
                                                "Comparison of acknowledgement rates by different individuals to evaluate responsiveness",
                                                countOfAcknowledgmentRates?.rest_counts,
                                                countOfAcknowledgmentRates?.rest_counts?.map(
                                                    (item) => item.acknowledged_by
                                                ),
                                                countOfAcknowledgmentRates?.notice_records,
                                            )
                                        }

                                        }
                                    >
                                        <ArrowUpRight />
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <div className="mb-3 fw-600">
                            Top 5 comparison of acknowledgement rates by different individuals
                            to evaluate responsiveness.
                        </div>
                        <Chart
                            options={countOfAcknowledgmentRatesFormat.options}
                            series={countOfAcknowledgmentRatesFormat.series}
                            type="bar"
                            height={380}
                        />
                    </div>
                )}
            </div>
            <div className="charts-grid mb-4">
                {shouldShow("ni-7") && (
                    <div className={`chart-card ${cardClass("ni-7") ? "selected-card" : ""
                        }`}
                        onClick={canSelect ? () => handleSelect("ni-7") : undefined}
                        style={{ cursor: canSelect ? "pointer" : "default" }}>
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("ni-7")}
                                checked={selectedCharts.includes("ni-7")}
                                disabled={!current?.user_name}
                            />
                            <div
                                className="dashboard-icon ms-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDrawer(
                                        "right",
                                        "Distribution of response status to track resolution progress",
                                        distributionOfResponseStatus?.rest_counts,
                                        distributionOfResponseStatus?.rest_counts?.map(
                                            (item) => item.acknowledged_by
                                        ),
                                        distributionOfResponseStatus?.notice_records,
                                        distributionOfResponseStatus?.columns
                                    )
                                }

                                }
                            >
                                <ArrowUpRight />
                            </div>
                        </div>
                        <div className="mb-3 fw-600">
                            Distribution of response status to track resolution progress
                        </div>
                        <Chart
                            options={distributionOfResponseStatusFormat.options}
                            series={distributionOfResponseStatusFormat.series}
                            type="donut"
                            height={380}
                        />
                    </div>
                )}
                {shouldShow("ni-8") && (
                    <div className={`chart-card ${cardClass("ni-8") ? "selected-card" : ""
                        }`}
                        onClick={canSelect ? () => handleSelect("ni-8") : undefined}
                        style={{ cursor: canSelect ? "pointer" : "default" }}>
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("ni-8")}
                                checked={selectedCharts.includes("ni-8")}
                                disabled={!current?.user_name}
                            />
                            <div
                                className="dashboard-icon ms-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDrawer(
                                        "right",
                                        "Proportion of notices with client document submission (Y/N) to measure client engagement.",
                                        clientDocumentSubmission?.rest_counts,
                                        clientDocumentSubmission?.rest_counts?.map(
                                            (item) => item.acknowledged_by
                                        ),
                                        clientDocumentSubmission?.notice_records,
                                        clientDocumentSubmission?.columns
                                    )
                                }

                                }
                            >
                                <ArrowUpRight />
                            </div>
                        </div>
                        <div className="mb-3 fw-600">
                            Proportion of notices with client document submission (Y/N) to
                            measure client engagement.
                        </div>
                        <Chart
                            options={clientDocumentSubmissionFormat.options}
                            series={clientDocumentSubmissionFormat.series}
                            type="donut"
                            height={380}
                        />
                    </div>
                )}

            </div>
            <DashboardDrawerGrid
                anchor={drawerAnchor}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                data={drawerData} //direct array
                title={drawerTitle}
                chartXaxisCategory={chartXaxisCategory}
                isDetailPage={isDetailPage}
                setIsDetailPage={setIsDetailPage}
                isDetailPageData={isDetailPageData}
                 filterColumns={filterColumns}
            />
        </div>
    );
};

export default NoticeDashboard;
