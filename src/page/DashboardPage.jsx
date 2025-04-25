import React from 'react'
import '../style/dashboard.css'
const DashboardPage = () => {
  return (
    <div>
      <div className='mb-4 d-flex'>
        <span className='v-line me-1 mt-1'></span>
        <span className='v-line me-1 mt-1'></span>
        <span className='v-line me-1 mt-1'></span>
        <span className='dashboard-heading ms-2'>CEO Dashboard</span>
      </div>
      <div className='row'>
        <div className='col-4 col-md-4'>
          <div className='white-card mb-3'>
            <div className='p-3'>
              <div className='dashboard-card-header-text'>Billing & Margin</div>
              <div className='dashboard-card-sub-header-text'>Total Billed</div>
              <div className='dashboard-card-header-text'><span>₹</span>&nbsp;<span>2,950,000</span></div>
              <div className='dashboard-card-sub-header-text'>Margin</div>
              <div className='dashboard-card-header-text'>630,000</div>

            </div>

          </div>
          <div className='white-card mb-3'>
            <div className='p-3'>

              <div className='dashboard-card-header-text'>Outstanding Ageing Summary</div>
              <div className='dashboard-card-sub-header-text d-lg-flex d-md-flex justify-content-between'><span className='progress-text1'>Good</span>
                <span className="progress w-50 mt-1">
                  <div className="progress-bar" role="progressbar" style={{ width: '25%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </span><span className='progress-text'>22,000</span>
              </div>

              <div className='dashboard-card-header-text'><span>₹</span>&nbsp;<span>2,950,000</span></div>
              <div className='dashboard-card-sub-header-text'>Margin</div>
              <div className='dashboard-card-header-text'>630,000</div>
            </div>

          </div>
          <div className='white-card mb-3'>
          </div>
        </div>

        <div className='col-4 col-md-4'>
          <div className='white-card mb-3'>
          </div>
          <div className='white-card mb-3'>
          </div>
          <div className='white-card mb-3'>
          </div>
        </div>

        <div className='col-4 col-md-4'>
          <div className='white-card mb-3'>
          </div>
          <div className='white-card mb-3'>
          </div>
          <div className='white-card mb-3'>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage