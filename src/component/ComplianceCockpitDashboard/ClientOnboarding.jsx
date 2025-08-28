import React from 'react';
import '../../style/clientOnboarding.css';

const ClientOnboarding = () => {
  return (
    <div className="client-onboarding">
      <h2>Client Onboarding</h2>
      
      <div className="client-info">
        <div className="info-row">
          <span className="label">Company Code</span>
          <span className="value company-name">ACME Inc.</span>
        </div>
        
        <div className="info-row">
          <span className="label">Main SPOC</span>
          <div className="spoc-info">
            <span className="spoc-name">John Smith</span>
            <span className="spoc-email">john.smith@email.com</span>
          </div>
        </div>
      </div>

      <div className="stage-progress">
        <div className="stage-header">
          <span>Stage</span>
          <span>SLA Days</span>
        </div>
        <div className="progress-section">
          <div className="stage-bar">
            <div className="stage-fill" style={{width: '60%'}}></div>
          </div>
          <span className="sla-value">60</span>
        </div>
      </div>

      <div className="sla-comparison">
        <div className="sla-item">
          <span className="sla-label">SLA Days</span>
          <span className="sla-number">60</span>
        </div>
        <div className="sla-item">
          <span className="sla-label">Actual Days</span>
          <span className="sla-number">45</span>
        </div>
      </div>
    </div>
  );
};

export default ClientOnboarding;