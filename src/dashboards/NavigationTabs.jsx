import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../style/statsCards.css";
import "../style/dashboard.css";
import { Tabs, Tab, Box } from "@mui/material";
import GeneralComplianceDashboard from "../dashboards/GeneralComplianceDashboard/GeneralComplianceDashboard";
import {
    createOrUpdateWidgetMapping,
    fetchClientOnboardingByCompany,
    fetchClientOnboardingPortfolio,
    fetchComplianceCockpit,
    fetchComplainceCockpitByCompany,
    fetchGeneralCompaiancePortfolio,
    fetchGeneralComplianceByCompany,
    fetchWidgetMappingById,
    fetchLicenseComplaince,
    fetchRegistersCompliance,
    fetchChallanCompliance,
    fetchReturnCompliance,
    fetchPaginatedRecords,
    fetchClientData,
    fetchClientCompliance,
} from "../api/service";
import CockpitComplinceByCompany from "./cockpitDashboard/CockpitComplinceByCompany";
import CockpitComplince from "./cockpitDashboard/CockpitComplince";
import ClientOnbordingDashboard from "./clientOnbordingDashboard/ClientOnbordingDashboard";
import ClientOnBoardingByCompany from "./clientOnbordingDashboard/ClientOnBoardingByCompany/ClientOnBoardingByCompany";
import PayrollServices from "./payrollDashboard/PayrollServices";
import ReturnsDashboard from "./returnsDashboard/ReturnsDashboard";
import HelpdeskAndEscalations from "./payrollDashboard/HelpdeskAndEscalations";
import GeneralHelpdesk from "./payrollDashboard/GeneralHelpdesk";
import AuditAndVisitDashboard from "./Audit/AuditAndVisitDashboard";
import NoticeDashboard from "./noticeDashboard/NoticeDashboard";
import ChallanDashboard from "./challanDashboard/ChallanDashboard";
import RegisterDashboard from "./registerDashboard/RegisterDashboard";
import LicenseDashboard from "./licenseDashboard/LicenseDashboard";
import { decryptData } from "../page/utils/encrypt";
import Snackbars from "../component/Snackbars";

// Query params shared by every dashboard tab
const SHARED_PARAMS = ["tab", "company_name"];

function TabPanel({ children, value, index, keepMounted = true }) {
    const isActive = value === index;

    return (
        <div role="tabpanel" hidden={!isActive}>
            {(keepMounted || isActive) ? children : null}
        </div>
    );
}

