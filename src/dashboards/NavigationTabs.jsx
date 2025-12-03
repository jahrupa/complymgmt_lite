import React, { useEffect, useState } from "react";
import "../style/statsCards.css";
import "../style/dashboard.css";
import { Tabs, Tab, Box } from "@mui/material";

import GeneralComplianceDashboard from "../dashboards/GeneralComplianceDashboard/GeneralComplianceDashboard";
import {
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
import ClientOnBoardingByCompany from "./clientOnbordingDashboard/ClientOnBoardingByCompany/ClientOnBoardingByCompany";

import PayrollServices from "./payrollDashboard/PayrollServices ";
import ReturnsAndSubmissions from "./payrollDashboard/ReturnsAndSubmissions";
import HelpdeskAndEscalations from "./payrollDashboard/HelpdeskAndEscalations";
import GeneralHelpdesk from "./payrollDashboard/GeneralHelpdesk";
import AuditAndVisitDashboard from "./Audit/AuditAndVisitDashboard";
import NoticeDashboard from "./noticeDashboard/NoticeDashboard";

import { decryptData } from "../page/utils/encrypt";

function TabPanel({ children, value, index, keepMounted = true }) {
    const isActive = value === index;

    return (
        <div role="tabpanel" hidden={!isActive}>
            {(keepMounted || isActive) ? children : null}
        </div>
    );
}

const NavigationTabs = ({ selectedCompany, activeTab, setActiveTab, current }) => {

    /* STATES */
    const [generalDashboardData, setGeneralDashboardData] = useState([]);
    const [cockpitByCompanyData, setCockpitByCompanyData] = useState([]);
    const [cockpitData, setCockpitData] = useState([]);
    const [clientOnboardingData, setClientOnboardingData] = useState([]);
    const [ClientOnBoardingByCompanyData, setClientOnBoardingByCompanyData] = useState([]);
    const [selectedCharts, setSelectedCharts] = useState([]);
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    // Start dragging
    const startDrag = (e) => {
        e.preventDefault();
        setIsDragging(true);

        const clientX = e.clientX || e.touches?.[0]?.clientX;
        const clientY = e.clientY || e.touches?.[0]?.clientY;

        setOffset({
            x: clientX - position.x,
            y: clientY - position.y,
        });
    };

    // Dragging
    const onDrag = (e) => {
        if (!isDragging) return;

        const clientX = e.clientX || e.touches?.[0]?.clientX;
        const clientY = e.clientY || e.touches?.[0]?.clientY;

        let newX = clientX - offset.x;
        let newY = clientY - offset.y;

        // Restrict inside screen
        newX = Math.max(0, Math.min(newX, window.innerWidth - 150));
        newY = Math.max(0, Math.min(newY, window.innerHeight - 60));

        setPosition({ x: newX, y: newY });
    };

    // Stop dragging
    const stopDrag = () => setIsDragging(false);
    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", onDrag);
            window.addEventListener("mouseup", stopDrag);

            window.addEventListener("touchmove", onDrag);
            window.addEventListener("touchend", stopDrag);
        }

        return () => {
            window.removeEventListener("mousemove", onDrag);
            window.removeEventListener("mouseup", stopDrag);

            window.removeEventListener("touchmove", onDrag);
            window.removeEventListener("touchend", stopDrag);
        };
    }, [isDragging, offset]);

    const userType = decryptData(localStorage.getItem("user_type"));

    const tabsList = [
        {
            label: "Compliance Cockpit",
            content:
                selectedCompany !== "" ? (
                    <CockpitComplinceByCompany data={cockpitByCompanyData}
                        current={current}
                        selectedCharts={selectedCharts}
                        setSelectedCharts={setSelectedCharts} />
                ) : (
                    <CockpitComplince data={cockpitData}
                        current={current}
                        selectedCharts={selectedCharts}
                        setSelectedCharts={setSelectedCharts}
                    />
                )
        },
        {
            label: "General Compliance",
            content: (
                <GeneralComplianceDashboard data={generalDashboardData} current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                />
            )
        }
    ];

    if (userType === "0") {
        tabsList.push({
            label: "Client Onboarding",
            content:
                selectedCompany === "" ? (
                    <ClientOnbordingDashboard data={clientOnboardingData} current={current} />
                ) : (
                    <ClientOnBoardingByCompany
                        locationData={ClientOnBoardingByCompanyData}
                        current={current}
                    />
                )
        });
    }

    tabsList.push(
        {
            label: "Payroll Services",
            content: (
                <PayrollServices
                    selectedCompany={selectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                />
            )
        },
        {
            label: "Returns & Submissions",
            content: (
                <ReturnsAndSubmissions
                    selectedCompany={selectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                />
            )
        },
        {
            label: "Helpdesk & Escalations",
            content: (
                <HelpdeskAndEscalations
                    selectedCompany={selectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                />
            )
        },
        {
            label: "General Helpdesk",
            content: (
                <GeneralHelpdesk
                    selectedCompany={selectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                />
            )
        },
        {
            label: "Audit & Visits",
            content: (
                <AuditAndVisitDashboard
                    selectedCompany={selectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                />
            )
        },
        {
            label: "Notices & Inspections",
            content: (
                <NoticeDashboard
                    selectedCompany={selectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                />
            )
        }
    );

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    useEffect(() => {
        const fetchGeneralDashboardData = async () => {
            try {
                if (selectedCompany) {
                    setGeneralDashboardData(await fetchGeneralComplianceByCompany(selectedCompany));
                } else {
                    setGeneralDashboardData(await fetchGeneralCompaiancePortfolio());
                }
            } catch (error) {
                setGeneralDashboardData([]);
            }
        };
        fetchGeneralDashboardData();
    }, [selectedCompany]);

    useEffect(() => {
        const fetchCockpitData = async () => {
            const [a, b] = await Promise.allSettled([
                fetchComplainceCockpitByCompany(selectedCompany),
                fetchComplainceCockpit()
            ]);

            setCockpitByCompanyData(a.status === "fulfilled" ? a.value : []);
            setCockpitData(b.status === "fulfilled" ? b.value : []);
        };
        fetchCockpitData();
    }, [selectedCompany]);

    useEffect(() => {
        const fetchClientOnboardingPortfolioData = async () => {
            const [a, b] = await Promise.allSettled([
                fetchClientOnboardingByCompany(selectedCompany),
                fetchClientOnboardingPortfolio()
            ]);

            setClientOnBoardingByCompanyData(a.status === "fulfilled" ? a.value : []);
            setClientOnboardingData(b.status === "fulfilled" ? b.value : []);
        };
        fetchClientOnboardingPortfolioData();
    }, [selectedCompany]);


    return (
        <Box sx={{ width: "100%" }}>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
            >
                {tabsList.map((t, i) => (
                    <Tab key={i} label={t.label} />
                ))}
            </Tabs>

            <Box sx={{ marginTop: 2 }}>
                {tabsList.map((tab, index) => (
                    <TabPanel key={index} value={activeTab} index={index} keepMounted>
                        {tab.content}
                    </TabPanel>
                ))}
            </Box>

            {userType === "0" && (
                <div className="navigation-wrapper">
                    <div
                        className="dashbord-user-access-btn"
                        style={{
                            position: "fixed",
                            left: position.x,
                            top: position.y,
                            cursor: isDragging ? "grabbing" : "grab",
                            zIndex: 9999,
                        }}
                        onMouseDown={startDrag}
                        onTouchStart={startDrag}
                    >
                        <button className="btn btn-primary">Create User Widget</button>
                    </div>
                </div>
            )}
        </Box>
    );
};

export default NavigationTabs;
