import React, { useEffect, useState } from "react";
import "../style/statsCards.css";
import "../style/dashboard.css";
import { Tabs, Tab, Box } from "@mui/material";
import GeneralComplianceDashboard from "../dashboards/GeneralComplianceDashboard/GeneralComplianceDashboard";
import {
    fetchAllUser,
    fetchClientOnboardingByCompany,
    fetchClientOnboardingPortfolio,
    fetchComplainceCockpit,
    fetchComplainceCockpitByCompany,
    fetchGeneralCompaiancePortfolio,
    fetchGeneralComplianceByCompany,
} from "../api/service";
import CockpitComplinceByCompany from "./cockpitDashboard/CockpitComplinceByCompany";
import CockpitComplince from "./cockpitDashboard/CockpitComplince";
import ClientOnbordingDashboard from "./clientOnbordingDashboard/ClientOnbordingDashboard";
import PayrollServices from "./payrollDashboard/PayrollServices ";
import ReturnsAndSubmissions from "./payrollDashboard/ReturnsAndSubmissions";
import HelpdeskAndEscalations from "./payrollDashboard/HelpdeskAndEscalations";
import AuditAndVisitDashboard from "./Audit/AuditAndVisitDashboard";
import ClientOnBoardingByCompany from "./clientOnbordingDashboard/ClientOnBoardingByCompany/ClientOnBoardingByCompany";
import NoticeDashboard from "./noticeDashboard/NoticeDashboard";
import GeneralHelpdesk from "./payrollDashboard/GeneralHelpdesk";

