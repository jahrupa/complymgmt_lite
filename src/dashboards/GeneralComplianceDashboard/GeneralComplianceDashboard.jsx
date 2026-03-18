import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import Snackbars from '../../component/Snackbars';
import { decryptData } from '../../page/utils/encrypt';
import DashboardDrawerGrid from '../DashboardDrawer';
import { fetchGeneralCompaiancePortfolio, fetchPaginatedRecords } from '../../api/service';

const GeneralComplianceDashboard = ({ data, current, selectedCharts, setSelectedCharts, shouldShow, page, limit }) => {
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        message: "",
        severityType: "",
    });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerAnchor, setDrawerAnchor] = useState("right");
    const [filterColumns, setFilterColumns] = useState([]);
    const [isDetailPageDataFor, setIsDetailPageDataFor] = useState("Returns");
    const [paginatedData, setPaginatedData] = useState([]);
    // console.log(paginatedData.paginatedRecords.challan.records, "paginatedData");
    useEffect(() => {
        const fetchGeneralComplianceData = async () => {
            const results = await Promise.allSettled([
                fetchPaginatedRecords(page, limit),
            ]);

            const keys = [
                "paginatedRecords",
            ];

            const updatedData = {};

            results.forEach((res, index) => {
                updatedData[keys[index]] =
                    res.status === "fulfilled" ? res.value : [];
            });

            setPaginatedData(updatedData);
        };

        fetchGeneralComplianceData();
    }, []);

    if (!data || Object.keys(data).length === 0) {
        return <div className='no-data'>{data === 403 ? 'No Data Found' : 'Loading...'}</div>;
    }

    // Payroll display items generated from data

    const challanData = {
        "completed": (data?.challans?.completed) ?? (data?.completed_challans),
        "pending": (data?.challans?.pending) ?? (data?.pending_challans),
        "total": (data?.challans?.total) ?? (data?.total_challans)
    }

    const payrollData = [
        {
            icon: '✔', label: 'Completed',
            value: challanData.completed,
            status: challanData.completed > 0 ? 'normal' : 'warning'
        },
        {
            icon: '⏳', label: 'Pending',
            value: (challanData.pending),
            status: (challanData.pending) > 0 ? 'normal' : 'muted'
        },
        {
            icon: '⏳', label: 'Total',
            value: (challanData.total),
            status: (challanData.total) > 0 ? 'normal' : 'muted'
        }
    ];

    const licenseData = {
        "active": (data?.licenses?.active) ?? (data?.active_licenses),
        "expired": (data?.licenses?.expired) ?? (data?.expired_licenses),
        "expiring": (data?.licenses?.expiring) ?? (data?.expiring_licenses),
        "inprogress": (data?.licenses?.inprogress) ?? (data?.inprogress_licenses),
        "total": (data?.licenses?.total) ?? (data?.total_licenses),
    }

    // Licenses Pie Chart
    const licensesChart = {
        series: [
            licenseData.active,
            licenseData.expired,
            licenseData.expiring,
            licenseData.inprogress
        ],
        options: {
            chart: { type: 'pie', height: 350 },
            labels: ['Active', 'Expired', 'Expiring', 'In Progress'],
            colors: ['#2E7D32', '#D32F2F', '#F57C00', '#1976D2'],
            legend: { position: 'bottom' },
            responsive: [
                {
                    breakpoint: 480,
                    options: { chart: { width: 200 }, legend: { position: 'bottom' } }
                }
            ]
        }
    };

    const registerData = {
        "applicable": (data?.registers?.applicable_registers) ?? (data?.applicable_registers),
        "available": (data?.registers?.available_registers) ?? (data.available_registers),
        "completed": (data?.registers?.completed_registers) ?? (data?.completed_registers),
        "missing": (data?.registers?.missing_registers) ?? (data?.missing_registers),
        "partial": (data?.registers?.partial_registers) ?? (data?.partial_registers)
    }

    // Registers Bar Chart
    const registersChart = {
        series: [{
            data: [
                registerData.applicable,
                registerData.available,
                registerData.completed,
                registerData.missing,
                registerData.partial
            ]
        }],
        options: {
            chart: { type: 'bar', height: 350 },
            plotOptions: { bar: { borderRadius: 4, horizontal: true } },
            dataLabels: { enabled: false },
            xaxis: { categories: ['Applicable', 'Available', 'Completed', 'Missing', 'Partial'] },
            title: { text: 'Registers' }
        }
    };

    // Returns Radial Bar Chart (fixed division by zero)
    // const totalReturns = (data.returns.total_returns_applicable) || 1;

    const returnsData = {
        "completed": (data?.returns?.total_returns_completed) ?? (data?.completed_returns),
        "at_risk": (data?.returns?.total_returns_at_risk) ?? (data?.at_risk_returns),
        "delayed": (data?.returns?.total_returns_delayed) ?? (data?.total_returns_delayed),
        "pending": (data?.returns?.total_returns_pending) ?? (data?.total_returns_pending),
        "total": (data?.returns?.total_returns_applicable) ?? (data?.total_returns)
    }

    const returnsChart = {
        series: [
            ((returnsData.completed ?? 0) / (returnsData.total || 1)) * 100,
            ((returnsData.at_risk ?? 0) / (returnsData.total || 1)) * 100,
            ((returnsData.delayed ?? 0) / (returnsData.total || 1)) * 100,
            ((returnsData.pending ?? 0) / (returnsData.total || 1)) * 100,
        ],
        options: {
            chart: { height: 350, type: 'radialBar' },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: { show: true },
                        value: { show: true },
                        total: {
                            show: true,
                            label: 'Applicable',
                            formatter: () => (returnsData.total)
                        }
                    }
                }
            },
            labels: ['Completed', 'At Risk', 'Delayed', 'Pending'],
            title: { text: 'Returns' }
        }
    };

    const userRole = decryptData(localStorage.getItem("user_role"));

    const toggleChartSelection = (chartId) => {
        if (!current?.user_name) {
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


    const handleOpenDrawer = (anchor, filterColumn) => {
        setDrawerAnchor(anchor);
        setDrawerOpen(true);
        setFilterColumns(filterColumn);
    };
    console.log(data?.data?.registers?.length, 'length')
    return (
        <>
            <Snackbars
                issnackbarsOpen={issnackbarsOpen}
                setIsSnackbarsOpen={setIsSnackbarsOpen}
            />
            <div className="align-content-center d-flex justify-content-end mb-3">
                <button className="btn btn-primary " onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDrawer(
                        "left",
                    )
                }}>
                    View Details
                </button>
            </div>
            <div className='row'>
                {shouldShow("gc-1") && (
                    <div className='col-12 col-md-6 mb-4'>
                        <div
                            className={`general-compliance ${cardClass("gc-1")}`}
                            onClick={canSelect ? () => handleSelect("gc-1") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >
                            <h2>Licenses (Total: {licenseData.total})</h2>
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("gc-1")}
                                checked={selectedCharts.includes("gc-1")}
                                disabled={!current?.user_name}
                            />
                            <Chart
                                options={licensesChart.options}
                                series={licensesChart.series}
                                type="pie"
                                height={290}
                            />
                        </div>
                    </div>
                )}
                {shouldShow("gc-2") && (
                    <div className='col-12 col-md-6 mb-4'>
                        <div
                            className={`general-compliance ${cardClass("gc-2")}`}
                            onClick={canSelect ? () => handleSelect("gc-2") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >
                            <h2>Challan Compliance</h2>
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("gc-2")}
                                checked={selectedCharts.includes("gc-2")}
                                disabled={!current?.user_name}
                            />
                            <div className="compliance-items">
                                {payrollData.map((item, index) => (
                                    <div key={index} className={`compliance-item ${item.status}`}>
                                        <div className="compliance-icon">{item.icon}</div>
                                        <span className="compliance-label">{item.label}</span>
                                        <span className="compliance-value">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {shouldShow("gc-3") && (
                    <div className='col-12 col-md-6 mb-4'>
                        <div
                            className={`general-compliance ${cardClass("gc-3")}`}
                            onClick={canSelect ? () => handleSelect("gc-3") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("gc-3")}
                                checked={selectedCharts.includes("gc-3")}
                                disabled={!current?.user_name}
                            />
                            <Chart
                                options={registersChart.options}
                                series={registersChart.series}
                                type="bar"
                                height={350}
                            />
                        </div>
                    </div>
                )}
                {shouldShow("gc-4") && (
                    <div className='col-12 col-md-6 mb-4'>
                        <div
                            className={`general-compliance ${cardClass("gc-4")}`}
                            onClick={canSelect ? () => handleSelect("gc-4") : undefined}
                            style={{ cursor: canSelect ? "pointer" : "default" }}
                        >
                            <input
                                type="checkbox"
                                className="chart-select-checkbox"
                                onChange={() => toggleChartSelection("gc-4")}
                                checked={selectedCharts.includes("gc-4")}
                                disabled={!current?.user_name}
                            />
                            <Chart
                                options={returnsChart.options}
                                series={returnsChart.series}
                                type="radialBar"
                                height={350}
                            />
                        </div>
                    </div>
                )}
            </div>
            <DashboardDrawerGrid
                anchor={drawerAnchor}
                open={drawerOpen}
                onClose={() => { setDrawerOpen(false); setIsDetailPageDataFor("Returns"); }}
                filterColumns={filterColumns}
                isCockpitComplianceDetailPage={true}
                // this is wirking
                data={isDetailPageDataFor === 'Challans' ? paginatedData?.paginatedRecords?.challan?.records
                    : isDetailPageDataFor === 'Licenses' ? paginatedData?.paginatedRecords?.license?.records
                        : isDetailPageDataFor === 'Registers' ? paginatedData?.paginatedRecords?.register?.records
                            : paginatedData?.paginatedRecords?.return?.records} //direct array
                isDetailPageData={
                    isDetailPageDataFor === "Challans"
                        ? paginatedData?.paginatedRecords?.challan?.records
                        : isDetailPageDataFor === "Licenses"
                            ? paginatedData?.paginatedRecords?.license?.records
                            : isDetailPageDataFor === "Registers"
                                ? paginatedData?.paginatedRecords?.register?.records
                                : paginatedData?.paginatedRecords?.return?.records
                }
                title={'General Compliance - ' + isDetailPageDataFor}
                setIsDetailPageDataFor={setIsDetailPageDataFor}
                isDetailPageDataFor={isDetailPageDataFor}
                buttons={['Returns', 'Challans', 'Licenses', 'Registers']}
                fetchPaginatedRecords={fetchPaginatedRecords}
                totalPage={
                    isDetailPageDataFor === "Challans"
                        ? paginatedData?.paginatedRecords?.challan?.total
                        : isDetailPageDataFor === "Licenses"
                            ? paginatedData?.paginatedRecords?.license?.total
                            : isDetailPageDataFor === "Registers"
                                ? paginatedData?.paginatedRecords?.register?.total
                                : paginatedData?.paginatedRecords?.return?.total
                }
                isPaginatedRecords={true}


            />
        </>
    );
};

export default GeneralComplianceDashboard;
