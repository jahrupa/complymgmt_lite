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
import { fetchAllCompanies, fetchAllUser } from "../api/service";

const DashboardPage = () => {
  const [companyName, setCompanyName] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(""); // single selected value
  const [activeTab, setActiveTab] = useState(0); // To toggle between stats and statsComp
  const [current, setCurrent] = useState({});
  const [allUser, setAllUser] = useState([]);
  useEffect(() => {
    const fetchCockpitData = async () => {
      const [cockpitByCompanyRes, allUserRes] = await Promise.allSettled([
        fetchAllCompanies(),
        fetchAllUser(),
      ]);
      if (cockpitByCompanyRes.status === "fulfilled" && Array.isArray(cockpitByCompanyRes.value)) {
        setCompanyName(cockpitByCompanyRes.value);
      } else {
        console.warn("fetchAll Companies failed:", cockpitByCompanyRes.reason);
        setCompanyName([]);
      }
      if (allUserRes.status === "fulfilled" && Array.isArray(allUserRes.value)) {
        setAllUser(allUserRes.value);
      } else {
        console.warn("fetchAll Users failed:", allUserRes.reason);
        setAllUser([]);
      }
    };

    fetchCockpitData();
  }, []);

  return (
    <div>
      <div className="dashboard-header-card dashboard-page-title justify-content-between d-lg-flex d-md-flex">
        <div className="mb-4 d-flex align-items-center ">
          <span>
            <img src={LaptopMinimalCheck} width={55} />
          </span>
          <div className="mt-1 ps-lg-4 ps-md-4 fw-600 fs-5">
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
          </div>
        </div>
        <div className="d-lg-flex d-md-flex justify-content-between"
        >
          <div className="me-1 ms-1" style={{ width: '250px' }}>
            <SingleSelectTextField
              name="company_name"
              label="Company Name"
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
              }}
              names={companyName?.map((data) => ({
                _id: data?._id,
                name: data?.company_name,
              }))}
            />
          </div>
          <div className="me-1 ms-1" style={{ width: '250px' }}>
            <SingleSelectTextField
              name="user_name"
              label="Choose a user to create a widget"
              value={current.user_name}
              onChange={(e) => {
                const selectedName = e.target.value;
                const matchedUser = allUser.find(
                  (item) => item.full_name === selectedName
                );
                setCurrent((prev) => ({
                  ...prev,
                  user_name: selectedName,
                  user_id: matchedUser?._id || null,
                }));
              }}
              names={allUser?.map((item) => ({
                _id: item._id,
                name: item.full_name,
              }))}
            />
          </div>
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
          current={current}
        />
        {/* <ComplianceMasterDashboard /> */}
      </div>
      <div>{/* <ComplianceCockpit /> */}</div>
    </div>
  );
};

export default DashboardPage;
