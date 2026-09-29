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
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchAllCompanies, fetchAllUser } from "../api/service";
import { decryptData } from "./utils/encrypt";

const DashboardPage = () => {
  const [companyName, setCompanyName] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  // The selected company is kept in the URL (?company_name=) so dashboard views are shareable
  const urlCompany = searchParams.get("company_name") || "";
  const [selectedCompany, setSelectedCompany] = useState(urlCompany); // single selected value
  const syncedCompanyRef = useRef(urlCompany);

  // URL changed from outside (back/forward, a pasted link): follow it
  useEffect(() => {
    if (urlCompany === syncedCompanyRef.current) return;
    syncedCompanyRef.current = urlCompany;
    setSelectedCompany(urlCompany);
  }, [urlCompany]);

  // Company picked in the page: write it to the URL
  useEffect(() => {
    if (selectedCompany === syncedCompanyRef.current) return;
    syncedCompanyRef.current = selectedCompany;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (selectedCompany) next.set("company_name", selectedCompany);
      else next.delete("company_name");
      return next;
    });
  }, [selectedCompany, setSearchParams]);
  const [activeTitle, setActiveTitle] = useState(""); // header title of the active dashboard tab
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
        setCompanyName([]);
      }
      if (allUserRes.status === "fulfilled" && Array.isArray(allUserRes.value)) {
        setAllUser(allUserRes.value);
      } else {
        setAllUser([]);
      }
    };

    fetchCockpitData();
  }, []);
    const userType = decryptData(localStorage.getItem("user_type"));

  return (
    <div>
      <div className="dashboard-header-card dashboard-page-title justify-content-between d-lg-flex d-md-flex">
        <div className="mb-4 d-flex align-items-center ">
          <span>
            <img src={LaptopMinimalCheck} width={55} />
          </span>
          <div className="mt-1 ps-lg-4 ps-md-4 fw-600 fs-5">
            {activeTitle}
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
          {userType === "0" && (
   <div className="me-1 ms-1" style={{ width: '250px' }}>
          
              <SingleSelectTextField
              name="user_id"
              label="Choose a user to create a widget"
              value={current.user_name ?? ''}
              onChange={(e) => {
                const userName = e.target.value;
                const matchedUser = allUser.find((u) => u.full_name === userName);

                setCurrent((prev) => ({
                  ...prev,
                  user_id: matchedUser?._id,
                  user_name: matchedUser?.full_name || '',
                }));
              }}
              names={allUser?.map((item) => ({
                _id: item._id,
                name: item.full_name,
              }))}
            />
        
            

          </div>

          )}
       
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
          setSelectedCompany={setSelectedCompany}
          setActiveTitle={setActiveTitle}
          current={current}
        />
        {/* <ComplianceMasterDashboard /> */}
      </div>
      <div>{/* <ComplianceCockpit /> */}</div>
    </div>
  );
};

export default DashboardPage;
