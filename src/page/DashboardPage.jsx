import "../style/dashboard.css";
import StatsCards from "../component/StatsCards";
import Donut from "../component/charts/Donut";
import StackedBar from "../component/charts/StackedBar";
import ComplianceMasterDashboard from "./ComplianceMasterDashboard";
import ComplianceCockpit from "../component/ComplianceCockpitDashboard/ComplianceCockpit";
import LaptopMinimalCheck from "../assets/compliance-cockpit.png";
import ComplianceCpckpitTabs from "../component/ComplianceCpckpitTabs";
import NavigationTabs from "../dashboards/NavigationTabs";
import SingleSelectTextField from "../component/MuiInputs/SingleSelectTextField";
import { useEffect, useState } from "react";
import { fetchAllCompanies } from "../api/service";

const DashboardPage = () => {
  const [companyName, setCompanyName] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(""); // single selected value
  const [activeTab, setActiveTab] = useState(0); // To toggle between stats and statsComp
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await fetchAllCompanies();
        if (data) {
          setCompanyName(data);
        }
      } catch (error) {
        console.error("Failed to fetch company:", error);
      }
    };

    fetchCompany();
  }, []);
  return (
    <div>
      <div className="dashboard-header-card notification-page-title justify-content-between d-lg-flex d-md-flex">
        <div className="mb-4 d-flex ">
          <span>
            <img src={LaptopMinimalCheck} width={65} />
          </span>
          <h1 className="mt-1 ps-lg-4 ps-md-4 fw-600">
            {activeTab === 0
              ? "Compliance Cockpit"
              : activeTab === 1
              ? "General Compliance"
              : activeTab === 2
              ? "Client Onboarding"
              : activeTab === 3
              ? "Payroll"
              : activeTab === 4
              ? "Payroll - Returns & Submissions"
              : activeTab === 5
              ? "Payroll - Helpdesk & Escalations"
              : activeTab === 6
              ? "Payroll - General Helpdesk"
              : activeTab === 7
              ? "Audit & Visits"
              : activeTab === 8
              ? "Notices & Inspections"
              : ""}
          </h1>
        </div>
        <div className="w-25">
          <SingleSelectTextField
            name="company_name"
            label="Company Name"
            value={selectedCompany || ""}
            onChange={(e) => {
              setSelectedCompany(e.target.value);
            }}
            names={companyName?.map((data) => ({
              _id: data?._id,
              name: data?.company_name || "",
            }))}
          />
        </div>
      </div>

      <div>{/* <StatsCards /> */}</div>
      {/* <div className=' stats-grid'>
        <div className='stat-card '>
          <Donut />
        </div>
        <div className='stat-card '>
          <StackedBar />
        </div>
      </div> */}
      <div>
        {/* this is also navigation tab */}
        {/* <ComplianceCpckpitTabs /> */}

        <NavigationTabs
          selectedCompany={selectedCompany}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {/* <ComplianceMasterDashboard /> */}
      </div>
      <div>{/* <ComplianceCockpit /> */}</div>
    </div>
  );
};

export default DashboardPage;
