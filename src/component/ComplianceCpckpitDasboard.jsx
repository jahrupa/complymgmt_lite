
import img1 from '../assets/compliance-cockpit-1.png'
import img2 from '../assets/compliance-cockpit-2.png'
import img3 from '../assets/compliance-cockpit-3.png'
import img4 from '../assets/compliance-cockpit-4.png'
import img5 from '../assets/compliance-cockpit-5.png'
import img6 from '../assets/compliance-cockpit-6.png'
import '../style/statsCards.css'
const ComplianceCpckpitDasboard = () => {
  const stats = [
    {
      title: 'Outsourcing',
      icon: img1,
      color: 'green',
      bg_color: '#dcf3f3'
    },
    {
      title: 'Client Onboarding',
      icon: img2,
      color: 'blue',
      bg_color: '#ffecdc'
    },
    {
      title: 'Payroll',
      icon: img3,
      color: 'orange',
      bg_color: '#e7f7f1'
    },

  ];
  const statsComp = [
    {
      title: 'Audit & Visits',
      icon: img4,
      color: 'green',
      bg_color: '#fee9e3'
    },
    {
      title: 'General Compliance',
      icon: img5,
      color: 'blue',
      bg_color: '#eae5fb'
    },
    {
      title: 'Finance & Billing',
      icon: img6,
      color: 'orange',
      bg_color: '#fef4dc'
    },

  ];
  return (
    <div>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{
              animationDelay: `${index * 0.1}s`,
              backgroundColor: stat.bg_color
            }}
          >
            <div className="stat-card-content">
              <div>
                <img src={stat.icon} alt={stat.title} width={65} />
              </div>
              <div className="stat-info">
                <h6>{stat.title}</h6>
                {/* <h2 className="stat-value">{stat.value}</h2> */}
              </div>

            </div>

          </div>
        ))}
      </div>
      <div className="stats-grid">
        {statsComp.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{
              animationDelay: `${index * 0.1}s`,
              backgroundColor: stat.bg_color
            }}
          >
            <div className="stat-card-content">
               <div>
                <img src={stat.icon} alt={stat.title} width={65} />
              </div>
              <div className="stat-info">
                <h6>{stat.title}</h6>
                {/* <h2 className="stat-value">{stat.value}</h2> */}
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>

  );
};

export default ComplianceCpckpitDasboard;


// import React, { useState } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Tabs,
//   Tab,
//   Grid,
//   LinearProgress,
//   Chip,
//   IconButton,
// } from '@mui/material';
// import {
//   CheckCircle,
//   Warning,
//   Error,
//   MoreHoriz,
//   TrendingUp,
//   AccountBalance,
//   Group,
//   Assignment,
// } from '@mui/icons-material';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
// import { Doughnut, Bar } from 'react-chartjs-2';

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`tabpanel-${index}`}
//       aria-labelledby={`tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   );
// }

// const ComplianceCpckpitDasboard = () => {
//   const [tabValue, setTabValue] = useState(0);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   // Chart data
//   const doughnutData = {
//     labels: ['Headcount', 'Claims', 'Grievances'],
//     datasets: [
//       {
//         data: [150, 5, 2],
//         backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
//         borderWidth: 0,
//         cutout: '70%',
//       },
//     ],
//   };

//   const payrollBarData = {
//     labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
//     datasets: [
//       {
//         data: [8, 12, 6, 10],
//         backgroundColor: '#F59E0B',
//         borderRadius: 4,
//         borderSkipped: false,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Header */}
//       <div className="dashboard-header">
//         <h1 className="dashboard-title">Compliance Cockpit</h1>
//         <IconButton>
//           <MoreHoriz />
//         </IconButton>
//       </div>

//       {/* Tabs */}
//       <div className="tabs-container">
//         <Tabs value={tabValue} onChange={handleTabChange} className="dashboard-tabs">
//           <Tab label="Compliance Health" className="dashboard-tab" />
//           <Tab label="Open Issues" className="dashboard-tab" />
//           <Tab label="SLA %" className="dashboard-tab" />
//           <Tab label="General Compliance" className="dashboard-tab" />
//         </Tabs>
//       </div>

