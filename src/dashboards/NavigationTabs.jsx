import React, { useEffect, useState } from 'react';
// import img1 from '../assets/compliance-cockpit-1.png';
// import img2 from '../assets/compliance-cockpit-2.png';
// import img3 from '../assets/compliance-cockpit-3.png';
// import img4 from '../assets/compliance-cockpit-4.png';
// import img5 from '../assets/compliance-cockpit-5.png';
// import img6 from '../assets/compliance-cockpit-6.png';
import '../style/statsCards.css';
import { Tabs, Tab, Box } from '@mui/material';
import GeneralComplianceDashboard from '../dashboards/GeneralComplianceDashboard/GeneralComplianceDashboard';
import { fetchComplainceCockpit, fetchComplainceCockpitByCompany, fetchGeneralCompaiancePortfolio } from '../api/service';
import CockpitComplinceByCompany from './cockpitDashboard/CockpitComplinceByCompany';
import CockpitComplince from './cockpitDashboard/CockpitComplince';
import ClientOnbordingDashboard from './clientOnbordingDashboard/ClientOnbordingDashboard';

const NavigationTabs = ({selectedCompany,activeTab,setActiveTab}) => {

    const [data, setData] = useState([]);
    const [cockpitByCompanyData, setCockpitByCompanyData] = useState([]);
    const [cockpitData, setCockpitData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const generalDashboardData = await fetchGeneralCompaiancePortfolio();
                setData(generalDashboardData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchCockpitData = async () => {
            const [cockpitByCompanyRes , cockpitRes] = await Promise.allSettled([
                    // pass selectedCompany state
                fetchComplainceCockpitByCompany('Kids Clinic India Limited'),
                fetchComplainceCockpit()
            ]);

            if (cockpitByCompanyRes.status === 'fulfilled') {
                setCockpitByCompanyData(cockpitByCompanyRes.value);
            } else {
                console.warn("fetchAll cockpit failed:", cockpitByCompanyRes.reason);
            }
              if (cockpitRes.status === 'fulfilled') {
                setCockpitData(cockpitRes.value);
            } else {
                console.warn("fetchAll cockpit failed:", cockpitRes.reason);
            }
            
        };

        fetchCockpitData();
    }, []);
    // const stats = [
    //     {
    //         title: 'Outsourcing',
    //         icon: img1,
    //         color: 'green',
    //         bg_color: '#dcf3f3',
    //     },
    //     {
    //         title: 'Client Onboarding',
    //         icon: img2,
    //         color: 'blue',
    //         bg_color: '#ffecdc',
    //     },
    //     {
    //         title: 'Payroll',
    //         icon: img3,
    //         color: 'orange',
    //         bg_color: '#e7f7f1',
    //     },
    // ];

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // const renderCards = (data) => {
    //     return (
    //         <div className="stats-grid">
    //             {data.map((stat, index) => (
    //                 <div
    //                     key={index}
    //                     className="stat-card"
    //                     style={{
    //                         animationDelay: `${index * 0.1}s`,
    //                         backgroundColor: stat.bg_color,
    //                     }}
    //                 >
    //                     <div className="stat-card-content">
    //                         <div>
    //                             <img src={stat.icon} alt={stat.title} width={65} />
    //                         </div>
    //                         <div className="stat-info">
    //                             <h6>{stat.title}</h6>
    //                         </div>
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //     );
    // };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto" >
                    <Tab label="Cockpit" />
                    <Tab label="General Compliance" />
                    <Tab label="Client Onboarding" />
                </Tabs>
            </Box>

            <Box>
                {/* {activeTab === 0 && renderCards(stats)} */}
                {activeTab === 0 && (selectedCompany !== ''
                    ? <CockpitComplinceByCompany data={cockpitByCompanyData} />
                    : <CockpitComplince data={cockpitData} />)}

                {activeTab === 1 && <GeneralComplianceDashboard data={data} />}
                {activeTab === 2 && <ClientOnbordingDashboard data={cockpitData} />}

            </Box>
        </Box>
    );
};

export default NavigationTabs;
