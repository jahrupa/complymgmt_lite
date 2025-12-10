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

ModuleRegistry.registerModules([AllCommunityModule]);

const PayrollServices = ({
    selectedCompany,
    current,
    setSelectedCharts,
    selectedCharts,
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
    const userRole = decryptData(localStorage.getItem("user_role"));
    const handleOpenDrawer = (anchor, title, data = [], chartXaxisCategory) => {
        setDrawerAnchor(anchor);
        setDrawerTitle(title);
        setDrawerOpen(true);
        setDrawerData(data);
        setChartXaxisCategory(chartXaxisCategory);
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
                console.warn("fetchAllInvestments failed:", investmentRes.reason);
                setInvestmentData(investmentRes.reason?.status || []); // Set to empty array on error
            }

            if (distrubutionMultipleLocationsRes.status === "fulfilled") {
                setDistributionOfEmployee(distrubutionMultipleLocationsRes.value);
            } else if (distrubutionMultipleLocationsRes.status === "rejected") {
                console.warn(
                    "fetchAllDistributions failed:",
                    distrubutionMultipleLocationsRes.reason
                );
                setDistributionOfEmployee(
                    distrubutionMultipleLocationsRes.reason?.status || []
                ); // Set to empty array on error
            }

            if (typeOfSystemsRes.status === "fulfilled") {
                setSystemUseByEmp(typeOfSystemsRes.value || []);
            } else if (typeOfSystemsRes.status === "rejected") {
                console.warn("fetchAllDistributions failed:", typeOfSystemsRes.reason);
                setSystemUseByEmp(typeOfSystemsRes.reason?.status || []); // Set to empty array on error
            }

            if (payrollOverviewDataR.status === "fulfilled") {
                setPayrollOverviewData((prev) => ({
                    ...prev,
                    total_employees: payrollOverviewDataR.value.employee_count,
                }));
            } else if (payrollOverviewDataR.status === "rejected") {
                console.warn(
                    "fetchAllDistributions failed:",
                    payrollOverviewDataR.reason
                );
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
                console.warn(
                    "fetchAllDistributions failed:",
                    payrollOverviewDataR2.reason
                );
                setPayrollOverviewData(payrollOverviewDataR2.reason?.status || []); // Set to empty array on error
            }

            if (averageDelayRes.status === "fulfilled") {
                setDataRequestAndClientDataReceived(averageDelayRes.value || []);
            } else if (averageDelayRes.status === "rejected") {
                console.warn("fetchAllDistributions failed:", averageDelayRes.reason);
                setDataRequestAndClientDataReceived(
                    averageDelayRes.reason?.status || []
                ); // Set to empty array on error
            }
            if (explanationOfEmployeeCountRes.status === "fulfilled") {
                setExplanationOfEmployeeCount(explanationOfEmployeeCountRes.value);
            } else if (explanationOfEmployeeCountRes.status === "rejected") {
                console.warn(
                    "fetchAllDistributions failed:",
                    explanationOfEmployeeCountRes.reason
                );
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

    return (
        <div>
            <Snackbars
                issnackbarsOpen={issnackbarsOpen}
                setIsSnackbarsOpen={setIsSnackbarsOpen}
            />
            {" "}
            <div className="">
                <div className="client-onboarding-content">
                    <div className="stats-grid">
                        <div
                            className={`payroll-stat-card performer-card high-performer ${cardClass("ps-1", "returns")}`}
                            onClick={canSelect ? () => handleSelect("ps-1") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("ps-1")}
                                checked={selectedCharts.includes("ps-1")}
                                disabled={!current?.user_name}
                            />
                            <div className="stat-label">Total Employees</div>
                            <div className="stat-number">
                                {payrollOverviewData.total_employees
                                    ? payrollOverviewData.total_employees
                                    : 0}
                            </div>
                            <span className="summary-card-badge summary-card-badge-success">
                                {systemUseByEmp.total_count ? systemUseByEmp.total_count : 0}{" "}
                                entities
                            </span>
                            <div className="summary-card-divider mt-3"></div>
                            <div className="mt-2 summary-card-footnote">
                                Managed across all payroll platforms
                            </div>
                        </div>
                        <div className={`payroll-stat-card performer-card high-performer ${cardClass("ps-2", "compliant")}`}
                            onClick={canSelect ? () => handleSelect("ps-2") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}>
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("ps-2")}
                                checked={selectedCharts.includes("ps-2")}
                                disabled={!current?.user_name}
                            />
                            <div className="stat-label">Turnaround Health</div>
                            <div className="stat-number">
                                {payrollOverviewData.turnaround_health_average_days
                                    ? payrollOverviewData.turnaround_health_average_days
                                    : 0}{" "}
                                {payrollOverviewData.turnaround_health_average_days
                                    ? payrollOverviewData.turnaround_health_average_days > 1
                                        ? "days"
                                        : "day"
                                    : ""}
                            </div>
                            <span className="summary-card-badge summary-card-badge-warning">
                                SLA target{" "}
                                {payrollOverviewData?.turnaround_health_target_days
                                    ? payrollOverviewData.turnaround_health_target_days
                                    : 0}{" "}
                                {payrollOverviewData?.turnaround_health_target_days
                                    ? payrollOverviewData.turnaround_health_target_days > 1
                                        ? "days"
                                        : "day"
                                    : ""}
                            </span>
                            <div className="summary-card-divider mt-3"></div>
                            <div className="mt-2 summary-card-footnote">
                                Average actual processing time
                            </div>
                        </div>
                        <div className={`payroll-stat-card performer-card high-performer ${cardClass("ps-3", "moderate")}`}
                            onClick={canSelect ? () => handleSelect("ps-3") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}>
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("ps-3")}
                                checked={selectedCharts.includes("ps-3")}
                                disabled={!current?.user_name}
                            />
                            <div className="stat-label">On-time Delivery</div>
                            <div className="stat-number">
                                {payrollOverviewData.on_time_delivery
                                    ? payrollOverviewData.on_time_delivery
                                    : 0}
                                %
                            </div>
                            <span className="summary-card-badge summary-card-badge-warning">
                                {payrollOverviewData.late_percent
                                    ? payrollOverviewData.late_percent
                                    : 0}
                                % Delay
                            </span>
                            <div className="summary-card-divider mt-3"></div>
                            <div className="mt-2 summary-card-footnote">
                                Payrolls closed on or ahead of SLA
                            </div>
                        </div>
                    </div>
                    <div className="charts-section mb-4">
                        <div
                            className={`chart-card ${cardClass("ps-4", "returns")}`}
                            onClick={canSelect ? () => handleSelect("ps-4") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >
                            <div
                                className="d-flex justify-content-end align-items-center"

                            >
                                <input
                                    type="checkbox"
                                    className="chart-select-checkbox"
                                    onChange={() => toggleChartSelection("ps-4")}
                                    checked={selectedCharts.includes("ps-4")}
                                    disabled={!current?.user_name}
                                />
                                <div className="dashboard-icon ms-2" onClick={
                                    () => setIsSnackbarsOpen({
                                        ...issnackbarsOpen,
                                        open: true,
                                        message: "No Data available",
                                        severityType: "info",
                                    })}>
                                    <ArrowUpRight />
                                </div>
                            </div>
                            <div className="mb-3 fw-600">
                                Breakdown of Investment declaration status by Company{" "}
                            </div>
                            <Chart
                                options={investmentDataFormate.options}
                                series={investmentDataFormate.series}
                                type="donut"
                                height={380}
                            />
                        </div>
                        <div
                            className={`chart-card ${cardClass("ps-5", "returns")}`}
                            onClick={canSelect ? () => handleSelect("ps-5") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >
                            <div
                                className="d-flex justify-content-end align-items-center"

                            >
                                <input
                                    type="checkbox"
                                    className="chart-select-checkbox"
                                    onChange={() => toggleChartSelection("ps-5")}
                                    checked={selectedCharts.includes("ps-5")}
                                    disabled={!current?.user_name}
                                />
                                <div
                                    className="dashboard-icon ms-2"
                                    onClick={() =>
                                        handleOpenDrawer(
                                            "left",
                                            "average delay between data request date and client data received date by company",
                                            dataRequestAndClientDataReceived?.rest_delays,
                                            dataRequestAndClientDataReceived?.rest_delays?.map(
                                                (item) => item.company_name
                                            )
                                        )
                                    }
                                >
                                    <ArrowUpRight />
                                </div>
                            </div>
                            <div className="mb-3 fw-600">
                                Top 5 average delay between data request date and client data
                                received date by company
                            </div>
                            <Chart
                                options={dataRequestAndClientDataReceivedFormat.options}
                                series={dataRequestAndClientDataReceivedFormat.series}
                                type="bar"
                                height={380}
                            />
                        </div>
                    </div>
                    <div className="charts-section mb-4">
                        <div className={`chart-card ${cardClass("ps-6", "returns")}`}
                            onClick={canSelect ? () => handleSelect("ps-6") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}>
                            <div
                                className="d-flex justify-content-end align-items-center"

                            >
                                <input
                                    type="checkbox"
                                    className="chart-select-checkbox"
                                    onChange={() => toggleChartSelection("ps-6")}
                                    checked={selectedCharts.includes("ps-6")}
                                    disabled={!current?.user_name}
                                />
                                <div className="dashboard-icon ms-2" onClick={
                                    () => setIsSnackbarsOpen({
                                        ...issnackbarsOpen,
                                        open: true,
                                        message: "No Data available",
                                        severityType: "info",
                                    })}>
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
                        <div className={`chart-card ${cardClass("ps-7", "returns")}`}
                            onClick={canSelect ? () => handleSelect("ps-7") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}>
                            <div
                                className="d-flex justify-content-end align-items-center"

                            >
                                <input
                                    type="checkbox"
                                    className="chart-select-checkbox"
                                    onChange={() => toggleChartSelection("ps-7")}
                                    checked={selectedCharts.includes("ps-7")}
                                    disabled={!current?.user_name}
                                />
                                <div className="dashboard-icon ms-2" onClick={
                                    () => setIsSnackbarsOpen({
                                        ...issnackbarsOpen,
                                        open: true,
                                        message: "No Data available",
                                        severityType: "info",
                                    })}>
                                    <ArrowUpRight />
                                </div>
                            </div>
                            <div className="mb-3 fw-600">
                                Distribution of Company across Multiple Entities / Locations
                                (Y/N)
                            </div>

                            <Chart
                                options={distributionOfEmployeeFormate.options}
                                series={distributionOfEmployeeFormate.series}
                                type="pie"
                                height={380}
                            />
                        </div>
                    </div>
                    <div className={`dashboard-table-card d-lg-flex d-md-flex justify-content-between ${cardClass("ps-8") ? "selected-card" : ""}`}
                        onClick={canSelect ? () => handleSelect("ps-8") : undefined}
                        style={{ cursor: canSelect ? "pointer" : "default", height: "520px" }}>
                        <div
                            className="ag-theme-quartz"
                            style={{ height: "400px", width: "100%", marginTop: "1rem" }}
                        >
                            <div className="d-lg-flex d-md-flex justify-content-lg-between justify-content-md-between align-items-center">
                                <div className=" fw-600">Explanation for Employee count</div>

                                <div
                                    className="d-flex justify-content-lg-end justify-content-md-end align-items-center"

                                >
                                    <input
                                        type="checkbox"
                                        className="chart-select-checkbox"
                                        onChange={() => toggleChartSelection("ps-8")}
                                        checked={selectedCharts.includes("ps-8")}
                                        disabled={!current?.user_name}
                                    />

                                </div>

                            </div>
                            <AgGridReact
                                theme="legacy"
                                rowData={explanationOfEmployeeCount}
                                columnDefs={columnDefs}
                                pagination={true}
                                paginationPageSize={5}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* )} */}
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

export default PayrollServices;