const NavigationTabs = ({
    selectedCompany,
    activeTab,
    setActiveTab,
    current,
}) => {
    const [generalDashboardData, setGeneralDashboardData] = useState([]);
    const [cockpitByCompanyData, setCockpitByCompanyData] = useState([]);
    const [cockpitData, setCockpitData] = useState([]);
    const [clientOnboardingData, setClientOnboardingData] = useState([]);
    const [ClientOnBoardingByCompanyData, setClientOnBoardingByCompanyData] =
        useState([]);
    const [selectedCharts, setSelectedCharts] = useState([]);
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
console.log(selectedCharts,'selectedCharts')
    const startDrag = (e) => {
        setIsDragging(true);
        const clientX = e.clientX || e.touches?.[0].clientX;
        const clientY = e.clientY || e.touches?.[0].clientY;

        setOffset({
            x: clientX - position.x,
            y: clientY - position.y,
        });
    };

    const onDrag = (e) => {
        if (!isDragging) return;

        const clientX = e.clientX || e.touches?.[0].clientX;
        const clientY = e.clientY || e.touches?.[0].clientY;

        setPosition({
            x: clientX - offset.x,
            y: clientY - offset.y,
        });
    };

    const stopDrag = () => setIsDragging(false);

    // general compliance data fetch
    useEffect(() => {
        const fetchGeneralDashboardData = async () => {
            try {
                if (selectedCompany) {
                    const generalDashboardDataByCompany =
                        await fetchGeneralComplianceByCompany(selectedCompany);
                    setGeneralDashboardData(generalDashboardDataByCompany);
                } else {
                    const generalDashboardData = await fetchGeneralCompaiancePortfolio();
                    setGeneralDashboardData(generalDashboardData);
                }
            } catch (error) {
                setGeneralDashboardData(error?.status || []); // Set to empty array on error
            }
        };
        fetchGeneralDashboardData();
    }, [selectedCompany]);

    // cockpit data fetch
    useEffect(() => {
        const fetchCockpitData = async () => {
            const [cockpitByCompanyRes, cockpitRes] = await Promise.allSettled([
                // pass selectedCompany state
                fetchComplainceCockpitByCompany(selectedCompany),
                fetchComplainceCockpit(),
                fetchAllUser(),
            ]);

            if (cockpitByCompanyRes.status === "fulfilled") {
                setCockpitByCompanyData(cockpitByCompanyRes.value);
            } else {
                console.warn("fetchAll cockpit failed:", cockpitByCompanyRes.reason);
                setCockpitByCompanyData(cockpitRes.reason?.status || []);
            }
            if (cockpitRes.status === "fulfilled") {
                setCockpitData(cockpitRes.value);
            } else {
                console.warn("fetchAll cockpit failed:", cockpitRes.reason);
                setCockpitData(cockpitRes.reason?.status || []);
            }
        };
        fetchCockpitData();
    }, [selectedCompany]);

    // client onboarding data fetch
    useEffect(() => {
        const fetchClientOnboardingPortfolioData = async () => {
            const [clientOnboardingByCompanyRes, clientOnboardingRes] =
                await Promise.allSettled([
                    // pass selectedCompany state
                    fetchClientOnboardingByCompany(selectedCompany),
                    fetchClientOnboardingPortfolio(),
                ]);

            if (clientOnboardingByCompanyRes.status === "fulfilled") {
                setClientOnBoardingByCompanyData(clientOnboardingByCompanyRes.value);
            } else {
                console.warn(
                    "fetchAll client onboarding failed:",
                    clientOnboardingByCompanyRes.reason
                );
                setClientOnBoardingByCompanyData(
                    clientOnboardingRes.reason?.status || []
                );
            }
            if (clientOnboardingRes.status === "fulfilled") {
                setClientOnboardingData(clientOnboardingRes.value);
            } else {
                console.warn(
                    "fetchAll client onboarding failed:",
                    clientOnboardingRes.reason
                );
                setClientOnboardingData(clientOnboardingRes.reason?.status || []);
            }
        };
        fetchClientOnboardingPortfolioData();
    }, [selectedCompany]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    //    const stats = [
    //         {
    //             title: 'Outsourcing',
    //             icon: '',
    //             color: 'green',
    //             bg_color: '#dcf3f3',
    //         },
    //         {
    //             title: 'Client Onboarding',
    //             icon: 'img2',
    //             color: 'blue',
    //             bg_color: '#ffecdc',
    //         },
    //         {
    //             title: 'Payroll',
    //             icon: 'img3',
    //             color: 'orange',
    //             bg_color: '#e7f7f1',
    //         },
    //     ];

    // const renderCards = (data) => {
    //     return (
    //         <div className="stats-grid">
    //             {data.map((stat, index) => (
    //                 <div
    //                     key={index}
    //                     className="stat-card"
    //                     style={{
    //                         animationDelay: `${index * 0.1}s`,
    //                         backgroundColor: stat.bg_color,
    //                     }}
    //                 >
    //                     <div className="stat-card-content">
    //                         <div>
    //                             <img src={stat.icon} alt={stat.title} width={65} />
    //                         </div>
    //                         <div className="stat-info">
    //                             <h6>{stat.title}</h6>
    //                         </div>
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //     );
    // };

    return (
        <Box sx={{ width: "100%" }}>
            {/* {renderCards(stats)} */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Compliance Cockpit " />
                    <Tab label="General Compliance" />
                    <Tab label="Client Onboarding" />
                    <Tab label="Payroll Services" />
                    <Tab label="Returns & Submissions" />
                    <Tab label="Helpdesk & Escalations" />
                    <Tab label="General Helpdesk" />
                    <Tab label="Audit & Visits" />
                    <Tab label="Notices & Inspections" />
                </Tabs>
            </Box>
            <Box>
                {/* {activeTab === 0 && renderCards(stats)} */}
                {activeTab === 0 &&
                    (selectedCompany !== "" ? (
                        <CockpitComplinceByCompany
                            data={cockpitByCompanyData}
                            current={current}
                        />
                    ) : (
                        <CockpitComplince data={cockpitData} current={current} />
                    ))}
                {activeTab === 1 && (
                    <GeneralComplianceDashboard
                        data={generalDashboardData}
                        current={current}
                    />
                )}
                {activeTab === 2 &&
                    (selectedCompany === "" ? (
                        <ClientOnbordingDashboard
                            data={clientOnboardingData}
                            current={current}
                        />
                    ) : (
                        <ClientOnBoardingByCompany
                            locationData={ClientOnBoardingByCompanyData}
                            current={current}
                        />
                    ))}
                {activeTab === 3 && (
                    <PayrollServices
                        selectedCompany={selectedCompany}
                        current={current}
                        setSelectedCharts={setSelectedCharts}
                        selectedCharts={selectedCharts}
                    />
                )}
                {activeTab === 4 && (
                    <ReturnsAndSubmissions
                        selectedCompany={selectedCompany}
                        current={current}
                        setSelectedCharts={setSelectedCharts}
                        selectedCharts={selectedCharts}
                    />
                )}
                {activeTab === 5 && (
                    <HelpdeskAndEscalations
                        selectedCompany={selectedCompany}
                        current={current}
                        setSelectedCharts={setSelectedCharts}
                        selectedCharts={selectedCharts}
                    />
                )}
                {activeTab === 6 && (
                    <GeneralHelpdesk
                        selectedCompany={selectedCompany}
                        current={current}
                        setSelectedCharts={setSelectedCharts}
                        selectedCharts={selectedCharts}
                    />
                )}
                {activeTab === 7 && (
                    <AuditAndVisitDashboard
                        selectedCompany={selectedCompany}
                        current={current}
                        setSelectedCharts={setSelectedCharts}
                        selectedCharts={selectedCharts}
                    />
                )}
                {activeTab === 8 && (
                    <NoticeDashboard
                        selectedCompany={selectedCompany}
                        current={current}
                        setSelectedCharts={setSelectedCharts}
                        selectedCharts={selectedCharts}
                    />
                )}
            </Box>
            <div className="navigation-wrapper">
                <div
                    className="dashbord-user-access-btn"
                    style={{
                        position: "fixed",
                        left: position.x,
                        top: position.y,
                        cursor: "grab",
                    }}
                    onMouseDown={startDrag}
                    onTouchStart={startDrag}
                    onMouseMove={onDrag}
                    onTouchMove={onDrag}
                    onMouseUp={stopDrag}
                    onTouchEnd={stopDrag}
                >
                    <button className="btn btn-primary">Save User Access</button>
                </div>
            </div>
        </Box>
    );
};

export default NavigationTabs;
