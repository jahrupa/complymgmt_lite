import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import '../../style/clientOnbordingDashboard.css';

const ClientOnbordingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Data from the JSON
  const data = {
    "client_by_industry": {
      "": 66,
      "automobiles": 9,
      "automotive retail & manufacturing": 1,
      "bakery": 2,
      "banking": 2,
      "broadcasting & media production": 1,
      "business process outsourcing": 1,
      "capital market services": 1,
      "catering services": 2,
      "cement": 1,
      "chemical": 1,
      "chemicals / agrochemicals manufacturing & pharma distribution": 1,
      "chemicals and plastic trading": 1,
      "clearing and settlement of dealings in securities and investments": 4,
      "club": 3,
      "communication": 1,
      "construction": 12,
      "construction & chemicals manufacturing industry": 1,
      "construction materials": 1,
      "consultancy": 1,
      "consultancy services": 1,
      "courier": 1,
      "crew management": 1,
      "csr": 1,
      "cyber security": 1,
      "data processing": 1,
      "data storage": 1,
      "data structure": 1,
      "e-commerce": 1,
      "education": 2,
      "electronics": 3,
      "energy": 1,
      "engineering": 4,
      "entertainment & media": 1,
      "facility management": 2,
      "film": 2,
      "finance": 1,
      "financial": 5,
      "financial services – specialty housing finance": 1,
      "fitness": 2,
      "food": 1,
      "gardening": 1,
      "health care": 3,
      "health care counselling": 1,
      "hospitality": 2,
      "hospitality industry": 4,
      "hospitality – hotel management & accommodation": 1,
      "hospitality – traveler accommodation (hostels)": 1,
      "hotel": 18,
      "hotel & restaurants": 1,
      "hotel and restaurants": 1,
      "housekeeping": 1,
      "imaging and printing technology": 1,
      "information technology": 2,
      "insurance": 1,
      "investment holding": 1,
      "investment management": 1,
      "issuing of lei": 3,
      "it": 6,
      "it & ites": 11,
      "it consulting and outsourcing": 1,
      "it enabled services": 3,
      "it industry": 3,
      "it services company": 1,
      "logistics": 9,
      "logistics – cold chain & warehousing services": 1,
      "mall": 1,
      "manpower services": 2,
      "manufacturer and marketer of pharmaceutical and chemical products": 1,
      "manufacturer of chemicals for lab work": 1,
      "manufacturing": 1,
      "manufacturing importing marking, distributing and selling packaged food product under reputed brands": 16,
      "manufacturing of aluminium tubes": 5,
      "nbfc": 1,
      "non-banking": 1,
      "oil and gas industry": 1,
      "packaging industry": 2,
      "packing": 3,
      "pharmaceutical company": 1,
      "pharmaceutical manufacturing": 1,
      "printing & packaging": 1,
      "providing dealing systems/platforms in various instruments for money market": 3,
      "real estate": 7,
      "real estate development": 2,
      "renewable energy – rooftop solar solutions": 1,
      "retail": 1,
      "retail store": 4,
      "school": 3,
      "service": 1,
      "service to socities": 1,
      "software": 2,
      "software developers": 1,
      "software development": 1,
      "staffing and recruitment": 1,
      "steel goods": 1,
      "supplier of effect pigments and cosmetic ingredients": 1,
      "telecom": 1,
      "theatre": 2,
      "trading of suspended ceilings systems": 1,
      "transport-airline passenger & cargo transportation service": 13,
      "travel tourism": 2
    },
    "size_wise_client": {
      "": 130,
      "_": 5,
      "big": 83,
      "large": 13,
      "medium": 55,
      "small": 25
    },
    "service_scope_matrix_portfolio": {
      "Abstract": 37,
      "Advisory": 91,
      "Annual returns": 4,
      "Apprentice Management": 1,
      "Audit": 2,
      "Audit representation": 3,
      "Audits": 6,
      "BOCW Cess submission": 1,
      "BOCW Registrations": 1,
      "Challan": 1,
      "Challans": 21,
      "Compliance Calender": 6,
      "Compliance calender": 2,
      "Compliance certificate": 10,
      "Departments Visits for Liasoning": 6,
      "Employee Quarries resoluation": 1,
      "Entity Audit": 18,
      "Entity audit": 1,
      "Esic Challan": 1,
      "Establishment Audit": 3,
      "Establishment compliance": 6,
      "HR audit": 1,
      "HRMS": 57,
      "Inspection": 9,
      "Inspections": 57,
      "LWF challan": 7,
      "License": 9,
      "Licensing": 80,
      "Licensing and registration": 1,
      "Managing Inspections and Notices": 1,
      "Manual": 13,
      "NA": 5,
      "NAPS": 1,
      "NATS": 1,
      "Night shift exemptions certificate": 1,
      "Notices": 2,
      "PF": 6,
      "PF Exclations": 3,
      "PF claims": 2,
      "POSH Services": 4,
      "PT": 5,
      "PT Returns": 16,
      "Payroll Compliance": 1,
      "Payroll compliance": 3,
      "Register": 2,
      "Registers": 80,
      "Resolve PF Quarries and submission the required documents into EPFO": 1,
      "Return": 3,
      "Returns": 82,
      "Smooth": 87,
      "TIC generation": 1,
      "UAN Generations": 1,
      "Vendor Audit": 27,
      "Vendor audit": 3,
      "Women night shift exemption certificates": 1,
      "Zing HR": 3,
      "advisory": 2,
      "inspection": 6,
      "keka": 1,
      "manage inspections": 1,
      "payroll Processing Licensing": 1,
      "records": 1
    }
  };

  // Process data for charts
  const getTopIndustries = () => {
    const industries = Object.entries(data.client_by_industry)
      .filter(([key]) => key !== "")
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    return {
      categories: industries.map(([name]) => name.length > 20 ? name.substring(0, 20) + '...' : name),
      series: industries.map(([,value]) => value)
    };
  };

  const getClientSizeData = () => {
    const sizes = Object.entries(data.size_wise_client)
      .filter(([key]) => key !== "" && key !== "_");
    
    return {
      labels: sizes.map(([name]) => name.charAt(0).toUpperCase() + name.slice(1)),
      series: sizes.map(([,value]) => value)
    };
  };

  const getTopServices = () => {
    const services = Object.entries(data.service_scope_matrix_portfolio)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15);
    
    return {
      categories: services.map(([name]) => name.length > 15 ? name.substring(0, 15) + '...' : name),
      series: services.map(([,value]) => value)
    };
  };

  const industryData = getTopIndustries();
  const clientSizeData = getClientSizeData();
  const servicesData = getTopServices();

  // Chart configurations
  const industryChartOptions = {
    chart: {
      type: 'bar',
      height: 400,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: { position: 'top' }
      }
    },
    colors: ['#3B82F6'],
    dataLabels: {
      enabled: true,
      offsetX: 30,
      style: { fontSize: '12px', colors: ['#304758'] }
    },
    xaxis: {
      categories: industryData.categories,
      title: { text: 'Number of Clients' }
    },
    yaxis: {
      title: { text: 'Industries' }
    },
    title: {
      text: 'Top 10 Industries by Client Count',
      align: 'center',
      style: { fontSize: '18px', fontWeight: 'bold' }
    }
  };

  const sizeChartOptions = {
    chart: {
      type: 'donut',
      height: 400
    },
    colors: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    labels: clientSizeData.labels,
    title: {
      text: 'Client Distribution by Size',
      align: 'center',
      style: { fontSize: '18px', fontWeight: 'bold' }
    },
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + '%';
      }
    }
  };

  const servicesChartOptions = {
    chart: {
      type: 'bar',
      height: 500,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        dataLabels: { position: 'top' }
      }
    },
    colors: ['#8B5CF6'],
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: { fontSize: '12px', colors: ['#304758'] }
    },
    xaxis: {
      categories: servicesData.categories,
      title: { text: 'Services' },
      labels: {
        rotate: -45,
        style: { fontSize: '10px' }
      }
    },
    yaxis: {
      title: { text: 'Count' }
    },
    title: {
      text: 'Top 15 Services in Portfolio',
      align: 'center',
      style: { fontSize: '18px', fontWeight: 'bold' }
    }
  };

  const totalClients = Object.values(data.client_by_industry).reduce((sum, val) => sum + val, 0);
  const totalServices = Object.keys(data.service_scope_matrix_portfolio).length;
  const totalIndustries = Object.keys(data.client_by_industry).filter(key => key !== "").length;

  return (
    <div className="client-onboarding">
      <header className="client-onboarding-header">
        <h1>Business Analytics client-onboarding</h1>
        <p>Comprehensive overview of client distribution and service portfolio</p>
      </header>

      <div className="client-onboarding-nav">
        <button 
          className={activeTab === 'overview' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'industries' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('industries')}
        >
          Industries
        </button>
        <button 
          className={activeTab === 'services' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="client-onboarding-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{totalClients}</div>
              <div className="stat-label">Total Clients</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{totalIndustries}</div>
              <div className="stat-label">Industries Served</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{totalServices}</div>
              <div className="stat-label">Service Types</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{clientSizeData.series.reduce((sum, val) => sum + val, 0)}</div>
              <div className="stat-label">Categorized Clients</div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-container">
              <Chart
                options={sizeChartOptions}
                series={clientSizeData.series}
                type="donut"
                height={400}
              />
            </div>
            <div className="chart-container">
              <Chart
                options={industryChartOptions}
                series={[{ data: industryData.series }]}
                type="bar"
                height={400}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'industries' && (
        <div className="client-onboarding-content">
          <div className="chart-container full-width">
            <Chart
              options={industryChartOptions}
              series={[{ data: industryData.series }]}
              type="bar"
              height={600}
            />
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="client-onboarding-content">
          <div className="chart-container full-width">
            <Chart
              options={servicesChartOptions}
              series={[{ data: servicesData.series }]}
              type="bar"
              height={600}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientOnbordingDashboard;