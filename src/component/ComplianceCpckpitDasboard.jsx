import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';
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