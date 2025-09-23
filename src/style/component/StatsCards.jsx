import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import '../style/statsCards.css'
const StatsCards = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'New Users',
      value: '2,234',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Orders',
      value: '1,234',
      change: '-2.5%',
      trend: 'down',
      icon: ShoppingCart,
      color: 'orange'
    },
    {
      title: 'Active Users',
      value: '573',
      change: '+8.2%',
      trend: 'up',
      icon: Activity,
      color: 'purple'
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="stat-card"
          style={{ 
            animationDelay: `${index * 0.1}s` 
          }}
        >
          <div className="stat-card-content">
            <div className="stat-info">
              <h6>{stat.title}</h6>
              <h2 className="stat-value">{stat.value}</h2>
            </div>
            <div className={`stat-icon ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
          
          <div className="stat-trend">
            {stat.trend === 'up' ? (
              <TrendingUp size={16} className="trend-icon" />
            ) : (
              <TrendingDown size={16} className="trend-icon" />
            )}
            <span className={`trend-value ${stat.trend === 'up' ? 'positive' : 'negative'}`}>
              {stat.change}
            </span>
            <span className="trend-text">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;