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
import { fetchAllCompanies } from "../api/service";

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
  // The widgets cover all of the user's companies anyway, so a failed company list only disables the filter
  const [companyFilterUnavailable, setCompanyFilterUnavailable] = useState(false);
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // TODO: switch to GET /api/v1/dashboard/view/companies once the backend adds it (same
        // response shape, already limited to the user's companies). /company/view/multiple needs a
        // "company" page grant, so users without one get a 403 here.
        const companies = await fetchAllCompanies();
        setCompanyName(Array.isArray(companies) ? companies : []);
      } catch {
        setCompanyName([]);
        setCompanyFilterUnavailable(true);
      }
    };

    fetchCompanies();
  }, []);

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
            {companyFilterUnavailable ? (
              <>
                {/* A company from a shared link (?company_name=) still applies to the widgets */}
                <SingleSelectTextField
                  name="company_name"
                  label="Company Name"
                  value={selectedCompany || "All companies"}
                  onChange={() => {}}
                  names={[{ _id: "selected", name: selectedCompany || "All companies" }]}
                  isdisable
                />
                <div className="text-muted small" style={{ marginTop: -12 }}>Company filter unavailable</div>
              </>
            ) : (
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
            )}
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
          setSelectedCompany={setSelectedCompany}
          setActiveTitle={setActiveTitle}
        />
        {/* <ComplianceMasterDashboard /> */}
      </div>
      <div>{/* <ComplianceCockpit /> */}</div>
    </div>
  );
};

export default DashboardPage;
