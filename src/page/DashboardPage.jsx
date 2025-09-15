import React, { useState } from 'react'
import '../style/dashboard.css'
import StatsCards from '../component/StatsCards';
import Donut from '../component/charts/Donut';
import StackedBar from '../component/charts/StackedBar';
import ComplianceMasterDashboard from './ComplianceMasterDashboard';
import ComplianceCockpit from '../component/ComplianceCockpitDashboard/ComplianceCockpit';
import LaptopMinimalCheck from '../assets/compliance-cockpit.png'
import ComplianceCpckpitTabs from '../component/ComplianceCpckpitTabs';

const DashboardPage = () => {
  
  return (
    <div>
      <div>
        <div className='mb-4 d-flex dashboard-header-card notification-page-title'>
          <span>
            <img src={LaptopMinimalCheck} width={65} /> 
          </span>
          <h1 className='mt-1 ps-lg-4 ps-md-4 fw-600'>Compliance Cockpit</h1>
        </div>

      </div>

      <div>
        <StatsCards />
      </div>
      {/* <div className=' stats-grid'>
        <div className='stat-card '>
          <Donut />
        </div>
        <div className='stat-card '>
          <StackedBar />
        </div>
      </div> */}
      <div>
        <ComplianceCpckpitTabs />
        {/* <ComplianceMasterDashboard /> */}
      </div>
      <div>
        <ComplianceCockpit />
      </div>
    </div>
  )
}

export default DashboardPage