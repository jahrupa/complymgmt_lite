// import { LaptopMinimalCheck } from 'lucide-react'
import React from 'react'
import LaptopMinimalCheck from '../assets/compliance-cockpit.png'

import ComplianceCpckpitTabs from '../component/ComplianceCpckpitTabs'

const ComplianceMasterDashboard = () => {
    return (
        <div>
            <div className='compliance-master-dashboard d-lg-flex d-md-flex'>
                <img src={LaptopMinimalCheck} width={65} /> <h1 className='mt-1 ps-lg-4 ps-md-4 fw-600'>Compliance Cockpit</h1>
            </div>
            <div>
                <div>
                    <ComplianceCpckpitTabs />
                </div>
                
            </div>
        </div>
    )
}

export default ComplianceMasterDashboard