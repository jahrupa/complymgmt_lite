import React, { useState } from 'react'
import NotificationPage from './NotificationPage'
import CreateNotificationTemplate from '../../page/CreateNotificationTemplate'
import NotificationList from '../../page/NotificationList'
import CreateNotification from '../../page/CreateNotification'
import '../../style/notification.css';
import { useNavigate } from 'react-router-dom';

const NotificationMainPage = ({ setUnreadCountNotification }) => {
    const navItems = [
        { id: "notification", label: "Incoming Notification" },
        { id: "create_notification_template", label: "Create Notification Template" },
        { id: "template_list", label: "Template List" },
        { id: "create_notification", label: "Create Notification" }
    ];
    const [currentPage, setCurrentPage] = useState('notification');
    const navigate = useNavigate();
    const handleNavigate = (page) => {
        setCurrentPage(page);
        {page === 'notification' ? navigate('/notification') :  navigate(`/notification/${page}`)}
    };
    return (
        <div>
            {currentPage === 'notification' && <NotificationPage setUnreadCountNotification={setUnreadCountNotification} />}
            {currentPage === 'create_notification_template' && <CreateNotificationTemplate setCurrentPage={setCurrentPage} />}
            {currentPage === 'template_list' && <NotificationList setCurrentPage={setCurrentPage} />}
            {currentPage === 'create_notification' && <CreateNotification setCurrentPage={setCurrentPage} />}
            <div className="navigation-wrapper">
                <div className="navigation">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigate(item.id)}
                            className={`nav-button ${currentPage === item.id ? 'active' : ''}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NotificationMainPage