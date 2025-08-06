import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Check,
  AlertCircle,
  Info,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Eye,
  CheckCircle
} from 'lucide-react';
import '../../style/notification.css'
import MonthYearCalander from '../MonthYearCalander';
import { useNavigate } from 'react-router-dom';
import { AnimatedSearchBar } from '../AnimatedSearchBar';

const NotificationPage = ({ onBack }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const allNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Payment Received',
      message: 'Your payment of $299 has been processed successfully. Transaction ID: TXN123456789',
      time: '2 min ago',
      timestamp: '2024-01-15 14:30',
      unread: true,
      category: 'Payment'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Server Maintenance Scheduled',
      message: 'Scheduled maintenance will begin at 2:00 AM EST. Expected downtime: 2 hours',
      time: '15 min ago',
      timestamp: '2024-01-15 14:15',
      unread: true,
      category: 'System'
    },
    {
      id: 3,
      type: 'info',
      title: 'New Feature Available',
      message: 'Check out our new dashboard analytics with advanced reporting capabilities',
      time: '1 hour ago',
      timestamp: '2024-01-15 13:30',
      unread: false,
      category: 'Feature'
    },
    {
      id: 4,
      type: 'error',
      title: 'Failed Login Attempt',
      message: 'Someone tried to access your account from IP: 192.168.1.100',
      time: '2 hours ago',
      timestamp: '2024-01-15 12:30',
      unread: true,
      category: 'Security'
    },
    {
      id: 5,
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated',
      time: '3 hours ago',
      timestamp: '2024-01-15 11:30',
      unread: false,
      category: 'Account'
    },
    {
      id: 6,
      type: 'info',
      title: 'Weekly Report Ready',
      message: 'Your weekly analytics report is now available for download',
      time: '1 day ago',
      timestamp: '2024-01-14 14:30',
      unread: false,
      category: 'Report'
    },
    {
      id: 7,
      type: 'warning',
      title: 'Storage Almost Full',
      message: 'Your storage is 85% full. Consider upgrading your plan',
      time: '2 days ago',
      timestamp: '2024-01-13 14:30',
      unread: false,
      category: 'Storage'
    },
    {
      id: 8,
      type: 'success',
      title: 'Backup Completed',
      message: 'Your data backup has been completed successfully',
      time: '3 days ago',
      timestamp: '2024-01-12 14:30',
      unread: false,
      category: 'System'
    }
  ];

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

  const filteredNotifications = allNotifications.filter(notification => {
    const matchesFilter = filter === 'all' ||
      (filter === 'unread' && notification.unread) ||
      (filter === 'read' && !notification.unread) ||
      notification.type === filter;

    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = allNotifications.filter(n => n.unread).length;

  return (
    <div className="notification-page">
      <div className="notification-page-header">
        <div className="notification-page-title">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Notifications</h1>
            <p>{unreadCount} unread notifications</p>
          </div>
        </div>

        <div className="notification-actions">
          <button className="action-btn secondary" onClick={() => navigate('/create_notification')}>
            <CheckCircle size={18} />
            Create Notifaction
          </button>
          <button className="action-btn secondary">
            <CheckCircle size={18} />
            Mark All Read
          </button>
          <button className="action-btn secondary">
            <Trash2 size={18} />
            Clear All
          </button>
        </div>
      </div>

      <div className="notification-filters">
        <div className="d-flex filter-search justify-content-between">
          {/* <AnimatedSearchBar/> */}
          <div className="notification-search-container">
            <Search className="notification-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="notification-search-input"
            />
          </div>
          <div>
            <MonthYearCalander />
          </div>
        </div>

        <div className="filter-tabs">
          {[
            { key: 'all', label: 'All', count: allNotifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'success', label: 'Success', count: allNotifications.filter(n => n.type === 'success').length },
            { key: 'warning', label: 'Warning', count: allNotifications.filter(n => n.type === 'warning').length },
            { key: 'error', label: 'Error', count: allNotifications.filter(n => n.type === 'error').length },
            { key: 'info', label: 'Info', count: allNotifications.filter(n => n.type === 'info').length }
          ].map(tab => (
            <button
              key={tab.key}
              className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
              <span className="filter-count">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="notification-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <h3>No notifications found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => {
            const Icon = getIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`notification-card ${notification.unread ? 'unread' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="notification-card-content">
                  <div className={`notification-card-icon ${getIconColor(notification.type)}`}>
                    <Icon size={20} />
                  </div>

                  <div className="notification-card-body">
                    <div className="notification-card-header">
                      <h4 className="notification-card-title">{notification.title}</h4>
                      <span className={`notification-category ${notification.type}`}>
                        {notification.category}
                      </span>
                    </div>

                    <p className="notification-card-message">{notification.message}</p>

                    <div className="notification-card-meta">
                      <div className="notification-card-time">
                        <Clock size={14} />
                        <span>{notification.time}</span>
                        <span className="timestamp">({notification.timestamp})</span>
                      </div>
                      {notification.unread && <div className="unread-indicator">New</div>}
                    </div>
                  </div>

                  <div className="notification-card-actions">
                    <button className="action-button">
                      <Eye size={16} />
                    </button>
                    <button className="action-button">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationPage;