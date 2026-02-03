import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const DashboardInternalPage = () => {
    const { state } = useLocation();
  return (
  <>
   <div><div className="service-tracker-inner-page-header d-lg-flex d-md-flex">
        <div className="notification-page-title">
          <div>
            <h1>{state?.widget_name}</h1>
          </div>
        </div>
        <div className="d-lg-flex d-md-flex gap-2 mt-2">
          <button className="crud_btn w-100 mb-2" onClick={() => window.history.back()}>
            <span>
            Go to dashboard
            </span>{" "}
          </button>
        </div>
      </div></div>
   <div>{state?.score}</div>
   <div>{state?.seriesName}</div>
  <div>{state?.dataPointIndex}</div>
  </>
   
  )
}

export default DashboardInternalPage