//       {/* Main Dashboard Content */}
//       <TabPanel value={tabValue} index={0}>
//         <div className="dashboard-grid">
//           {/* Left Column */}
//           <div className="left-column">
//             {/* Compliance Health Card */}
//             <div className="card compliance-health-card">
//               <div className="card-header">
//                 <CheckCircle className="icon success-icon" />
//                 <h3>Compliance Health</h3>
//               </div>
//               <div className="metric-value success-text">90%</div>
//               <LinearProgress
//                 variant="determinate"
//                 value={90}
//                 className="progress-bar success-progress"
//               />
//             </div>

//             {/* Open Issues Card */}
//             <div className="card open-issues-card">
//               <div className="card-header">
//                 <Warning className="icon warning-icon" />
//                 <h3>Open Issues</h3>
//               </div>
//               <div className="metric-value warning-text">8</div>
//               <LinearProgress
//                 variant="determinate"
//                 value={65}
//                 className="progress-bar warning-progress"
//               />
//             </div>

//             {/* Outsourcing Card */}
//             <div className="card outsourcing-card">
//               <h3 className="card-title">Outsourcing</h3>
              
//               <div className="section-title">Employee Life Cycle</div>
//               <LinearProgress
//                 variant="determinate"
//                 value={85}
//                 className="progress-bar success-progress lifecycle-progress"
//               />

//               <div className="chart-container">
//                 <Doughnut data={doughnutData} options={chartOptions} />
//                 <div className="chart-center-icon">
//                   <CheckCircle className="center-check-icon" />
//                 </div>
//               </div>

//               <div className="metrics-row">
//                 <div className="metric-item">
//                   <div className="metric-label">Headcount</div>
//                   <div className="metric-number">150</div>
//                 </div>
//                 <div className="metric-item">
//                   <div className="metric-label">Claims</div>
//                   <div className="metric-number">5</div>
//                 </div>
//                 <div className="metric-item">
//                   <div className="metric-label">Grievances</div>
//                   <div className="metric-number">2</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Center Column */}
//           <div className="center-column">
//             <div className="card client-onboarding-card">
//               <h3 className="card-title">Client Onboarding</h3>
              
//               <div className="field-group">
//                 <div className="field-label">Company Code</div>
//                 <div className="field-value">ACME Inc.</div>
//               </div>

//               <div className="field-group">
//                 <div className="field-label">Main SPOC</div>
//                 <div className="field-value">John Smith</div>
//                 <div className="field-subtext">john.smith@email.com</div>
//               </div>

//               <LinearProgress
//                 variant="determinate"
//                 value={75}
//                 className="progress-bar orange-progress main-progress"
//               />

//               <div className="stage-header">
//                 <span className="stage-label">Stage</span>
//                 <span className="sla-label">SLA Days</span>
//               </div>

//               <LinearProgress
//                 variant="determinate"
//                 value={60}
//                 className="progress-bar blue-progress stage-progress"
//               />

//               <div className="sla-metrics">
//                 <div className="sla-item">
//                   <div className="sla-label">SLA Days</div>
//                   <div className="sla-value">60</div>
//                 </div>
//                 <div className="sla-item">
//                   <div className="sla-label">Actual Days</div>
//                   <div className="sla-value">45</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="right-column">
//             {/* Payroll Card */}
//             <div className="card payroll-card">
//               <h3 className="card-title">Payroll</h3>
              
//               <div className="payroll-subtitle">Payroll processor for Month</div>

//               <div className="employees-count">
//                 <span className="employees-label">Employees</span>
//                 <span className="employees-number">206</span>
//               </div>

//               <div className="challans-section">
//                 <div className="challan-item">
//                   <CheckCircle className="challan-check" />
//                   <span>Challans Filed</span>
//                   <span className="challan-type">PF</span>
//                 </div>
//                 <div className="challan-item">
//                   <CheckCircle className="challan-check" />
//                   <span>ESI</span>
//                   <span className="challan-type">PT</span>
//                 </div>
//                 <div className="challan-item">
//                   <CheckCircle className="challan-check" />
//                   <span>LWF</span>
//                   <span className="challan-type">LWF</span>
//                 </div>
//               </div>

//               <div className="returns-filed">
//                 <span className="returns-label">Returns Filed</span>
//                 <span className="returns-value">15/20</span>
//               </div>

//               <div className="payroll-run-section">
//                 <div className="payroll-run-header">
//                   <span className="payroll-run-label">Payroll Run</span>
//                   <span className="payroll-run-value">78</span>
//                 </div>
//                 <div className="chart-small">
//                   <Bar data={payrollBarData} options={{ ...chartOptions, scales: { x: { display: false }, y: { display: false } } }} />
//                 </div>
//                 <div className="chart-bottom-value">10</div>
//               </div>
//             </div>

//             {/* General Compliance Card */}
//             <div className="card general-compliance-card">
//               <h3 className="card-title">General Compliance</h3>

//               <div className="compliance-item">
//                 <div className="compliance-item-left">
//                   <Assignment className="compliance-icon registers-icon" />
//                   <span>Registers</span>
//                 </div>
//                 <span className="compliance-value">10</span>
//               </div>

//               <div className="compliance-item">
//                 <div className="compliance-item-left">
//                   <AccountBalance className="compliance-icon licenses-icon" />
//                   <span>Licenses</span>
//                 </div>
//                 <span className="compliance-value">4</span>
//               </div>

//               <div className="compliance-item">
//                 <div className="compliance-item-left">
//                   <TrendingUp className="compliance-icon returns-icon" />
//                   <span>Returns</span>
//                 </div>
//                 <LinearProgress
//                   variant="determinate"
//                   value={70}
//                   className="compliance-progress"
//                 />
//               </div>

//               <div className="compliance-item">
//                 <div className="compliance-item-left">
//                   <Group className="compliance-icon training-icon" />
//                   <span>Training</span>
//                 </div>
//                 <Chip label="Expiring" size="small" className="expiring-chip" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Finance & Billing Section */}
//         <div className="card finance-billing-card">
//           <h3 className="card-title">Finance & Billing</h3>
          
//           <div className="finance-grid">
//             <div className="finance-item">
//               <div className="finance-label">Outsourcing Billed</div>
//               <div className="finance-value">₹ 1.2 M</div>
//               <LinearProgress
//                 variant="determinate"
//                 value={85}
//                 className="progress-bar blue-progress"
//               />
//             </div>

//             <div className="finance-item">
//               <div className="finance-label">Compliance Billed</div>
//               <div className="finance-value">₹ 900 k</div>
//               <LinearProgress
//                 variant="determinate"
//                 value={75}
//                 className="progress-bar blue-progress"
//               />
//             </div>

//             <div className="finance-item">
//               <div className="finance-label">Payroll Billed</div>
//               <div className="finance-value">₹ 600 k</div>
//               <LinearProgress
//                 variant="determinate"
//                 value={60}
//                 className="progress-bar blue-progress"
//               />
//             </div>

//             <div className="finance-item">
//               <div className="finance-label">Outstanding</div>
//               <div className="finance-value">₹ 150 k</div>
//               <LinearProgress
//                 variant="determinate"
//                 value={30}
//                 className="progress-bar red-progress"
//               />
//             </div>

//             <div className="finance-item">
//               <div className="finance-label">Overdue</div>
//               <div className="finance-value overdue-value">₹ 150 k</div>
//               <div className="overdue-text">Immediate attention required</div>
//             </div>
//           </div>
//         </div>
//       </TabPanel>

//       {/* Other Tab Panels */}
//       <TabPanel value={tabValue} index={1}>
//         <div className="tab-content">
//           <h2>Open Issues Dashboard</h2>
//           <p>Detailed view of all open compliance issues and their resolution status.</p>
//         </div>
//       </TabPanel>

//       <TabPanel value={tabValue} index={2}>
//         <div className="tab-content">
//           <h2>SLA Performance</h2>
//           <p>Service Level Agreement tracking and performance metrics.</p>
//         </div>
//       </TabPanel>

//       <TabPanel value={tabValue} index={3}>
//         <div className="tab-content">
//           <h2>General Compliance Overview</h2>
//           <p>Comprehensive view of all compliance requirements and their status.</p>
//         </div>
//       </TabPanel>
//     </div>
//   );
// };

// export default ComplianceCpckpitDasboard;