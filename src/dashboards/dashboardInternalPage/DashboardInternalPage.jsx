import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const DashboardInternalPage = () => {
    const { state } = useLocation();
console.log(state,'state')
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
          {/* <div className="btn-wrap-div">
            <button
              className="button approve w-100 justify-content-center"
              // onClick={() => handleApproveAll()}
            >
              <span className="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12 3.41 13.41 9 19 21 7 19.59 5.59z" />
                </svg>
              </span>
              <span className="text">Approve</span>
            </button>
          </div> */}
        </div>
      </div></div>
   <div>{state?.score}</div>
   <div>{state?.seriesName}</div>
  <div>{state?.dataPointIndex}</div>
  </>
   
  )
}

export default DashboardInternalPage