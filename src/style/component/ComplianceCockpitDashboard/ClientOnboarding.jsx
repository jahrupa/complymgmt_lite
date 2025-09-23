import React from 'react';
import '../../style/clientOnboarding.css';
const clientData = {
  companyCode: "ACME Inc.",
  mainSPOC: {
    name: "John Smith",
    email: "john.smith@email.com"
  },
  stageProgress: {
    stage: "Stage",
    slaDays: 60,
    progressPercent: 60
  },
  slaComparison: {
    slaDays: 60,
    actualDays: 45
  }
};

const ClientOnboarding = () => {
  return (
    <div className="client-onboarding">
      <h2>Client Onboarding</h2>

      <div className="client-info">
        <div className="info-row">
          <span className="label">Company Code</span>
          <span className="value company-name">{clientData.companyCode}</span>
        </div>

        <div className="info-row">
          <span className="label">Main SPOC</span>
          <div className="spoc-info">
            <span className="spoc-name">{clientData.mainSPOC.name}</span>
            <span className="spoc-email">{clientData.mainSPOC.email}</span>
          </div>
        </div>
      </div>

      <div className="stage-progress">
        <div className="stage-header">
          <span>{clientData.stageProgress.stage}</span>
          <span>SLA Days</span>
        </div>
        <div className="progress-section">
          <div className="stage-bar">
            <div
              className="stage-fill"
              style={{ width: `${clientData.stageProgress.progressPercent}%` }}
            ></div>
          </div>
          <span className="sla-value">{clientData.stageProgress.slaDays}</span>
        </div>
      </div>

      <div className="sla-comparison">
        <div className="sla-item">
          <span className="sla-label">SLA Days</span>
          <span className="sla-number">{clientData.slaComparison.slaDays}</span>
        </div>
        <div className="sla-item">
          <span className="sla-label">Actual Days</span>
          <span className="sla-number">{clientData.slaComparison.actualDays}</span>
        </div>
      </div>
    </div>
  );
};

export default ClientOnboarding;
