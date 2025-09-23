import React from 'react';
import '../../style/generalCompliance.css';

const GeneralCompliance = () => {
  const complianceItems = [
    { icon: '≡', label: 'Registers', value: '10', status: 'normal' },
    { icon: '±', label: 'Licenses', value: '4', status: 'normal' },
    { icon: '▦', label: 'Returns', value: '', status: 'progress' },
    { icon: '△', label: 'Training', value: 'Expiring', status: 'warning' },
  ];

  return (
    <div className="general-compliance">
      <h2>General Compliance</h2>
      
      <div className="compliance-items">
        {complianceItems.map((item, index) => (
          <div key={index} className={`compliance-item ${item.status}`}>
            <div className="compliance-icon">{item.icon}</div>
            <span className="compliance-label">{item.label}</span>
            <span className="compliance-value">{item.value}</span>
            {item.status === 'progress' && (
              <div className="progress-indicator">
                <div className="progress-bar-small">
                  <div className="progress-fill-small" style={{width: '75%'}}></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralCompliance;