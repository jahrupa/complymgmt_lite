import React from 'react';
import { Bell, Check, AlertCircle, Info, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import '../../style/notification.css'
const NotificationDropdown = ({ notifications, isVisible, onMouseEnter, onMouseLeave, onViewAll }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success': return Check;
      case 'warning': return AlertTriangle;
      case 'error': return AlertCircle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  return (
    <div 
      className={`notification-dropdown ${isVisible ? 'show' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="notification-dropdown-header">
        <h6>Notifications</h6>
        <span className="notification-count">{notifications.filter(n => n.unread).length} new</span>
      </div>
      
      <div className="notification-dropdown-body">
        {notifications.slice(0, 4).map((notification, index) => {
          const Icon = getIcon(notification.type);
          return (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.unread ? 'unread' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`notification-icon ${getIconColor(notification.type)}`}>
                <Icon size={16} />
              </div>
              <div className="notification-content">
                <h6 className="notification-title">{notification.title}</h6>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-time">
                  <Clock size={12} />
                  <span>{notification.time}</span>
                </div>
              </div>
              {notification.unread && <div className="notification-dot"></div>}
            </div>
          );
        })}
      </div>
      
      <div className="notification-dropdown-footer">
        <button className="view-all-btn" onClick={onViewAll}>
          <span>View All Notifications</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;