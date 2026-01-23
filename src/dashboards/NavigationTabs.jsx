import React, { useEffect, useState } from "react";
import "../style/statsCards.css";
import "../style/dashboard.css";
import { Tabs, Tab, Box } from "@mui/material";

import GeneralComplianceDashboard from "../dashboards/GeneralComplianceDashboard/GeneralComplianceDashboard";
import {
    createOrUpdateWidgetMapping,
    fetchClientOnboardingByCompany,
    fetchClientOnboardingPortfolio,
    fetchComplainceCockpit,
    fetchComplainceCockpitByCompany,
    fetchGeneralCompaiancePortfolio,
    fetchGeneralComplianceByCompany,
    fetchWidgetMappingById,
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
import Snackbars from "../component/Snackbars";

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
    const [widgetsList, setWidgetsList] = useState([]);
    
    // console.log(widgetsList, 'widgetsList')
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        message: "",
        severityType: "",
    });
    const [position, setPosition] = useState({
        x: window.innerWidth / 2 - 75,   // center horizontally
        y: window.innerHeight - 80       // bottom with 80px padding
    });

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
    const userId = decryptData(localStorage.getItem("user_id"));
    const shouldShow = (id) => {
        return Array.isArray(widgetsList) &&
            widgetsList.flat().some(
                item => item?.widget_id?.toUpperCase() === id.toUpperCase()
            );
    };
    const tabsList = [
        {
            label: "Compliance Cockpit",
            content:
                selectedCompany !== "" ? (
                    <CockpitComplinceByCompany data={cockpitByCompanyData}
                        current={current}
                        selectedCharts={selectedCharts}
                        companyName={selectedCompany}
                        setSelectedCharts={setSelectedCharts} />
                ) : (
                    <CockpitComplince data={cockpitData}
                        current={current}
                        selectedCharts={selectedCharts}
                        setSelectedCharts={setSelectedCharts}
                        shouldShow={shouldShow}

                    />
                )
        },
        {
            label: "General Compliance",
            content: (
                <GeneralComplianceDashboard data={generalDashboardData} current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                    shouldShow={shouldShow}

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
                    shouldShow={shouldShow}
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
                    shouldShow={shouldShow}
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
                    shouldShow={shouldShow}

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
                    widgetsList={widgetsList}
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
                    shouldShow={shouldShow}
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
                    shouldShow={shouldShow}
                    widgetsList={widgetsList}
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
                // console.log(error);
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

    useEffect(() => {
        const fetchWidgetsListData = async () => {
            const [a] = await Promise.allSettled([
                // fetchAllWidgetMappings(),
                fetchWidgetMappingById(userId),

            ]);
            setWidgetsList(
                a.status === "fulfilled"
                    ? a.value?.widgets || []
                    : []
            );


        };
        fetchWidgetsListData();
    }, [selectedCompany]);

    const handleSubmit = async (updatedFormData) => {
        if (!updatedFormData) return;

        const payload = {
            user_id: current?.user_id,
            widget_ids: selectedCharts.map(id => id.toUpperCase())
        };
        try {
            const response = await createOrUpdateWidgetMapping(payload,userId);
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: response?.message || "Mapping updated successfully",
                severityType: 'success'
            });

        } catch (error) {
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: error?.response?.data?.message || "Error updating mapping",
                severityType: 'error'
            });
        }
    };
    return (
        <Box sx={{ width: "100%" }}>
            <Snackbars
                issnackbarsOpen={issnackbarsOpen}
                setIsSnackbarsOpen={setIsSnackbarsOpen}
            />
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
                        <button className="btn btn-primary" disabled={selectedCharts?.length === 0} onClick={handleSubmit}>Create User Widget</button>
                    </div>
                </div>
            )}
        </Box>
    );
};

export default NavigationTabs;
