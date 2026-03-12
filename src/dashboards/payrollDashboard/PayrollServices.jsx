import React, { useEffect, useMemo, useState } from "react";
import "../../style/clientOnbordingDashboard.css";
import "../../style/PayrollServicesDashboard.css";
import Chart from "react-apexcharts";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import {
    fetchAverageDelayBetweenDataRequestDateAndClientDataReceivedDate,
    fetchDistributionOfEmployeeAcrossMultipleEntitiesOrLocations,
    fetchExplanationOfEmployeeCount,
    fetchInvestmentDeclarationStatusByCompany,
    fetchPayrollsClosedOnOrAheadOfSlaPercentage,
    fetchTotalEmployeeCount,
    fetchTypeOfSystemsUsedByEmployer,
} from "../../api/service";
import { ArrowUpRight, X } from "lucide-react";
import DashboardDrawerGrid from "../DashboardDrawer";
import Snackbars from "../../component/Snackbars";
import { decryptData } from "../../page/utils/encrypt";
import { useNavigate } from "react-router-dom";

ModuleRegistry.registerModules([AllCommunityModule]);

const PayrollServices = ({
    selectedCompany,
    current,
    setSelectedCharts,
    selectedCharts,
    shouldShow,
}) => {
    const [payrollOverviewData, setPayrollOverviewData] = useState({
        total_employees: 0,
        turnaround_health_average_days: 0,
        turnaround_health_target_days: 0,
        on_time_delivery: 0,
        late_percent: 0,
        compliance_alerts: 0,
    });
    const [investmentData, setInvestmentData] = useState({});
    const navigate = useNavigate();

    const investmentDataFormate = {
        series: [
            investmentData.count_yes || 0,
            investmentData.count_no || 0,
            investmentData.count_empty || 0,
        ],
        options: {
            chart: {
                width: 380,
                type: "donut",
                events: {
                    dataPointSelection(event, chartContext, opts) {
                        const seriesIndex = opts.seriesIndex;
                        // safety check
                        if (seriesIndex === undefined || seriesIndex === -1) return;
                        const clickedValue = opts.w.globals.series;
                        const clickedLabel = opts.w.globals.labels;
                        // optional: zero-value segments block
                        if (clickedValue === 0) return;

                        navigate(
                            // "/payroll_service/dashboard/investment_declaration_status_by_company",
                            {
                                state: {
                                    score: clickedValue,
                                    seriesName: clickedLabel,
                                    dataPointIndex: opts.dataPointIndex
                                },
                            }
                        );
                    },
                },
            },
            colors: ["#f5d3cc", "#ffb397", "#ff7c4c"],
            fill: {
                opacity: 1,
                colors: ["#f5d3cc", "#ffb397", "#ff7c4c"],
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

            labels: ["Yes", "No", "Empty"],
            legend: {
                position: "bottom", // 👈 moves Yes/No below the chart
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
    const [distributionOfEmployee, setDistributionOfEmployee] = useState({});
    const distributionOfEmployeeFormate = {
        series: [
            distributionOfEmployee.count_yes || 0,
            distributionOfEmployee.count_no || 0,
            distributionOfEmployee.count_empty || 0,
        ],
        options: {
            chart: {
                width: 380,
                type: "pie",
            },
            colors: ["#f5d3cc", "#ffb397", "#ff7c4c"],
            fill: {
                opacity: 1,
                colors: ["#f5d3cc", "#ffb397", "#ff7c4c"],
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

            labels: ["Yes", "No", "Empty"],
            legend: {
                position: "bottom", // 👈 moves Yes/No below the chart
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
    const [explanationOfEmployeeCount, setExplanationOfEmployeeCount] = useState(
        []
    );
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
    const userRole = decryptData(localStorage.getItem("user_role"));
    const handleOpenDrawer = (anchor, title, data = [], chartXaxisCategory, isDetailData, filterColumn) => {
        setDrawerAnchor(anchor);
        setDrawerTitle(title);
        setDrawerOpen(true);
        setDrawerData(data);
        setChartXaxisCategory(chartXaxisCategory);
        setFilterColumns(filterColumn);
        setIsDetailPageData(isDetailData);
    };
    const columnDefs = useMemo(
        () => [
            {
                headerName: "Employee Count (sum)",
                field: "employee_count",
                sortable: true,
                filter: true,
                flex: "1",
                headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
            },
            {
                headerName: "Company Name",
                field: "company_name",
                sortable: true,
                filter: true,
                flex: "1",
                headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
            },
            {
                headerName: "Company Common Name",
                field: "company_common_name",
                sortable: true,
                filter: true,
                flex: "1",
                headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
            },
            {
                headerName: "Service Month",
                field: "service_month",
                sortable: true,
                filter: true,
                flex: "1",
                headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
            },
            {
                headerName: "Service Frequency",
                field: "service_frequency",
                sortable: true,
                filter: true,
                flex: "1",
                headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
            },
        ],
        []
    );

    const [systemUseByEmp, setSystemUseByEmp] = useState([]);
    const systemUsedByEmpFormat = {
        series: [
            {
                name: "Employee Count",
                data: systemUseByEmp?.system_used_by_employer?.map(
                    (item) => item.count
                ), // Y-axis values (Sum of Employee Count)
            },
        ],
        options: {
            chart: {
                type: "bar",
                toolbar: { show: false },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                },
            },
            dataLabels: {
                enabled: false,
                style: {
                    colors: ["#333"],
                },
            },
            xaxis: {
                categories: systemUseByEmp?.system_used_by_employer?.map(
                    (item) => item.system_used
                ), // X-axis categories (Payroll Service Type)
            },
            yaxis: {
                title: {
                    text: "Employee Count",
                    style: { fontWeight: "bold" },
                },
                min: 0,
                tickAmount: 5,
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
        },
    };
    const [
        dataRequestAndClientDataReceived,
        setDataRequestAndClientDataReceived,
    ] = React.useState([]);
    const dataRequestAndClientDataReceivedFormat = {
        series: [
            {
                name: "Average Days Delayed",
                data:
                    dataRequestAndClientDataReceived?.top_delays?.map(
                        (item) => item.average_days_delayed || 0
                    ) || [],
            },
        ],
        options: {
            chart: {
                type: "bar",
                height: 350,
                events: {
                    click(event, chartContext, opts) {

                        navigate(
                            // "/payroll_service/dashboard/delay_between_data_request_date_and_client_data_received_date",
                            {
                                state: {
                                    score:
                                        opts.config.series[opts.seriesIndex].data[
                                        opts.dataPointIndex
                                        ],
                                    seriesName: opts.config.series[opts.seriesIndex].name,
                                },
                            },
                        );
                    },
                },
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
                    borderRadius: 4,
                    borderRadiusApplication: "end",
                    horizontal: true,
                },
            },
            dataLabels: {
                enabled: true,
                style: {
                    colors: ["#333"],
                },
            },
            xaxis: {
                categories:
                    dataRequestAndClientDataReceived?.top_delays?.map(
                        (item) => item.company_name || []
                    ) || [],
            },
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            const [
                investmentRes,
                distrubutionMultipleLocationsRes,
                typeOfSystemsRes,
                payrollOverviewDataR,
                payrollOverviewDataR2,
                averageDelayRes,
                explanationOfEmployeeCountRes,
            ] = await Promise.allSettled([
                fetchInvestmentDeclarationStatusByCompany(selectedCompany),
                fetchDistributionOfEmployeeAcrossMultipleEntitiesOrLocations(
                    selectedCompany
                ),
                fetchTypeOfSystemsUsedByEmployer(selectedCompany),
                fetchTotalEmployeeCount(selectedCompany),
                fetchPayrollsClosedOnOrAheadOfSlaPercentage(selectedCompany),
                fetchAverageDelayBetweenDataRequestDateAndClientDataReceivedDate(
                    selectedCompany
                ),
                fetchExplanationOfEmployeeCount(selectedCompany),
            ]);
            if (investmentRes.status === "fulfilled") {
                setInvestmentData(investmentRes.value);
            } else if (investmentRes.status === "rejected") {
                setInvestmentData(investmentRes.reason?.status || []); // Set to empty array on error
            }

            if (distrubutionMultipleLocationsRes.status === "fulfilled") {
                setDistributionOfEmployee(distrubutionMultipleLocationsRes.value);
            } else if (distrubutionMultipleLocationsRes.status === "rejected") {
                setDistributionOfEmployee(
                    distrubutionMultipleLocationsRes.reason?.status || []
                ); // Set to empty array on error
            }

            if (typeOfSystemsRes.status === "fulfilled") {
                setSystemUseByEmp(typeOfSystemsRes.value || []);
            } else if (typeOfSystemsRes.status === "rejected") {
                setSystemUseByEmp(typeOfSystemsRes.reason?.status || []); // Set to empty array on error
            }

            if (payrollOverviewDataR.status === "fulfilled") {
                setPayrollOverviewData((prev) => ({
                    ...prev,
                    total_employees: payrollOverviewDataR.value.employee_count,
                }));
            } else if (payrollOverviewDataR.status === "rejected") {
                setPayrollOverviewData(payrollOverviewDataR.reason?.status || []); // Set to empty array on error
            }

            if (payrollOverviewDataR2.status === "fulfilled") {
                setPayrollOverviewData((prev) => ({
                    ...prev,
                    late_percent: payrollOverviewDataR2.value.late_percent,
                    on_time_delivery:
                        payrollOverviewDataR2.value.on_time_delivery_good_percent,
                    turnaround_health_average_days:
                        payrollOverviewDataR2.value.average_sla_processing_days,
                    turnaround_health_target_days:
                        payrollOverviewDataR2.value.sum_sla_days,
                }));
            } else if (payrollOverviewDataR2.status === "rejected") {
                setPayrollOverviewData(payrollOverviewDataR2.reason?.status || []); // Set to empty array on error
            }

            if (averageDelayRes.status === "fulfilled") {
                setDataRequestAndClientDataReceived(averageDelayRes.value || []);
            } else if (averageDelayRes.status === "rejected") {
                setDataRequestAndClientDataReceived(
                    averageDelayRes.reason?.status || []
                ); // Set to empty array on error
            }
            if (explanationOfEmployeeCountRes.status === "fulfilled") {
                setExplanationOfEmployeeCount(explanationOfEmployeeCountRes.value);
            } else if (explanationOfEmployeeCountRes.status === "rejected") {
                setExplanationOfEmployeeCount(
                    explanationOfEmployeeCountRes.reason?.status || []
                ); // Set to empty array on error
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
    const payrollDashboardConfig = [
        /* =======================
           STATS CARDS (Top Row)
        ======================== */
        {
            id: "ps-1",
            type: "stat",
            title: "Total Employees",
            valueKey: "total_employees",
            badge: {
                type: "success",
                valueKey: "total_count",
                suffix: "entities"
            },
            footnote: "Managed across all payroll platforms"
        },
        {
            id: "ps-2",
            type: "stat",
            title: "Turnaround Health",
            valueKey: "turnaround_health_average_days",
            unit: "days",
            badge: {
                type: "warning",
                label: "SLA target",
                valueKey: "turnaround_health_target_days",
                unit: "days"
            },
            footnote: "Average actual processing time"
        },
        {
            id: "ps-3",
            type: "stat",
            title: "On-time Delivery",
            valueKey: "on_time_delivery",
            unit: "%",
            badge: {
                type: "warning",
                valueKey: "late_percent",
                suffix: "% Delay"
            },
            footnote: "Payrolls closed on or ahead of SLA"
        },

        {
            id: "ps-4",
            type: "chart",
            chartType: "donut",
            title: "Breakdown of Investment declaration status by Company",
            format: investmentDataFormate,
            drawer: null
        },
        {
            id: "ps-5",
            type: "chart",
            chartType: "bar",
            title:
                "Top 5 average delay between data request date and client data received date by company",
            format: dataRequestAndClientDataReceivedFormat,
            drawer: {
                side: "left",
                title:
                    "Average delay between data request date and client data received date by company",
                dataKey: "rest_delays",
                categoryKey: "company_name"
            }
        },

        /* =======================
           CHARTS – ROW 2
        ======================== */
        {
            id: "ps-6",
            type: "chart",
            chartType: "bar",
            title: "Type of Systems Used by Employer",
            format: systemUsedByEmpFormat,
            drawer: null
        },
        {
            id: "ps-7",
            type: "chart",
            chartType: "pie",
            title:
                "Distribution of Company across Multiple Entities / Locations (Y/N)",
            format: distributionOfEmployeeFormate,
            drawer: null
        },

        /* =======================
           TABLE
        ======================== */
        {
            id: "ps-8",
            type: "table",
            title: "Explanation for Employee count",
            rowDataKey: "explanationOfEmployeeCount",
            columnDefs: columnDefs,
            pagination: true,
            pageSize: 5
        }
    ];

    return (
        <div>
            <Snackbars
                issnackbarsOpen={issnackbarsOpen}
                setIsSnackbarsOpen={setIsSnackbarsOpen}
            />

            <div className="client-onboarding-content">
                <div className="stats-grid">
                    {payrollDashboardConfig
                        .filter((item) => item.type === "stat")
                        .map((stat) => (
                            shouldShow(stat.id) ? (
                                <div
                                    key={stat.id}
                                    className={`payroll-stat-card performer-card high-performer ${cardClass(
                                        stat.id,
                                        "returns"
                                    )}`}
                                    onClick={canSelect ? () => handleSelect(stat.id) : undefined}
                                    style={{ cursor: canSelect ? "pointer" : "default" }}
                                >
                                    <input
                                        type="checkbox"
                                        className="chart-select-checkbox"
                                        onChange={() => toggleChartSelection(stat.id)}
                                        checked={selectedCharts.includes(stat.id)}
                                        disabled={!current?.user_name}
                                    />

                                    <div className="stat-label">{stat.title}</div>

                                    <div className="stat-number">
                                        {payrollOverviewData?.[stat.valueKey] || 0}
                                        {stat.unit === "%"
                                            ? "%"
                                            : stat.unit === "days"
                                                ? payrollOverviewData?.[stat.valueKey] > 1
                                                    ? " days"
                                                    : " day"
                                                : ""}
                                    </div>

                                    <span
                                        className={`summary-card-badge summary-card-badge-${stat.badge.type}`}
                                    >
                                        {stat.badge.label ? `${stat.badge.label} ` : ""}
                                        {stat.badge.valueKey === "total_count"
                                            ? systemUseByEmp?.[stat.badge.valueKey] || 0
                                            : payrollOverviewData?.[stat.badge.valueKey] || 0}
                                        {stat.badge.unit === "days"
                                            ? payrollOverviewData?.[stat.badge.valueKey] > 1
                                                ? " days"
                                                : " day"
                                            : stat.badge.suffix
                                                ? ` ${stat.badge.suffix}`
                                                : ""}
                                    </span>

                                    <div className="summary-card-divider mt-3"></div>
                                    <div className="mt-2 summary-card-footnote">
                                        {stat.footnote}
                                    </div>
                                </div>
                            ) : null

                        ))}
                </div>

                <div className="charts-grid mb-4">

                    {/* ps-4 */}
                    {shouldShow("ps-4") && (
                        <div
                            className={`chart-card ${cardClass("ps-4") ? "selected-card" : ""}`}
                            onClick={canSelect ? () => handleSelect("ps-4") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >
                            <div className="d-flex justify-content-end align-items-center">
                                <input
                                    type="checkbox"
                                    className="chart-select-checkbox"
                                    onChange={() => toggleChartSelection("ps-4")}
                                    checked={selectedCharts.includes("ps-4")}
                                    disabled={!current?.user_name}
                                />

                                <div
                                    className="dashboard-icon ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenDrawer(
                                            "left",
                                            "Breakdown of Investment declaration status by Company",
                                            investmentData?.rest_delays,
                                            investmentData?.rest_delays?.map(
                                                (item) => item.company_name
                                            ),
                                            investmentData?.payrollServicesRecords,
                                            investmentData?.columns
                                        );
                                    }}
                                >
                                    <ArrowUpRight />
                                </div>
                            </div>

                            <div className="mb-3 fw-600">
                                Breakdown of Investment declaration status by Company
                            </div>

                            <Chart
                                options={investmentDataFormate.options}
                                series={investmentDataFormate.series}
                                type="donut"
                                height={380}
                            />
                        </div>
                    )}

                    {/* ps-5 */}
                    {shouldShow("ps-5") && (
                        <div
                            className={`chart-card ${cardClass("ps-5") ? "selected-card" : ""}`}
                            onClick={canSelect ? () => handleSelect("ps-5") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >
                            <div className="d-flex justify-content-end align-items-center">
                                <input
                                    type="checkbox"
                                    className="chart-select-checkbox"
                                    onChange={() => toggleChartSelection("ps-5")}
                                    checked={selectedCharts.includes("ps-5")}
                                    disabled={!current?.user_name}
                                />

                                <div
                                    className="dashboard-icon ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenDrawer(
                                            "left",
                                            "Average delay between data request date and client data received date by company",
                                            dataRequestAndClientDataReceived?.rest_delays,
                                            dataRequestAndClientDataReceived?.rest_delays?.map(
                                                (item) => item.company_name
                                            ),
                                            dataRequestAndClientDataReceived?.payrollServicesRecords,
                                            dataRequestAndClientDataReceived?.columns
                                        );
                                    }}
                                >
                                    <ArrowUpRight />
                                </div>
                            </div>

                            <div className="mb-3 fw-600">
                                Top 5 average delay between data request date and client data received date by company
                            </div>

                            <Chart
                                options={dataRequestAndClientDataReceivedFormat.options}
                                series={dataRequestAndClientDataReceivedFormat.series}
                                type="bar"
                                height={380}
                            />
                        </div>
                    )}
                </div>

                <div className="charts-grid mb-4">

                    {/* ps-6 */}
                    {shouldShow("ps-6") && (
                        <div
                            className={`chart-card ${cardClass("ps-6") ? "selected-card" : ""}`}
                            onClick={canSelect ? () => handleSelect("ps-6") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >
                            <div className="d-flex justify-content-end align-items-center">
                                <input
                                    type="checkbox"
                                    className="chart-select-checkbox"
                                    onChange={() => toggleChartSelection("ps-6")}
                                    checked={selectedCharts.includes("ps-6")}
                                    disabled={!current?.user_name}
                                />

                                <div
                                    className="dashboard-icon ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenDrawer(
                                            "left",
                                            "Type of Systems Used by Employer",
                                            systemUseByEmp?.system_used_by_employer,
                                            systemUseByEmp?.system_used_by_employer?.map(
                                                (item) => item.system_used
                                            ),
                                            systemUseByEmp?.payrollServicesRecords,
                                            systemUseByEmp?.columns
                                        );
                                    }}
                                >
                                    <ArrowUpRight />
                                </div>
                            </div>

                            <div className="mb-3 fw-600">
                                Type of Systems Used by Employer
                            </div>

                            <Chart
                                options={systemUsedByEmpFormat.options}
                                series={systemUsedByEmpFormat.series}
                                type="bar"
                                height={380}
                            />
                        </div>
                    )}

                    {/* ps-7 */}
                    {shouldShow("ps-7") && (
                        <div
                            className={`chart-card ${cardClass("ps-7") ? "selected-card" : ""}`}
                            onClick={canSelect ? () => handleSelect("ps-7") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >
                            <div className="d-flex justify-content-end align-items-center">
                                <input
                                    type="checkbox"
                                    className="chart-select-checkbox"
                                    onChange={() => toggleChartSelection("ps-7")}
                                    checked={selectedCharts.includes("ps-7")}
                                    disabled={!current?.user_name}
                                />

                                <div
                                    className="dashboard-icon ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenDrawer(
                                            "left",
                                            " Distribution of Company across Multiple Entities / Locations (Y/N)",
                                            distributionOfEmployee?.system_used_by_employer,
                                            distributionOfEmployee?.system_used_by_employer?.map(
                                                (item) => item.system_used
                                            ),
                                            distributionOfEmployee?.payrollServicesRecords,
                                            distributionOfEmployee?.columns
                                        );
                                    }}
                                >
                                    <ArrowUpRight />
                                </div>
                            </div>

                            <div className="mb-3 fw-600">
                                Distribution of Company across Multiple Entities / Locations (Y/N)
                            </div>

                            <Chart
                                options={distributionOfEmployeeFormate.options}
                                series={distributionOfEmployeeFormate.series}
                                type="pie"
                                height={380}
                            />
                        </div>
                    )}
                </div>

                {shouldShow("ps-8") && (
                    <div
                        className={`chart-card ${cardClass("ps-8") ? "selected-card" : ""}`}
                        onClick={canSelect ? () => handleSelect("ps-8") : undefined}
                        style={{ height: '515px' }}
                    >
                        <div className="ag-theme-quartz" style={{ height: "400px", width: "100%", marginTop: "1rem" }}>
                            <div className="mb-3 fw-600">Explanation for Employee count</div>
                            <AgGridReact
                                theme="legacy"
                                rowData={explanationOfEmployeeCount || []}
                                columnDefs={columnDefs}
                                pagination
                                paginationPageSize={20}
                            />
                        </div>
                    </div>
                )}
            </div>
            <DashboardDrawerGrid
                anchor={drawerAnchor}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                data={drawerData}
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

export default PayrollServices;
