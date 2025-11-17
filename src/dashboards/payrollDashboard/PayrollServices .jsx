import React, { useEffect, useMemo, useState } from "react";
import "../../style/clientOnbordingDashboard.css";
import "../../style/PayrollServicesDashboard.css";
import Chart from 'react-apexcharts';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { fetchAverageDelayBetweenDataRequestDateAndClientDataReceivedDate, fetchDistributionOfEmployeeAcrossMultipleEntitiesOrLocations, fetchExplanationOfEmployeeCount, fetchInvestmentDeclarationStatusByCompany, fetchPayrollsClosedOnOrAheadOfSlaPercentage, fetchTotalEmployeeCount, fetchTypeOfSystemsUsedByEmployer } from "../../api/service";

ModuleRegistry.registerModules([AllCommunityModule]);

const PayrollServices = ({selectedCompany}) => {
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
        series: [investmentData.count_yes || 0, investmentData.count_no || 0, investmentData.count_empty || 0],
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
    }
    const [distributionOfEmployee, setDistributionOfEmployee] = useState({});
    const distributionOfEmployeeFormate = {
        series: [distributionOfEmployee.count_yes || 0, distributionOfEmployee.count_no || 0, distributionOfEmployee.count_empty || 0],
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

    }
    const [explanationOfEmployeeCount, setExplanationOfEmployeeCount] = useState([]);
    const columnDefs = useMemo(
        () => [
            { headerName: "Employee Count (sum)", field: "employee_count", sortable: true, filter: true, flex: '1' },
            { headerName: "Company Name", field: "company_name", sortable: true, filter: true, flex: '1' },
            { headerName: "Company Common Name", field: "company_common_name", sortable: true, filter: true, flex: '1' },
            { headerName: "Service Month", field: "service_month", sortable: true, filter: true, flex: '1' },
            { headerName: "Service Frequency", field: "service_frequency", sortable: true, filter: true, flex: '1' },
        ],
        []
    );

    const employeeCountForEachPayrollData = [
        { serviceType: "In-house", employeeCount: 1120 },
        { serviceType: "Outsourced", employeeCount: 85 },
        { serviceType: "Hybrid", employeeCount: 60 },
        { serviceType: "Contract", employeeCount: 45 },
    ];

    // Extract categories and data
    const categories = employeeCountForEachPayrollData.map((item) => item.serviceType);
    const employeeCounts = employeeCountForEachPayrollData.map((item) => item.employeeCount);

    const [employeeCountForEachPayroll] = useState({
        series: [
            {
                name: "Employee Count",
                data: employeeCounts, // Y-axis values (Sum of Employee Count)
            },
        ],
        options: {
            chart: {
                type: "bar",
                height: 380,
                toolbar: { show: false },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    // borderRadius: 6,
                    //   columnWidth: "55%",
                },
            },
            dataLabels: {
                enabled: false,
                style: {
                    colors: ["#333"],
                },
            },
            xaxis: {
                categories: categories, // X-axis categories (Payroll Service Type)
                title: {
                    text: "Payroll Service Type",
                    style: { fontWeight: "bold" },
                },
            },
            yaxis: {
                title: {
                    text: "Sum of Employee Count",
                    style: { fontWeight: "bold" },
                },
                min: 0,
                max: Math.ceil(Math.max(...employeeCounts) / 10) * 10, // auto-adjust up to K
                tickAmount: 5,
            },
            colors: ["#f5d3cc"],
            fill: {
                opacity: 1,
                colors: ["#f5d3cc"],
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

            //   title: {
            //     text: "Sum of Employee Count per Payroll Service Type",
            //     align: "center",
            //   },
            //   grid: {
            //     borderColor: "#e7e7e7",
            //     row: {
            //       colors: ["#f3f3f3", "transparent"],
            //       opacity: 0.5,
            //     },
            //   },
        },
    });
    const employeeCountForSystemUse = [
        { serviceType: "SmoothPay", employeeCount: 120 },
        { serviceType: "Opportune", employeeCount: 85 },
        { serviceType: "ZingHR", employeeCount: 60 },
        { serviceType: "Greyt HR", employeeCount: 45 },
    ];

    // Extract categories and data
    const systemCategories = employeeCountForSystemUse.map((item) => item.serviceType);
    const systemEmployeeCounts = employeeCountForSystemUse.map((item) => item.employeeCount);
    const [systemUseByEmp, setSystemUseByEmp] = useState([]);
    const systemUsedByEmpFormat = {
        series: [
            {
                name: "Employee Count",
                data: systemUseByEmp?.system_used_by_employer?.map((item) => item.count), // Y-axis values (Sum of Employee Count)
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
                categories: systemUseByEmp?.system_used_by_employer?.map((item) => item.system_used), // X-axis categories (Payroll Service Type)
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
    }
    const [dataRequestAndClientDataReceived, setDataRequestAndClientDataReceived] = React.useState([]);
    const dataRequestAndClientDataReceivedFormat = {
        series: [{
            name: "Average Days Delayed",
            data: dataRequestAndClientDataReceived?.map((item) => item.average_days_delayed || 0) || [],
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350
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
                    borderRadiusApplication: 'end',
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: true,
                style: {
                    colors: ["#333"],
                },
            },
            xaxis: {
                categories: dataRequestAndClientDataReceived?.map((item) => item.company_name || []) || [],
            }
        },
    }

    useEffect(() => {
        const fetchData = async () => {
            const [investmentRes, distrubutionMultipleLocationsRes, typeOfSystemsRes, payrollOverviewDataR, payrollOverviewDataR2, averageDelayRes, explanationOfEmployeeCountRes] = await Promise.allSettled([
                fetchInvestmentDeclarationStatusByCompany(selectedCompany),
                fetchDistributionOfEmployeeAcrossMultipleEntitiesOrLocations(selectedCompany),
                fetchTypeOfSystemsUsedByEmployer(selectedCompany),
                fetchTotalEmployeeCount(selectedCompany),
                fetchPayrollsClosedOnOrAheadOfSlaPercentage(selectedCompany),
                fetchAverageDelayBetweenDataRequestDateAndClientDataReceivedDate(selectedCompany),
                fetchExplanationOfEmployeeCount(selectedCompany),
            ]);
            if (investmentRes.status === 'fulfilled') {
                setInvestmentData(investmentRes.value);
            } else if (investmentRes.status === 'rejected') {
                console.warn("fetchAllInvestments failed:", investmentRes.reason);
                setInvestmentData(investmentRes.reason?.status || []); // Set to empty array on error
            }

            if (distrubutionMultipleLocationsRes.status === 'fulfilled') {
                setDistributionOfEmployee(distrubutionMultipleLocationsRes.value);
            } else if (distrubutionMultipleLocationsRes.status === 'rejected') {
                console.warn("fetchAllDistributions failed:", distrubutionMultipleLocationsRes.reason);
                setDistributionOfEmployee(distrubutionMultipleLocationsRes.reason?.status || []); // Set to empty array on error
            }

            if (typeOfSystemsRes.status === 'fulfilled') {
                setSystemUseByEmp(typeOfSystemsRes.value || []);
            } else if (typeOfSystemsRes.status === 'rejected') {
                console.warn("fetchAllDistributions failed:", typeOfSystemsRes.reason);
                setSystemUseByEmp(typeOfSystemsRes.reason?.status || []); // Set to empty array on error
            }

            if (payrollOverviewDataR.status === 'fulfilled') {
                setPayrollOverviewData((prev) => ({
                    ...prev,
                    total_employees: payrollOverviewDataR.value.employee_count,
                }));
            } else if (payrollOverviewDataR.status === 'rejected') {
                console.warn("fetchAllDistributions failed:", payrollOverviewDataR.reason);
                setPayrollOverviewData(payrollOverviewDataR.reason?.status || []); // Set to empty array on error
            }

            if (payrollOverviewDataR2.status === 'fulfilled') {
                setPayrollOverviewData((prev) => ({
                    ...prev,
                    late_percent: payrollOverviewDataR2.value.late_percent,
                    on_time_delivery: payrollOverviewDataR2.value.on_time_delivery_good_percent,
                    turnaround_health_average_days: payrollOverviewDataR2.value.average_sla_processing_days,
                }));

            } else if (payrollOverviewDataR2.status === 'rejected') {
                console.warn("fetchAllDistributions failed:", payrollOverviewDataR2.reason);
                setPayrollOverviewData(payrollOverviewDataR2.reason?.status || []); // Set to empty array on error
            }

            if (averageDelayRes.status === 'fulfilled') {
                setDataRequestAndClientDataReceived(averageDelayRes.value?.top_delays || []);
            } else if (averageDelayRes.status === 'rejected') {
                console.warn("fetchAllDistributions failed:", averageDelayRes.reason);
                setDataRequestAndClientDataReceived(averageDelayRes.reason?.status || []); // Set to empty array on error
            }
            if (explanationOfEmployeeCountRes.status === 'fulfilled') {
                setExplanationOfEmployeeCount(explanationOfEmployeeCountRes.value);
            } else if (explanationOfEmployeeCountRes.status === 'rejected') {
                console.warn("fetchAllDistributions failed:", explanationOfEmployeeCountRes.reason);
                setExplanationOfEmployeeCount(explanationOfEmployeeCountRes.reason?.status || []); // Set to empty array on error
            }
        };
        fetchData();
    }, [selectedCompany]);

    return (
        <div>
            {" "}
            <div className="">
                <div className="client-onboarding-content">
                    <div className="stats-grid">
                        <div className="payroll-stat-card performer-card high-performer">
                            <div className="stat-label">Total Employees</div>
                            <div className="stat-number">{payrollOverviewData.total_employees?payrollOverviewData.total_employees:0}</div>
                            <span className="summary-card-badge summary-card-badge-success">
                                {systemUseByEmp.total_count ? systemUseByEmp.total_count : 0} entities
                            </span>
                            <div className="summary-card-divider mt-3"></div>
                            <div className="mt-2 summary-card-footnote">
                                Managed across all payroll platforms
                            </div>
                        </div>
                        <div className="payroll-stat-card performer-card compliant">
                            <div className="stat-label">Turnaround Health</div>
                            <div className="stat-number">
                                {payrollOverviewData.turnaround_health_average_days?payrollOverviewData.turnaround_health_average_days:0} {payrollOverviewData.turnaround_health_average_days?payrollOverviewData.turnaround_health_average_days>1?'days':'day':''} 
                            </div>
                            <span className="summary-card-badge summary-card-badge-warning">
                                SLA target {payrollOverviewData?.turnaround_health_target_days?payrollOverviewData.turnaround_health_target_days:0} {payrollOverviewData?.turnaround_health_target_days?payrollOverviewData.turnaround_health_target_days>1?'days':'day':''} 
                            </span>
                            <div className="summary-card-divider mt-3"></div>
                            <div className="mt-2 summary-card-footnote">
                                Average actual processing time
                            </div>

                        </div>
                        <div className="payroll-stat-card performer-card moderate">
                            <div className="stat-label">On-time Delivery</div>
                            <div className="stat-number">{payrollOverviewData.on_time_delivery?payrollOverviewData.on_time_delivery:0}%</div>
                            <span className="summary-card-badge summary-card-badge-warning">
                                {payrollOverviewData.late_percent?payrollOverviewData.late_percent:0}% Delay
                            </span>
                            <div className="summary-card-divider mt-3"></div>
                            <div className="mt-2 summary-card-footnote">
                                Payrolls closed on or ahead of SLA
                            </div>
                        </div>
                    </div>
                    <div className="charts-section mb-4">
                        <div className="chart-card">
                            <div className="mb-3 fw-600">Breakdown of Investment declaration status by Company </div>

                            <Chart
                                options={investmentDataFormate.options} series={investmentDataFormate.series} type="donut" height={380}
                            />
                        </div>
                          <div className="chart-card">
                        <div className="mb-3 fw-600">Top 5 average delay between data request date and client data received date by company</div>
                        <Chart options={dataRequestAndClientDataReceivedFormat.options} series={dataRequestAndClientDataReceivedFormat.series} type="bar" height={380} />
                    </div>
                    </div>
                    <div className="charts-section mb-4">
                        <div className="chart-card">
                            <div className="mb-3 fw-600">Type of Systems Used by Employer</div>
                            <Chart
                                options={systemUsedByEmpFormat.options} series={systemUsedByEmpFormat.series} type="bar" height={380}
                            />
                        </div>
                        <div className="chart-card">
                            <div className="mb-3 fw-600">Distribution of Company across Multiple Entities / Locations (Y/N)</div>

                            <Chart
                                options={distributionOfEmployeeFormate.options} series={distributionOfEmployeeFormate.series} type="pie" height={380}
                            />
                        </div>
                    </div>

                    <div className="table_div p-3 mb-4">
                        <div className="ag-theme-quartz" style={{ height: '400px', width: '100%', marginTop: '1rem' }}>
                            <div className=" fw-600">
                                Explanation for Employee count
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
                <div className="client-onboarding-content">
                    {/* <div className="chart-card">
              <Chart
                options={servicesChartOptions}
                series={[{ data: servicesData.series }]}
                type="bar"
                height={600}
              /> */}
                </div>
            </div>
            {/* )} */}
        </div>
    );
};

export default PayrollServices;
