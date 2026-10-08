import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../style/statsCards.css";
import "../style/dashboard.css";
import { Tabs, Tab, Box } from "@mui/material";
import GeneralComplianceDashboard from "../dashboards/GeneralComplianceDashboard/GeneralComplianceDashboard";
import {
    fetchClientOnboardingByCompany,
    fetchClientOnboardingPortfolio,
    fetchGeneralCompaiancePortfolio,
    fetchGeneralComplianceByCompany,
    fetchWidgetMappingById,
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

const NavigationTabs = ({ selectedCompany, setSelectedCompany, setActiveTitle }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    // The active tab lives in the URL (?tab=<slug>) so refresh, shared links and back/forward keep it.
    // Dashboards keep their filters in the same query string, so each tab's filters are parked when
    // leaving it and restored when coming back; tab and company are shared by all tabs.
    const activeSlug = searchParams.get("tab");
    const tabFiltersRef = useRef({});

    /* STATES */
    const [generalDashboardData, setGeneralDashboardData] = useState([]);
    const [clientOnboardingData, setClientOnboardingData] = useState([]);
    const [ClientOnBoardingByCompanyData, setClientOnBoardingByCompanyData] = useState([]);
    const [activeDrawer, setActiveDrawer] = useState(null);
    const [widgetsList, setWidgetsList] = useState([]);
    const [widgetsLoaded, setWidgetsLoaded] = useState(false);
    const [page] = useState(1);
    const [limit] = useState(20);

    const userType = decryptData(localStorage.getItem("user_type"));
    const userId = decryptData(localStorage.getItem("user_id"));
    const shouldShow = (id) => {
        return Array.isArray(widgetsList) &&
            widgetsList.flat().some(
                item => item?.widget_id?.toUpperCase() === id.toUpperCase()
            );
    };
    // Switch tabs. The current tab's filters are parked and the target's come back, unless `params`
    // is given (a drill-down from another dashboard), in which case those filters are opened instead.
    const switchTab = (toSlug, params) => {
        const fromSlug = activeSlug || "compliance-cockpit";
        setSearchParams((prev) => {
            const own = new URLSearchParams(prev);
            SHARED_PARAMS.forEach((key) => own.delete(key));
            tabFiltersRef.current[fromSlug] = own.toString();

            const next = new URLSearchParams();
            next.set("tab", toSlug);
            if (prev.get("company_name")) next.set("company_name", prev.get("company_name"));
            const restored = params
                ? Object.entries(params).map(([key, value]) => [key, Array.isArray(value) ? value.join(",") : value])
                : [...new URLSearchParams(tabFiltersRef.current[toSlug] || "").entries()];
            restored.forEach(([key, value]) => value && next.set(key, value));
            return next;
        });
    };
    const openTab = (toSlug, params) => {
        switchTab(toSlug, params);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    // The cockpit is the default tab, so it is active when ?tab= is missing or unknown
    const isCockpitActive = !activeSlug || activeSlug === "compliance-cockpit";

    const tabsList = [
        {
            label: "Compliance Cockpit",
            slug: "compliance-cockpit",
            title: "Compliance Cockpit",
            content:
                selectedCompany !== "" ? (
                    <CockpitComplinceByCompany
                        companyName={selectedCompany}
                        setSelectedCompany={setSelectedCompany}
                        shouldShow={shouldShow}
                        isActive={isCockpitActive}
                        openTab={openTab}
                    />
                ) : (
                    <CockpitComplince
                        setSelectedCompany={setSelectedCompany}
                        shouldShow={shouldShow}
                        isActive={isCockpitActive}
                        openTab={openTab}
                    />
                )
        },
        {
            label: "General Compliance",
            slug: "general-compliance",
            title: "General Compliance",
            content: (
                <GeneralComplianceDashboard data={generalDashboardData}
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
            withoutWidgets: true, // not gated by widget mappings
            content:
                selectedCompany === "" ? (
                    <ClientOnbordingDashboard
                        data={clientOnboardingData}
                        selectedCompany={selectedCompany}
                        activeDrawer={activeDrawer}
                        setActiveDrawer={setActiveDrawer}
                    />) : (
                    <ClientOnBoardingByCompany
                        locationData={ClientOnBoardingByCompanyData}
                        selectedCompany={selectedCompany}
                        activeDrawer={activeDrawer}
                        setActiveDrawer={setActiveDrawer}
                    />
                )
        });
    }

    tabsList.push(
        {
            label: "Registers",
            slug: "register",
            title: "Register Dashboard",
            content: (
                <RegisterDashboard
                    selectedCompany={selectedCompany}
                    setSelectedCompany={setSelectedCompany}
                    shouldShow={shouldShow}
                    isActive={activeSlug === "register"}
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
                    shouldShow={shouldShow}
                    isActive={activeSlug === "returns-submissions"}
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
                    shouldShow={shouldShow}
                    isActive={activeSlug === "challan"}
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
                    shouldShow={shouldShow}
                    isActive={activeSlug === "license"}
                />
            )
        },
        {
            label: "Payroll Services",
            slug: "payroll-services",
            title: "Payroll",
            content: (
                <PayrollServices
                    selectedCompany={selectedCompany}
                    shouldShow={shouldShow}
                    activeDrawer={activeDrawer}
                    setActiveDrawer={setActiveDrawer}
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
                    shouldShow={shouldShow}
                    widgetsList={widgetsList}
                    activeDrawer={activeDrawer}
                    setActiveDrawer={setActiveDrawer}
                />
            )
        }
    );

    const activeIndex = Math.max(0, tabsList.findIndex((t) => t.slug === activeSlug));

    useEffect(() => {
        setActiveTitle(tabsList[activeIndex]?.title || "");
        // eslint-disable-next-line react-hooks/exhaustive-deps -- tabsList is rebuilt every render
    }, [activeIndex, userType]);

    const handleTabChange = (event, newValue) => switchTab(tabsList[newValue].slug);

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

    const noWidgets = widgetsLoaded && !widgetsList.flat().length;

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
            setWidgetsLoaded(true);
        };
        fetchWidgetsListData();
    }, [selectedCompany]);
    return (
        <Box sx={{ width: "100%" }}>
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
                        {/* Widgets are gated by shouldShow, so with none (or a failed load) the panel would be blank */}
                        {noWidgets && !tab.withoutWidgets ? (
                            <div className="alert alert-light border text-center text-muted py-4">
                                No widgets assigned. Contact your admin.
                            </div>
                        ) : (
                            tab.content
                        )}
                    </TabPanel>
                ))}
            </Box>

        </Box>
    );
};

export default NavigationTabs;
