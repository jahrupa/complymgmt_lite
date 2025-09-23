import React from 'react';
import '../../style/navigationTabs.css';

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ['Compliance Health', 'Open issues', 'SLA %', 'General Compliance'];

  return (
    <div className="navigation-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-button ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
      <button className="more-button">⋯</button>
    </div>
  );
};

export default NavigationTabs;