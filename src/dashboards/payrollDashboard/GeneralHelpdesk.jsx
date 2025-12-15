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
import { decryptData } from "../../page/utils/encrypt";

const GeneralHelpdesk = ({
    selectedCompany,
    current,
    selectedCharts,
    setSelectedCharts,
    widgetsList,
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

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [drawerAnchor, setDrawerAnchor] = React.useState("right");
    const [drawerTitle, setDrawerTitle] = useState("");
    const [drawerData, setDrawerData] = useState("");
    const [chartXaxisCategory, setChartXaxisCategory] = React.useState("");
    const userRole = decryptData(localStorage.getItem("user_role"));
    const handleOpenDrawer = (anchor, title, data = [], chartXaxisCategory) => {
        setDrawerAnchor(anchor);
        setDrawerTitle(title);
        setDrawerOpen(true);
        setDrawerData(data);
        setChartXaxisCategory(chartXaxisCategory);
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
                console.warn(
                    "fetchStatusCountOfoOpenVsClosedCases failed:",
                    stausCountres.reason
                );
                setClosedVsOpenCases(stausCountres.reason?.status || []);
            }

            if (assignedUser.status === "fulfilled") {
                setAssignedUser(assignedUser.value);
            } else {
                console.warn(
                    "fetchAssignedIndividualsList failed:",
                    assignedUser.reason
                );
                setAssignedUser(assignedUser.reason?.status || []);
            }

            if (documentPendingFormRes.status === "fulfilled") {
                setDocumentPendingFrom(documentPendingFormRes.value);
            } else {
                console.warn(
                    "fetchDocumentsPendingFrom failed:",
                    documentPendingFormRes.reason
                );
                setDocumentPendingFrom(documentPendingFormRes.reason?.status || []);
            }

            if (openVsCloseIssueCategory.status === "fulfilled") {
                setOpenVsCloseIssueCategory(openVsCloseIssueCategory.value);
            } else {
                console.warn(
                    "fetchIssueCategoryByStatus failed:",
                    openVsCloseIssueCategory.reason
                );
                setOpenVsCloseIssueCategory(
                    openVsCloseIssueCategory.reason?.status || []
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
                        className={`chart-card ${cardClass("gh-1") ? "selected-card" : ""
                            }`}
                        onClick={canSelect ? () => handleSelect("gh-1") : undefined}
                        style={{ cursor: canSelect ? "pointer" : "default" }}>
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("gh-1")}
                                checked={selectedCharts.includes("gh-1")}
                                disabled={!current?.user_name} // if user_name empty → disable
                            />

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
                                        )
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
                        className={`chart-card ${cardClass("gh-2") ? "selected-card" : ""
                            }`}
                        onClick={canSelect ? () => handleSelect("gh-2") : undefined}
                        style={{ cursor: canSelect ? "pointer" : "default" }}
                    >
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("gh-2")}
                                checked={selectedCharts.includes("gh-2")}
                                disabled={!current?.user_name}
                            />
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
                                        )
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
                        className={`chart-card ${cardClass("gh-3") ? "selected-card" : ""
                            }`}
                        onClick={canSelect ? () => handleSelect("gh-3") : undefined}
                        style={{ cursor: canSelect ? "pointer" : "default" }}
                    >
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("gh-3")}
                                checked={selectedCharts.includes("gh-3")}
                                disabled={!current?.user_name}

                            />
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
                                        )
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
                        className={`chart-card ${cardClass("gh-4") ? "selected-card" : ""
                            }`}
                        onClick={canSelect ? () => handleSelect("gh-4") : undefined}
                        style={{ cursor: canSelect ? "pointer" : "default" }}
                    >
                        <div
                            className="d-flex justify-content-end align-items-center"

                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("gh-4")}
                                checked={selectedCharts.includes("gh-4")}
                                disabled={!current?.user_name}

                            />
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
                                        )
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
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                data={drawerData} //direct array
                title={drawerTitle}
                chartXaxisCategory={chartXaxisCategory}
            />
        </div>
    );
};

export default GeneralHelpdesk;
