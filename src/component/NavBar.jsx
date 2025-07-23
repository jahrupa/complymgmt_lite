import React from 'react';
import '../style/navbar.css';
import '../style/notification.css';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import UserProfile from './UserProfile';
// import logo from "../assets/complyn_mgmt_lite_logo.jpg"
import complyn_mgmt_logo from '../assets/complyn_mgmt_logo.png'
import { Bell } from 'lucide-react';
import NotificationDropdown from './notification/NotificationDropdown';
import { useNavigate } from 'react-router-dom';
function NavBar({ setSidebarOpen, sidebarOpen, onMenuClick, onNotificationClick }) {
     const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = React.useState(true);
    const notifications = [
        {
            id: 1,
            type: 'success',
            title: 'Payment Received',
            message: 'Your payment of $299 has been processed successfully',
            time: '2 min ago',
            unread: true
        },
        {
            id: 2,
            type: 'warning',
            title: 'Server Maintenance',
            message: 'Scheduled maintenance will begin at 2:00 AM',
            time: '15 min ago',
            unread: true
        },
        {
            id: 3,
            type: 'info',
            title: 'New Feature Available',
            message: 'Check out our new dashboard analytics',
            time: '1 hour ago',
            unread: false
        },
        {
            id: 4,
            type: 'error',
            title: 'Failed Login Attempt',
            message: 'Someone tried to access your account',
            time: '2 hours ago',
            unread: true
        },
        {
            id: 5,
            type: 'error',
            title: 'Failed Login Attempt',
            message: 'Someone tried to access your account',
            time: '2 hours ago',
            unread: true
        },
        
    ];

    const unreadCount = notifications.filter(n => n.unread).length;
    return (
        <div>
            <div className="navbar">
                <div className='nav-desk-mobile-view'>
                    <button className="nav-openbtn btn btn-sm w-auto" onClick={() => setSidebarOpen(prev => !prev)}>
                        {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                    </button>
                    <img src={complyn_mgmt_logo} alt='logo' width={115} className='mt-1 nav-logo' />
                </div>

                <div className='pe-4 ps-4 d-flex'>
                    <div className="notification-container">
                        <button
                            className="notification-button"
                            onMouseEnter={() => setShowNotifications(true)}
                            onMouseLeave={() => setShowNotifications(false)}
                            onClick={() => navigate('/notification')}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="notification-badge">{unreadCount}</span>
                            )}
                        </button>

                        {/* <NotificationDropdown
                            notifications={notifications}
                            isVisible={showNotifications}
                            onMouseEnter={() => setShowNotifications(true)}
                            onMouseLeave={() => setShowNotifications(false)}
                            onViewAll={() => onNotificationClick && onNotificationClick()}
                        /> */}
                    </div>
                    <UserProfile />
                </div>
            </div>

        </div>

    );
}

export default NavBar;
