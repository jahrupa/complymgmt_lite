// import React, { useEffect, useState } from 'react';
import '../style/navbar.css';
import '../style/notification.css';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import UserProfile from './UserProfile';
import complyn_mgmt_logo from '../assets/complyn_mgmt_logo.png'  // useEffect(() => {
//   const fetchNotifications = async () => {
//     try {
//       const response = await getInAppNotification(localStorage.getItem("user_id") || "");
//       if (response) {
//         const unread = response.filter(n => !n.is_read).length;
//         setUnreadCount(unread);
//       }
//     } catch (error) {
//       console.error("Failed to fetch notifications", error);
//     }
//   };
//   fetchNotifications();
// }, []);
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { getInAppNotification } from '../api/service.jsx';

function NavBar({ setSidebarOpen, sidebarOpen, unreadCountNotification, setActivePage }) {
  const navigate = useNavigate();
  // const [unreadCount, setUnreadCount] = useState(0);

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const response = await getInAppNotification(localStorage.getItem("user_id") || "");
  //       if (response) {
  //         const unread = response.filter(n => !n.is_read).length;
  //         setUnreadCount(unread);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch notifications", error);
  //     }
  //   };
  //   fetchNotifications();
  // }, []);

  return (
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
            onClick={() => {
              navigate('/notification');
              setActivePage('Notification');
              localStorage.setItem("activeItem", 'Notification');
              localStorage.setItem('active_url', '/notification')
            }}
          >
            <Bell size={20} />
            <span className="notification-badge">{unreadCountNotification}</span>
          </button>
        </div>
        <UserProfile />
      </div>
    </div>
  );
}

export default NavBar;
