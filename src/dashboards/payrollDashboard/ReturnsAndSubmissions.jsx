import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts';
import { fetchCompaniesPerReturnsNames, fetchComplianceRiskDistributionByState, fetchComplianceStatusBasedOnReturns, fetchFrequencyWiseReturns, fetchRemarksBasedOnCompany, fetchReturnApplicabilityByCompanyCommonName, fetchStateWiseAnalysisOfApplicableReturns } from '../../api/service';
const ReturnsAndSubmissions = ({ selectedCompany }) => {
    const employeeCountForSystemUse = [
        { serviceType: "SmoothPay", employeeCount: 120 },
        { serviceType: "Opportune", employeeCount: 85 },
        { serviceType: "ZingHR", employeeCount: 60 },
        { serviceType: "Greyt HR", employeeCount: 45 },
    ];

    // Extract categories and data
    const systemCategories = employeeCountForSystemUse.map((item) => item.serviceType);
    const systemEmployeeCounts = employeeCountForSystemUse.map((item) => item.employeeCount);
    const [comparisonOfReturnApplicability, setComparisonOfReturnApplicability] = useState([]);
    const comparisonOfReturnApplicabilityFormat = {
        series: [
            {
                name: "Distinct Return Obligations",
                data: comparisonOfReturnApplicability?.top_counts?.map((item) => item?.count_of_returns), // Y-axis values (Sum of Employee Count)
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
                categories: comparisonOfReturnApplicability?.top_counts?.map((item) => item?.company_name || "") || [], // X-axis categories (Applicable Returns Count)
                title: {
                    text: "Company Name",
                },
            },
            yaxis: {
                title: {
                    text: "Distinct Return Obligations",
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
    const [companiesPerReturnsNames, setCompaniesPerReturnsNames] = useState([]);
    const companiesPerReturnsNamesFormat = {
        series: [
            {
                name: "Applicable Returns Count",
                data: companiesPerReturnsNames?.top_counts?.map((item) => item?.count_companies), // Y-axis values (Sum of Employee Count)
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
                categories: companiesPerReturnsNames?.top_counts?.map((item) => item?.returns_name), // X-axis categories (Applicable Returns Count)
                // title: {
                //     text: "Applicable Returns Count",
                // },
            },
            // yaxis: {
            //     title: {
            //         text: "State",
            //         style: { fontWeight: "bold" },
            //     },
            //     min: 0,
            //     tickAmount: 5,
            // },
            colors: ["#5ad5e2ff"],
            fill: {
                opacity: 1,
                colors: ["#5ad5e2ff"],
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
    }
    const [applicableReturnsByLocation, setApplicableReturnsByLocation] = useState([]);
    const applicableReturnsByLocationFormat = {
        series: [
            // {
            //     name: '-',
            //     data: applicableReturnsByLocation?.count_remark?.map((item) => item?.count_ -) || []
            // },
            {
                name: 'Empty count',
                data: applicableReturnsByLocation?.map((item) => item?.count_empty) || []
            },
            {
                name: 'Count filed on time',
                data: applicableReturnsByLocation?.map((item) => item?.count_filed_on_time) || []
            }, {
                name: 'Count late filing',
                data: applicableReturnsByLocation?.map((item) => item?.count_late_filing) || []
            }
        ],
        options: {
            chart: {
                type: 'bar',
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
                categories: applicableReturnsByLocation?.map((item) => item?.return_name) || [], // X-axis categories (Company  Name)
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
    const [applicableReturnsByReturnName, setApplicableReturnsByReturnName] = useState({

        series: [
            {
                name: "Completion Rate (%)",
                data: systemEmployeeCounts, // Y-axis values (Sum of Completion Rate (%))
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
                    horizontal: true,
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
                categories: systemCategories, // X-axis categories (Company Common Name)
                title: {
                    text: "Completion Rate (%)",
                    // style: { fontWeight: "bold" },
                },
            },
            yaxis: {
                title: {
                    text: "Return Name",
                    style: { fontWeight: "bold" },
                },
                min: 0,
                // max: Math.ceil(Math.max(...employeeCounts) / 10) * 10, // auto-adjust up to K
                tickAmount: 5,
            },
            colors: ["#609bf3ff"],
            fill: {
                opacity: 1,
                colors: ["#609bf3ff"],
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
    const [applicableReturnsByReturnType, setApplicableReturnsByReturnType] = useState({

        series: [
            {
                name: "Number of Companies",
                data: systemEmployeeCounts, // Y-axis values (Sum of Number of Companies)
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
                categories: systemCategories, // X-axis categories (Company Common Name)
                title: {
                    text: "Number of Companies",
                    // style: { fontWeight: "bold" },
                },
            },
            yaxis: {
                title: {
                    text: "Return Type",
                    style: { fontWeight: "bold" },
                },
                min: 0,
                // max: Math.ceil(Math.max(...employeeCounts) / 10) * 10, // auto-adjust up to K
                tickAmount: 5,
            },
            colors: ["#396fd3ff"],
            fill: {
                opacity: 1,
                colors: ["#396fd3ff"],
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
    const [ApplicableReturnsCount, setApplicableReturnsCount] = React.useState([]);
    const ApplicableReturnsCountFormat = {
        series: ApplicableReturnsCount?.frequency_returns?.map((item) => item?.count) || [],
        options: {
            chart: {
                type: 'donut',
            },
            // Tooltip customization
            tooltip: {
                theme: 'light', // makes all tooltip text black
                style: {
                    fontSize: '14px',
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
            labels: ApplicableReturnsCount?.frequency_returns?.map((item) => item?.frequency) || [],
            colors: ["#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#c8fdf1ff"],
            fill: {
                opacity: 1,
                colors: ["#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#c8fdf1ff"],
            },
            legend: {
                position: 'top',
                // offsetY: 0,
                // height: 230,

            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#000'], // text black
            }
        },
    }
    const [escalationRaisedCategoriesByCompany, setEscalationRaisedCategoriesByCompany] = React.useState([]);
    const escalationRaisedCategoriesByCompanyFormat = {
        series: [{
            name: 'Files Successfully',
            data: escalationRaisedCategoriesByCompany?.count_remark?.map((item) => item?.count_filed_successfully) || [] // Y-axis values (Sum of Employee Count)
        }, {
            name: 'Received late data from KAO',
            data: escalationRaisedCategoriesByCompany?.count_remark?.map((item) => item?.count_received_late_data_from_kao) || []
        },
        {
            name: 'count_empty',
            data: escalationRaisedCategoriesByCompany?.count_remark?.map((item) => item?.count_empty) || []
        }, {
            name: 'count_missing_due_date',
            data: escalationRaisedCategoriesByCompany?.count_remark?.map((item) => item?.count_missing_due_date) || []
        }
        ],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
            },
            // colors: ["#2cafc0ff", "#5ad5e2"],
            fill: {
                opacity: 1,
                // colors: ["#2cafc0ff", "#5ad5e2"],
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
                categories: escalationRaisedCategoriesByCompany?.count_remark?.map((item) => item?.company_name) || [], // X-axis categories (Company Common Name)
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
    const [riskDistributionByState, setRiskDistributionByState] = useState([]);
    const riskDistributionByStateFormat = {

        series: [
            {
                name: "State",
                data: riskDistributionByState?.top_counts?.map((item) => item?.count_of_risk), // Y-axis values (Sum of sate)
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
                    horizontal: true,
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
                categories: riskDistributionByState?.top_counts?.map((item) => item?.state), // X-axis categories (Company Common Name)
                title: {
                    text: "Risk Level Count",
                    // style: { fontWeight: "bold" },
                },
            },
            yaxis: {
                title: {
                    text: "State",
                    style: { fontWeight: "bold" },
                },
                min: 0,
                // max: Math.ceil(Math.max(...employeeCounts) / 10) * 10, // auto-adjust up to K
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
    };
    const [stateWiseAnalysisOfApplicableReturns, setStateWiseAnalysisOfApplicableReturns] = useState([]);
    const applicableReturnsByStateFormat = {
        series: [
            {
                name: "Applicable Returns Count",
                data: stateWiseAnalysisOfApplicableReturns?.top_counts?.map((item) => item?.count_of_applicable_returns), // Y-axis values (Sum of Employee Count)
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
                },
            },
            dataLabels: {
                enabled: false,
                style: {
                    colors: ["#333"],
                },
            },
            xaxis: {
                categories: stateWiseAnalysisOfApplicableReturns?.top_counts?.map((item) => item?.state), // X-axis categories (Applicable Returns Count)
                title: {
                    text: "State",
                    // style: { fontWeight: "bold" },
                },
            },
            yaxis: {
                title: {
                    text: "Applicable Returns Count",
                    style: { fontWeight: "bold" },
                },
                min: 0,
                tickAmount: 5,
            },
            colors: ["#5ad5e2ff"],
            fill: {
                opacity: 1,
                colors: ["#5ad5e2ff"],
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
    }

    useEffect(() => {
        const fetchData = async () => {
            const [returnApplicabilityRes, stateWiseAnalysisRes, frequencyWiseReturnsRes, companiesPerReturnsNamesRes, complianceRiskDistributionByStateRes, complianceStatusBasedOnReturnsRes, remarksBasedOnCompanyRes] = await Promise.allSettled([
                fetchReturnApplicabilityByCompanyCommonName(selectedCompany),
                fetchStateWiseAnalysisOfApplicableReturns(selectedCompany),
                // need to integrate these two charts
                fetchFrequencyWiseReturns(selectedCompany),
                fetchCompaniesPerReturnsNames(selectedCompany),
                fetchComplianceRiskDistributionByState(selectedCompany),
                fetchComplianceStatusBasedOnReturns(selectedCompany),
                fetchRemarksBasedOnCompany(selectedCompany),
            ]);
            if (returnApplicabilityRes.status === 'fulfilled') {
                setComparisonOfReturnApplicability(returnApplicabilityRes.value);
            } else {
                console.warn("fetchAll communication type failed:", returnApplicabilityRes.reason);
                setComparisonOfReturnApplicability(returnApplicabilityRes.reason?.status || []);
            }
            if (stateWiseAnalysisRes.status === 'fulfilled') {
                setStateWiseAnalysisOfApplicableReturns(stateWiseAnalysisRes.value);
            } else {
                console.warn("fetchAll communication type failed:", stateWiseAnalysisRes.reason);
                setStateWiseAnalysisOfApplicableReturns(stateWiseAnalysisRes.reason?.status || []);
            }
            if (frequencyWiseReturnsRes.status === 'fulfilled') {
                setApplicableReturnsCount(frequencyWiseReturnsRes.value);
            } else {
                console.warn("fetchAll communication type failed:", frequencyWiseReturnsRes.reason);
                setApplicableReturnsCount(frequencyWiseReturnsRes.reason?.status || []);
            }
            if (companiesPerReturnsNamesRes.status === 'fulfilled') {
                setCompaniesPerReturnsNames(companiesPerReturnsNamesRes.value);
            } else {
                console.warn("fetchAll communication type failed:", companiesPerReturnsNamesRes.reason);
                setCompaniesPerReturnsNames(companiesPerReturnsNamesRes.reason?.status || []);
            }
            if (complianceRiskDistributionByStateRes.status === 'fulfilled') {
                setRiskDistributionByState(complianceRiskDistributionByStateRes.value);
            } else {
                console.warn("fetchAll communication type failed:", complianceRiskDistributionByStateRes.reason);
                setRiskDistributionByState(complianceRiskDistributionByStateRes.reason?.status || []);
            }
            if (complianceStatusBasedOnReturnsRes.status === 'fulfilled') {
                setApplicableReturnsByLocation(complianceStatusBasedOnReturnsRes.value);
            } else {
                console.warn("fetchAll communication type failed:", complianceStatusBasedOnReturnsRes.reason);
                setApplicableReturnsByLocation(complianceStatusBasedOnReturnsRes.reason?.status || []);
            }
            if (remarksBasedOnCompanyRes.status === 'fulfilled') {
                setEscalationRaisedCategoriesByCompany(remarksBasedOnCompanyRes.value);
            } else {
                console.warn("fetchAll communication type failed:", remarksBasedOnCompanyRes.reason);
                setEscalationRaisedCategoriesByCompany(remarksBasedOnCompanyRes.reason?.status || []);
            }

        };
        fetchData();
    }, [selectedCompany]);
    return (
        <div>
            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Top 5 comparison of Return Applicability across Companies</div>
                    <Chart
                        options={comparisonOfReturnApplicabilityFormat.options} series={comparisonOfReturnApplicabilityFormat.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Frequency-wise distribution of applicable returns, revealing dominant compliance cycles</div>
                    <Chart
                        options={ApplicableReturnsCountFormat.options} series={ApplicableReturnsCountFormat.series} type="donut" height={380}
                    />
                </div>
            </div>
            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Top 5 compliance status comparison across different return types, highlighting returns with the highest completion rates.</div>
                    <Chart
                        options={applicableReturnsByLocationFormat.options} series={applicableReturnsByLocationFormat.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Top 5 analysis of applicable return names, identifying the most frequently required returns across companies</div>
                    <Chart
                        options={companiesPerReturnsNamesFormat.options} series={companiesPerReturnsNamesFormat.series} type="bar" height={380}
                    />
                </div>
            </div>

            <div className='charts-grid mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Compliance risk distribution by state, identifying regions with elevated compliance risk levels.</div>
                    <Chart
                        options={riskDistributionByStateFormat.options} series={riskDistributionByStateFormat.series} type="bar" height={380}
                    />
                </div>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Top 5 state-wise analysis of applicable returns, showcasing regional concentration of compliance activities.</div>
                    <Chart
                        options={applicableReturnsByStateFormat.options} series={applicableReturnsByStateFormat.series} type="bar" height={380}
                    />
                </div>

            </div>
            <div className='mb-4'>
                <div className="chart-card">
                    <div className="mb-3 fw-600">Breakdown of escalation raised categories by company, revealing escalation hotspots</div>
                    <Chart
                        options={escalationRaisedCategoriesByCompanyFormat.options} series={escalationRaisedCategoriesByCompanyFormat.series} type="bar" height={380}
                    />
                </div>

            </div>

        </div>
    )
}

export default ReturnsAndSubmissions