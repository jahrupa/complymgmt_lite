import React, { useMemo, useState } from "react";
import "../../style/clientOnbordingDashboard.css";
import "../../style/PayrollServicesDashboard.css";
import Chart from 'react-apexcharts';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const PayrollServices = () => {
    const [investmentData, setInvestmentData] = React.useState({
        series: [17, 18],
        options: {
            chart: {
                width: 380,
                type: "pie",
            },
            colors: ["#FBDCB8", "#F5D3CC"],
            fill: {
                opacity: 1,
                colors: ["#FBDCB8", "#F5D3CC"],

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

            labels: ["Yes", "No"],
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
    });
    const [distributionOfEmployee, setDistributionOfEmployee] = React.useState({
        series: [17, 18],
        options: {
            chart: {
                width: 380,
                type: "pie",
            },
            colors: ["#cfa4f080", "#e8a8ee"],
            fill: {
                opacity: 1,
                colors: ["#cfa4f080", "#e8a8ee"],

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

            labels: ["Yes", "No"],
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
    });

    const employeeCountData = [
        {
            "emp_count": 2053,
            "company_name": "ABC Pvt Ltd",
            "service_month": "January 2025",
            "record": 1
        },
        {
            "emp_count": 528,
            "company_name": "XYZ Solutions",
            "service_month": "February 2025",
            "record": 1
        },
        {
            "emp_count": 401,
            "company_name": "TechNova Inc",
            "service_month": "March 2025",
            "record": 2
        }
    ]
    const columnDefs = useMemo(
        () => [
            { headerName: "Employee Count (sum)", field: "emp_count", sortable: true, filter: true ,flex:'1'},
            { headerName: "Company Name", field: "company_name", sortable: true, filter: true ,flex:'1'},
            { headerName: "Service Month", field: "service_month", sortable: true, filter: true ,flex:'1'},
            { headerName: "Record", field: "record", sortable: true, filter: true ,flex:'1'},
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
    const [systemUseByEmp] = useState({
        series: [
            {
                name: "Employee Count",
                data: systemEmployeeCounts, // Y-axis values (Sum of Employee Count)
            },
        ],
        options: {
            chart: {
                type: "bar",
                // height: 350,
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
                categories: systemCategories, // X-axis categories (Payroll Service Type)
                title: {
                    // text: "Payroll Service Type",
                    // style: { fontWeight: "bold" },
                },
            },
            yaxis: {
                title: {
                    text: "Employee Count",
                    style: { fontWeight: "bold" },
                },
                min: 0,
                // max: Math.ceil(Math.max(...employeeCounts) / 10) * 10, // auto-adjust up to K
                tickAmount: 5,
            },
            colors: ["#3dba11"],
            fill: {
                opacity: 1,
                colors: ["#3dba11"],
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


    const [dataRequestAndClientDataReceived, setDataRequestAndClientDataReceived] = React.useState({

        series: [{
            data: [18, 4, 8, 70, 40, 50, 9, 10, 20, 8]
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350
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
                categories: ['Balaji', 'Hotel OM', 'Hotel Tunga', 'siriram Filteration', 'KPR Mill', 'Sri Saravana', 'Sri Venkateswara'],
            }
        },


    });
    return (
        <div>
            {" "}
            <div className="">
                <div className="client-onboarding-content">
                    <div className="stats-grid">
                        <div className="payroll-stat-card performer-card high-performer">
                            <div className="stat-label">Total Employees</div>
                            <div className="stat-number">5,738</div>
                            <span className="summary-card-badge summary-card-badge-success">
                                36 entities
                            </span>
                            <div className="summary-card-divider mt-3"></div>
                            <div className="mt-2 summary-card-footnote">
                                Managed across all payroll platforms
                            </div>
                        </div>
                        <div className="payroll-stat-card performer-card compliant">
                            <div className="stat-label">Turnaround Health</div>
                            <div className="stat-number">
                                2.9 days
                            </div>
                            <span className="summary-card-badge summary-card-badge-warning">
                                SLA target 2.2d
                            </span>
                            <div className="summary-card-divider mt-3"></div>
                            <div className="mt-2 summary-card-footnote">
                                Average actual processing time
                            </div>

                        </div>
                        <div className="payroll-stat-card performer-card moderate">
                            <div className="stat-label">On-time Delivery</div>
                            <div className="stat-number">58%</div>
                            <span className="summary-card-badge summary-card-badge-warning">
                                21 approvals
                            </span>
                            <div className="summary-card-divider mt-3"></div>
                            <div className="mt-2 summary-card-footnote">
                                Payrolls closed on or ahead of SLA
                            </div>
                        </div>
                        <div className="payroll-stat-card performer-card good">
                            <div className="stat-label">Compliance Alerts</div>
                            <div className="stat-number">5</div>
                            <span className="summary-card-badge summary-card-badge-warning">
                                Focus: Client Dependency
                            </span>
                            <div className="summary-card-divider mt-3"></div>
                            <div className="mt-2 summary-card-footnote">
                                Entities needing follow-up
                            </div>
                        </div>
                    </div>
                    <div className="charts-grid mb-4">
                        <div className="chart-card">
                            <div className="mb-3 fw-600">Breakdown of Investment declaration status by Count of Employee count</div>

                            <Chart
                                options={investmentData.options} series={investmentData.series} type="pie" height={380}
                            />
                        </div>
                        <div className="chart-card">
                            <div className="mb-3 fw-600">Sum Employee Count for each Payroll Service Type</div>

                            <Chart
                                options={employeeCountForEachPayroll.options} series={employeeCountForEachPayroll.series} type="bar" height={380}
                            />
                        </div>
                    </div>

                    <div className="chart-card mb-4">
                        <div className="mb-3 fw-600">Average delay between data request date and client data received date by company</div>
                        <Chart options={dataRequestAndClientDataReceived.options} series={dataRequestAndClientDataReceived.series} type="bar" height={380} />
                    </div>

                    <div className="charts-grid mb-4">
                        <div className="chart-card">
                            <div className="mb-3 fw-600">System Used by Employer has the highest Employee Count</div>

                            <Chart
                                options={systemUseByEmp.options} series={systemUseByEmp.series} type="bar" height={380}
                            />
                        </div>
                        <div className="chart-card">
                            <div className="mb-3 fw-600">Distribution of Employee Count across Multiple Entities / Locations (Y/N)</div>

                            <Chart
                                options={distributionOfEmployee.options} series={distributionOfEmployee.series} type="pie" height={380}
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
                                rowData={employeeCountData}
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
