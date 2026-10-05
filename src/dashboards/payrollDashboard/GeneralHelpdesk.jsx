import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import {
    fetchAssignedIndividualsList,
    fetchDocumentsPendingFrom,
    fetchIssueCategoryByStatus,
    fetchStatusCountOfoOpenVsClosedCases,
} from "../../api/service";
import { ArrowUpRight, X } from "lucide-react";
import DashboardDrawerGrid from "../DashboardDrawer";
import Snackbars from "../../component/Snackbars";

const GeneralHelpdesk = ({
    selectedCompany,
    widgetsList,
    activeDrawer,
    setActiveDrawer,
}) => {
    const [closedVsOpenCases, setClosedVsOpenCases] = React.useState([]);
    const closedVsOpenCasesFormat = {
        series: [
            {
                name: "Open Cases",
                data:
                    closedVsOpenCases?.top_assigned?.map((item) => item.count_open) || [],
            },
            {
                name: "Closed Cases",
                data:
                    closedVsOpenCases?.top_assigned?.map((item) => item.count_closed) ||
                    [],
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
                text: "Proportion of Cases Pending",
            },
            xaxis: {
                categories:
                    closedVsOpenCases?.top_assigned?.map((item) => item.assigned_to) ||
                    [],
                labels: {
                    formatter: function (val) {
                        return val + "K";
                    },
                },
            },
            yaxis: {
                title: {
                    text: undefined,
                },
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + "K";
                    },
                },
            },

            legend: {
                position: "top",
                horizontalAlign: "left",
                offsetX: 40,
            },
        },
    };
    const [assignedUser, setAssignedUser] = React.useState([]);
    const assignedUserFormat = {
        series: [
            {
                name: "Count",
                data: assignedUser?.top_assigned_counts?.map((item) => item.count),
            },
        ],
        options: {
            chart: {
                type: "bar",
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
            xaxis: {
                categories: assignedUser?.top_assigned_counts?.map(
                    (item) => item.assigned_to
                ),
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
    const [documentPendingFrom, setDocumentPendingFrom] = React.useState([]);
    const documentPendingFromFormat = {
        series:
            documentPendingFrom?.top_docs_pending?.map((item) => item.count || []) ||
            [],
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
                documentPendingFrom?.top_docs_pending?.map(
                    (item) => item.documents_pending_from || []
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
    const [openVsCloseIssueCategory, setOpenVsCloseIssueCategory] =
        React.useState([]);
    const openVsCloseIssueCategoryFormat = {
        series: [
            {
                name: "Open Cases",
                data: openVsCloseIssueCategory?.top_counts?.map((item) => item.open),
            },
            {
                name: "Closed Cases",
                data: openVsCloseIssueCategory?.top_counts?.map((item) => item.closed),
            },
        ],
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

            xaxis: {
                categories:
                    openVsCloseIssueCategory?.top_counts?.map(
                        (item) => item.issue_category || []
                    ) || [],
                labels: {
                    formatter: function (val) {
                        return val + "K";
                    },
                },
            },
            yaxis: {
                title: {
                    text: undefined,
                },
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + "K";
                    },
                },
            },

            legend: {
                position: "top",
                horizontalAlign: "left",
                offsetX: 40,
            },
        },
    };
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        message: "",
        severityType: "",
    });

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
        setActiveDrawer("generalHelpdesk");
        setDrawerData(data);
        setChartXaxisCategory(chartXaxisCategory);
        setIsDetailPageData(isDetailData);
        setFilterColumns(filterColumn);
    };
    useEffect(() => {
        const fetchData = async () => {
            const [
                stausCountres,
                assignedUser,
                documentPendingFormRes,
                openVsCloseIssueCategory,
            ] = await Promise.allSettled([
                fetchStatusCountOfoOpenVsClosedCases(selectedCompany),
                fetchAssignedIndividualsList(selectedCompany),
                fetchDocumentsPendingFrom(selectedCompany),
                fetchIssueCategoryByStatus(selectedCompany),
            ]);

            if (stausCountres.status === "fulfilled") {
                setClosedVsOpenCases(stausCountres.value);
            } else {
                setClosedVsOpenCases(stausCountres.reason?.status || []);
            }

            if (assignedUser.status === "fulfilled") {
                setAssignedUser(assignedUser.value);
            } else {
                setAssignedUser(assignedUser.reason?.status || []);
            }

            if (documentPendingFormRes.status === "fulfilled") {
                setDocumentPendingFrom(documentPendingFormRes.value);
            } else {
                setDocumentPendingFrom(documentPendingFormRes.reason?.status || []);
            }

            if (openVsCloseIssueCategory.status === "fulfilled") {
                setOpenVsCloseIssueCategory(openVsCloseIssueCategory.value);
            } else {
                setOpenVsCloseIssueCategory(
                    openVsCloseIssueCategory.reason?.status || []
                );
            }
        };
        fetchData();
    }, [selectedCompany]);

    const shouldShow = (id) => {
        return widgetsList.flat().some(
            item => item.widget_id?.toLowerCase() === id.toLowerCase()
        );
    };

    return (
        <div>
            <Snackbars
                issnackbarsOpen={issnackbarsOpen}
                setIsSnackbarsOpen={setIsSnackbarsOpen}
            />
            <div className="charts-grid mb-4">
                {shouldShow("gh-1") && (
                    <div
                        className={`chart-card`}>
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >

                            <div
                                className="dashboard-icon ms-2"
                                onClick={(e) => {
                                    e.stopPropagation();   // prevent parent click from firing
                                    handleOpenDrawer(
                                        "right",
                                        "Comparison of closed vs. open cases",
                                        closedVsOpenCases?.rest_assigned,
                                        closedVsOpenCases?.rest_assigned?.map(
                                            (item) => item.assigned_to
                                        ),
                                        closedVsOpenCases?.generalHelpdeskRecords,
                                        closedVsOpenCases?.columns

                                    )
                                }}
                            >
                                <ArrowUpRight />
                            </div>
                        </div>

                        <div className="mb-3 fw-600">
                            Comparison of closed vs. open cases for top 5 Assigned users
                        </div>

                        <Chart
                            options={closedVsOpenCasesFormat.options}
                            series={closedVsOpenCasesFormat.series}
                            type="bar"
                            height={380}
                        />
                    </div>
                )}
                {shouldShow("gh-2") && (
                    <div
                        className={`chart-card`}
                    >
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >
                            <div
                                className="dashboard-icon ms-2"
                                onClick={(e) => {
                                    e.stopPropagation();   // prevent parent click from firing
                                    handleOpenDrawer(
                                        "left",
                                        "Assigned Users",
                                        assignedUser?.rest_assigned_counts,
                                        assignedUser?.rest_assigned_counts?.map(
                                            (item) => item.assigned_to
                                        ),
                                        assignedUser?.generalHelpdeskRecords,
                                        assignedUser?.columns
                                    )
                                }

                                }
                            >
                                <ArrowUpRight />
                            </div>
                        </div>

                        <div className="mb-3 fw-600">Top 5 Assigned Users</div>

                        <Chart
                            options={assignedUserFormat.options}
                            series={assignedUserFormat.series}
                            type="bar"
                            height={380}
                        />
                    </div>

                )}

            </div>

            <div className="charts-grid mb-4">
                {shouldShow("gh-3") && (
                    <div
                        className={`chart-card`}
                    >
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >
                            <div
                                className="dashboard-icon ms-2"
                                onClick={(e) => {
                                    e.stopPropagation();   // prevent parent click from firing
                                    handleOpenDrawer(
                                        "right",
                                        "Documents Pending From Client vs. Karma",
                                        documentPendingFrom?.rest_docs_pending,
                                        documentPendingFrom?.rest_docs_pending?.map(
                                            (item) => item.documents_pending_from
                                        ),
                                        documentPendingFrom?.generalHelpdeskRecords,
                                        documentPendingFrom?.columns
                                    )
                                }}
                            >
                                <ArrowUpRight />
                            </div>
                        </div>
                        <div className="mb-3 fw-600">
                            Top 5 documents Pending From Client vs. Karma
                        </div>

                        <Chart
                            options={documentPendingFromFormat.options}
                            series={documentPendingFromFormat.series}
                            type="donut"
                            height={380}
                        />
                    </div>
                )}
                {shouldShow("gh-4") && (
                    <div
                        className={`chart-card`}
                    >
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >
                            <div
                                className="dashboard-icon ms-2"
                                onClick={(e) => {
                                    e.stopPropagation();   // prevent parent click from firing
                                    handleOpenDrawer(
                                        "left",
                                        "Open and Closed Issue Status by Issue Category",
                                        openVsCloseIssueCategory?.rest_counts,
                                        openVsCloseIssueCategory?.rest_counts?.map(
                                            (item) => item.issue_category
                                        ),
                                        openVsCloseIssueCategory?.generalHelpdeskRecords,
                                        openVsCloseIssueCategory?.columns
                                    )
                                }}
                            >
                                <ArrowUpRight />
                            </div>
                        </div>

                        <div className="mb-3 fw-600">
                            Top 5 open and Closed Issue Status by Issue Category
                        </div>

                        <Chart
                            options={openVsCloseIssueCategoryFormat.options}
                            series={openVsCloseIssueCategoryFormat.series}
                            type="bar"
                            height={380}
                        />
                    </div>
                )}

            </div>
            <DashboardDrawerGrid
                anchor={drawerAnchor}
                open={activeDrawer === "generalHelpdesk"}
                onClose={() => setActiveDrawer(null)}
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

export default GeneralHelpdesk;
