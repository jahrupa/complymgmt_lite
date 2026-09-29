import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchGeneralCompaiancePortfolio } from "../../api/service";
import { WidgetPreviewContext } from "../../dashboards/common/useDashboard";
import CockpitComplince from "../../dashboards/cockpitDashboard/CockpitComplince";
import CockpitComplinceByCompany from "../../dashboards/cockpitDashboard/CockpitComplinceByCompany";
import GeneralComplianceDashboard from "../../dashboards/GeneralComplianceDashboard/GeneralComplianceDashboard";
import RegisterDashboard from "../../dashboards/registerDashboard/RegisterDashboard";
import ReturnsDashboard from "../../dashboards/returnsDashboard/ReturnsDashboard";
import ChallanDashboard from "../../dashboards/challanDashboard/ChallanDashboard";
import LicenseDashboard from "../../dashboards/licenseDashboard/LicenseDashboard";
import PayrollServices from "../../dashboards/payrollDashboard/PayrollServices";
import HelpdeskAndEscalations from "../../dashboards/payrollDashboard/HelpdeskAndEscalations";
import GeneralHelpdesk from "../../dashboards/payrollDashboard/GeneralHelpdesk";
import AuditAndVisitDashboard from "../../dashboards/Audit/AuditAndVisitDashboard";
import NoticeDashboard from "../../dashboards/noticeDashboard/NoticeDashboard";
import { widgetPrefix } from "./widgetCatalog";

const noop = () => {};

// General Compliance receives its data from the dashboard page, so the preview loads it itself
const GeneralCompliancePreview = (props) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        let cancelled = false;
        fetchGeneralCompaiancePortfolio()
            .then((res) => !cancelled && setData(res))
            .catch(() => !cancelled && setData({}));
        return () => {
            cancelled = true;
        };
    }, []);
    return <GeneralComplianceDashboard data={data} page={1} limit={20} setActiveDrawer={noop} {...props} />;
};

/**
 * Live snapshot of one widget: its dashboard rendered with current data (all companies, no
 * filters) and only that widget allowed through. It is inert, so it can't be clicked or navigated,
 * and filters stay in memory rather than in the page URL.
 */
const WidgetPreview = ({ widgetId, companyName }) => {
    const id = String(widgetId).toLowerCase();
    const shouldShow = useCallback((candidate) => String(candidate).toLowerCase() === id, [id]);
    const widgetsList = useMemo(() => [{ widget_id: widgetId }], [widgetId]);
    const previewContext = useMemo(() => ({ widgetId }), [widgetId]);

    // Props every dashboard accepts; each one ignores what it doesn't use
    const common = {
        shouldShow,
        widgetsList,
        isActive: true,
        selectedCompany: "",
        setSelectedCompany: noop,
        openTab: noop,
        activeDrawer: null,
        setActiveDrawer: noop,
    };

    const dashboards = {
        CC: () => <CockpitComplince {...common} />,
        CCBC: () => <CockpitComplinceByCompany {...common} companyName={companyName} />,
        GC: () => <GeneralCompliancePreview shouldShow={shouldShow} />,
        RG: () => <RegisterDashboard {...common} />,
        RT: () => <ReturnsDashboard {...common} />,
        CH: () => <ChallanDashboard {...common} />,
        LC: () => <LicenseDashboard {...common} />,
        PS: () => <PayrollServices {...common} />,
        HE: () => <HelpdeskAndEscalations {...common} />,
        GH: () => <GeneralHelpdesk {...common} />,
        AV: () => <AuditAndVisitDashboard {...common} />,
        NI: () => <NoticeDashboard {...common} />,
    };
    const render = dashboards[widgetPrefix(widgetId)];

    if (!render) {
        return <div className="widget-preview-empty">No preview is available for {widgetId}.</div>;
    }

    return (
        <WidgetPreviewContext.Provider value={previewContext}>
            <div className="widget-preview-canvas" inert>
                {render()}
            </div>
        </WidgetPreviewContext.Provider>
    );
};

export default WidgetPreview;