const NavigationTabs = ({ selectedCompany, setSelectedCompany, setActiveTitle, current }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    // The active tab lives in the URL (?tab=<slug>) so refresh, shared links and back/forward keep it.
    // Dashboards keep their filters in the same query string, so each tab's filters are parked when
    // leaving it and restored when coming back; tab and company are shared by all tabs.
    const activeSlug = searchParams.get("tab");
    const tabFiltersRef = useRef({});

    /* STATES */
    const [generalDashboardData, setGeneralDashboardData] = useState([]);
    const [cockpitByCompanyData, setCockpitByCompanyData] = useState([]);
    const [cockpitData, setCockpitData] = useState([]);
    const [clientOnboardingData, setClientOnboardingData] = useState([]);
    const [ClientOnBoardingByCompanyData, setClientOnBoardingByCompanyData] = useState([]);
    const [selectedCharts, setSelectedCharts] = useState([]);
    const [activeDrawer, setActiveDrawer] = useState(null);
    const [widgetsList, setWidgetsList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
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
    const [cockpitComplainceData, setCockpitComplainceData] = useState({
        licenseComplaince: [],
        registersCompliance: [],
        challanCompliance: [],
        returnCompliance: [],
        paginatedRecords: [],
        clientData: [],
        clientCompliance: [],
    });

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
            slug: "compliance-cockpit",
            title: "Compliance Cockpit",
            content:
                selectedCompany !== "" ? (
                    <CockpitComplinceByCompany 
                    cockpitDataByClient={cockpitData ? cockpitData : []}
                     data={cockpitByCompanyData ? cockpitByCompanyData : []}
                        current={current}
                        selectedCharts={selectedCharts}
                        companyName={selectedCompany}
                        setSelectedCharts={setSelectedCharts} />
                ) : (
                    <CockpitComplince
                        current={current}
                        selectedCharts={selectedCharts}
                        setSelectedCharts={setSelectedCharts}
                        shouldShow={shouldShow}
                        setPage={setPage}
                        setLimit={setLimit}
                        selectedCompany={selectedCompany}
                        page={page}
                        limit={limit}
                        setActiveDrawer={setActiveDrawer}
                    />
                )
        },
        {
            label: "General Compliance",
            slug: "general-compliance",
            title: "General Compliance",
            content: (
                <GeneralComplianceDashboard data={generalDashboardData} current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                    shouldShow={shouldShow}
                    page={page}
                    limit={limit}
                    setActiveDrawer={setActiveDrawer}

                />
            )
        }
    ];

    if (userType === "0") {
        tabsList.push({
            label: "Client Onboarding",
            slug: "client-onboarding",
            title: "Client Onboarding",
            content:
                selectedCompany === "" ? (
                    <ClientOnbordingDashboard
                        data={clientOnboardingData}
                        current={current}
                        selectedCompany={selectedCompany}
                        activeDrawer={activeDrawer}
                        setActiveDrawer={setActiveDrawer}
                    />) : (
                    <ClientOnBoardingByCompany
                        locationData={ClientOnBoardingByCompanyData}
                        current={current}
                        selectedCompany={selectedCompany}
                        activeDrawer={activeDrawer}
                        setActiveDrawer={setActiveDrawer}
                    />
                )
        });
    }

    tabsList.push(
        {
            label: "Payroll Services",
            slug: "payroll-services",
            title: "Payroll",
            content: (
                <PayrollServices
                    selectedCompany={selectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                    shouldShow={shouldShow}
                    activeDrawer={activeDrawer}
                    setActiveDrawer={setActiveDrawer}
                />
            )
        },
        {
            label: "Returns & Submissions",
            slug: "returns-submissions",
            title: "Payroll - Returns & Submissions",
            content: (
                <ReturnsDashboard
                    selectedCompany={selectedCompany}
                    setSelectedCompany={setSelectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                    shouldShow={shouldShow}
                    isActive={activeSlug === "returns-submissions"}
                />
            )
        },
        {
            label: "Helpdesk & Escalations",
            slug: "helpdesk-escalations",
            title: "Payroll - Helpdesk & Escalations",
            content: (
                <HelpdeskAndEscalations
                    selectedCompany={selectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                    shouldShow={shouldShow}
                    activeDrawer={activeDrawer}
                    setActiveDrawer={setActiveDrawer}

                />
            )
        },
        {
            label: "General Helpdesk",
            slug: "general-helpdesk",
            title: "Payroll - General Helpdesk",
            content: (
                <GeneralHelpdesk
                    selectedCompany={selectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                    widgetsList={widgetsList}
                    activeDrawer={activeDrawer}
                    setActiveDrawer={setActiveDrawer}
                />
            )
        },
        {
            label: "Audit & Visits",
            slug: "audit-visits",
            title: "Audit & Visits",
            content: (
                <AuditAndVisitDashboard
                    selectedCompany={selectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                    shouldShow={shouldShow}
                    activeDrawer={activeDrawer}
                    setActiveDrawer={setActiveDrawer}
                />
            )
        },
        {
            label: "Notices & Inspections",
            slug: "notices-inspections",
            title: "Notices & Inspections",
            content: (
                <NoticeDashboard
                    selectedCompany={selectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                    shouldShow={shouldShow}
                    widgetsList={widgetsList}
                    activeDrawer={activeDrawer}
                    setActiveDrawer={setActiveDrawer}
                />
            )
        },
        {
            label: "Challan",
            slug: "challan",
            title: "Challan Dashboard",
            content: (
                <ChallanDashboard
                    selectedCompany={selectedCompany}
                    setSelectedCompany={setSelectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                    shouldShow={shouldShow}
                    isActive={activeSlug === "challan"}
                />
            )
        },
        {
            label: "Registers",
            slug: "register",
            title: "Register Dashboard",
            content: (
                <RegisterDashboard
                    selectedCompany={selectedCompany}
                    setSelectedCompany={setSelectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                    shouldShow={shouldShow}
                    isActive={activeSlug === "register"}
                />
            )
        },
        {
            label: "Licenses",
            slug: "license",
            title: "License Dashboard",
            content: (
                <LicenseDashboard
                    selectedCompany={selectedCompany}
                    setSelectedCompany={setSelectedCompany}
                    current={current}
                    selectedCharts={selectedCharts}
                    setSelectedCharts={setSelectedCharts}
                    shouldShow={shouldShow}
                    isActive={activeSlug === "license"}
                />
            )
        }
    );

    const activeIndex = Math.max(0, tabsList.findIndex((t) => t.slug === activeSlug));

    useEffect(() => {
        setActiveTitle(tabsList[activeIndex]?.title || "");
        // eslint-disable-next-line react-hooks/exhaustive-deps -- tabsList is rebuilt every render
    }, [activeIndex, userType]);

    const handleTabChange = (event, newValue) => {
        const fromSlug = tabsList[activeIndex].slug;
        const toSlug = tabsList[newValue].slug;
        setSearchParams((prev) => {
            // Park the current tab's filters and bring back the ones the target tab had
            const own = new URLSearchParams(prev);
            SHARED_PARAMS.forEach((key) => own.delete(key));
            tabFiltersRef.current[fromSlug] = own.toString();

            const next = new URLSearchParams();
            next.set("tab", toSlug);
            if (prev.get("company_name")) next.set("company_name", prev.get("company_name"));
            new URLSearchParams(tabFiltersRef.current[toSlug] || "").forEach((value, key) => next.set(key, value));
            return next;
        });
    };

    useEffect(() => {
        const fetchGeneralDashboardData = async () => {
            try {
                if (selectedCompany) {
                    setGeneralDashboardData(await fetchGeneralComplianceByCompany(selectedCompany));
                } else {
                    setGeneralDashboardData(await fetchGeneralCompaiancePortfolio());
                }
            } catch {
                setGeneralDashboardData([]);
            }
        };
        fetchGeneralDashboardData();
    }, [selectedCompany, page, limit]);

    useEffect(() => {
        const fetchCockpitData = async () => {
            const [a, b] = await Promise.allSettled([
                fetchComplainceCockpitByCompany(selectedCompany),
                fetchComplianceCockpit(page, limit)
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
            const response = await createOrUpdateWidgetMapping(payload, userId);
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: response?.message || "Mapping updated successfully",
                severityType: 'success'
            });
            setSelectedCharts([]);

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
                value={activeIndex}
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
                    <TabPanel key={index} value={activeIndex} index={index} keepMounted>
                        {tab.content}
                    </TabPanel>
                ))}
            </Box>

            {userType === "0" && activeDrawer === null && (
                <div className="navigation-wrapper">
                    <div
                        className="dashbord-user-access-btn"
                        style={{
                            position: "fixed",
                            left: position.x,
                            top: position.y,
                            cursor: isDragging ? "grabbing" : "grab",
                            zIndex: 9999,
                            ...(selectedCharts?.length === 0
                                ? { cursor: "not-allowed", opacity: 0.9 }
                                : { pointerEvents: "auto", opacity: 1 })
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
