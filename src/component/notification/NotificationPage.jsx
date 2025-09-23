import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Bell,
  Check,
  AlertCircle,
  Info,
  AlertTriangle,
  Clock,
  Search,
  MoreVertical,
  Trash2,
  CheckCircle
} from 'lucide-react';
import '../../style/notification.css';
import MonthYearCalander from '../MonthYearCalander';
import { useNavigate } from 'react-router-dom';
import { getInAppNotification, readNotificationById, deleteInAppNotificationById, readAllInAppNotification, deleteAllInAppNotification } from '../../api/service.jsx';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const NotificationPage = ({ onBack }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('show');
  const [openMenuId, setOpenMenuId] = useState(null); // single open menu
  const menuRefs = useRef({});
  const navigate = useNavigate();

  // Toggle menu for a notification
  const toggleMenu = (id) => {
    setOpenMenuId(prev => (prev === id ? null : id));
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!openMenuId) return;
      const el = menuRefs.current[openMenuId];
      if (el && !el.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'success': return Check;
      case 'warning': return AlertTriangle;
      case 'error': return AlertCircle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getIconColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  const unreadCount = allNotifications.filter(n => n.unread).length;

  const filteredNotifications = allNotifications.filter(notification => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && notification.unread) ||
      (filter === 'read' && !notification.unread) ||
      notification.type?.toLowerCase() === filter;

    const matchesSearch =
      notification.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.body?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      notification.type?.toLowerCase()?.includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleNavigate = (page) => {
    setCurrentPage(page);
    navigate(page === 'show' ? '/notifications_list' : '/create_notification_template');
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getInAppNotification(localStorage.getItem("user_id") || "");
        setAllNotifications(response || []);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = (id) => {
    try {
      result = readNotificationById(id);
      setAllNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, is_read: true, unread: false } : n)
      );
      setOpenMenuId(null); // close menu after action
    } catch (error) {
      console.log("Failed to read the notification", error);
    }
  };

  const handleClearNotification = (id) => {
    result = deleteInAppNotificationById(id)
    setAllNotifications(prev => prev.filter(n => n._id !== id));
    setOpenMenuId(null); // close menu after action
  };

  const handleMarkAllAsRead = async () => {
    try {
     result = readAllInAppNotification(localStorage.getItem("user_id") || "");
      setAllNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, is_read: true, unread: false } : n)
      );
      setOpenMenuId(null); // close menu after action
    } catch (error) {
      console.log("Failed to read the notification", error);
    }
  }

  const handleDeleteAll = async () => {
    try {
     result = deleteAllInAppNotification(localStorage.getItem("user_id") || "");
      setAllNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, is_read: true, unread: false } : n)
      );
      setOpenMenuId(null); // close menu after action
    } catch (error) {
      console.log("Failed to read the notification", error);
    }
  }

  return (
    <div className="notification-page">
      {/* Header */}
      <div className="notification-page-header">
        <div className="notification-page-title">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Incoming Notifications</h1>
            <p>{unreadCount} unread notifications</p>
          </div>
        </div>

        <div className="notification-actions">
          <button className="action-btn secondary" onClick={() => navigate('/create_notification_template')}>
            <CheckCircle size={18} />
            Create Notification
          </button>
          <button className="action-btn secondary" onClick={handleMarkAllAsRead} >
            <CheckCircle size={18} />
            Mark All Read
          </button>
          <button className="action-btn secondary" onClick={handleDeleteAll}>
            <Trash2 size={18} />
            Clear All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="notification-filters">
        <div className="d-flex filter-search justify-content-between">
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
            { key: 'success', label: 'Success', count: allNotifications.filter(n => n.type?.toLowerCase() === 'success').length },
            { key: 'warning', label: 'Warning', count: allNotifications.filter(n => n.type?.toLowerCase() === 'warning').length },
            { key: 'error', label: 'Error', count: allNotifications.filter(n => n.type?.toLowerCase() === 'error').length },
            { key: 'info', label: 'Info', count: allNotifications.filter(n => n.type?.toLowerCase() === 'info').length }
          ].map(tab => {
            const tabKey = tab.key.toLowerCase();
            const isActive = filter === tabKey;
            return (
              <button
                key={tab.key}
                className={`filter-tab ${isActive ? 'active' : ''}`}
                onClick={() => setFilter(tabKey)}
              >
                {tab.label}
                <span className="filter-count">{tab.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification List */}
      <div className="notification-list">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : filteredNotifications.length === 0 ? (
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
                key={notification._id}
                className={`notification-card ${!notification.is_read ? 'unread' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="notification-card-content">
                  <div className={`notification-card-icon ${getIconColor(notification.type)}`}>
                    <Icon size={20} />
                  </div>

                  <div className="notification-card-body">
                    <div className="notification-card-header">
                      <h4 className="notification-card-title">{notification.subject}</h4>
                      <span className={`notification-category ${notification.type}`}>
                        {notification.priority}
                      </span>
                    </div>

                    <p className="notification-card-message">{notification.body}</p>

                    <div className="notification-card-meta">
                      <div className="notification-card-time">
                        <Clock size={14} />
                        <span>{dayjs(notification.created_at).fromNow()}</span>
                        <span className="timestamp">({notification.created_at})</span>
                      </div>
                      {!notification?.is_read && <div className="unread-indicator">New</div>}
                    </div>
                  </div>

                  {/* Action Menu */}
                  <div
                    className="notification-card-actions"
                    style={{ position: 'relative' }}
                    ref={el => menuRefs.current[notification._id] = el}
                  >
                    <button
                      className="action-button"
                      onClick={() => toggleMenu(notification._id)}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openMenuId === notification._id && (
                      <div className="notification-menu">
                        {!notification.is_read && (
                          <button onClick={() => handleMarkAsRead(notification._id)}>
                            Read
                          </button>
                        )}
                        <button onClick={() => handleClearNotification(notification._id)}>
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Navigation */}
      <div className="navigation">
        <button
          onClick={() => handleNavigate('show')}
          className={`nav-button ${currentPage === 'show' ? 'active' : ''}`}
        >
          Created Notifications
        </button>
        <button
          onClick={() => handleNavigate('create')}
          className={`nav-button ${currentPage === 'create' ? 'active' : ''}`}
        >
          Create New
        </button>
      </div>
    </div>
  );
};

export default NotificationPage;
