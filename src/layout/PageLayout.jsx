import React, { useEffect, useState } from 'react'
import SideBar from '../component/SideBar'
import NavBar from '../component/NavBar'
import NotificationPage from '../component/notification/NotificationPage';
import { getInAppNotification } from '../api/service';

const PageLayout = ({
  sidebarOpen,
  setSidebarOpen,
  unreadCountNotification,
  setUnreadCountNotification,
  setActivePage,
  activePage
}) => {
     const [showNotifications, setShowNotifications] = useState(false);
      useEffect(() => {
         const fetchNotifications = async () => {
           try {
             const response = await getInAppNotification(localStorage.getItem("user_id") || "");
             setUnreadCountNotification(response?.length || 0);
           } catch (err) {
             console.error("Error fetching notifications:", err);} 
         };
         fetchNotifications();
       }, []);
     if (showNotifications) {
    return <NotificationPage onBack={() => setShowNotifications(false)} />;
  }
  return (
    <div>
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setActivePage={setActivePage} activePage={activePage} />
        <NavBar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} unreadCountNotification={unreadCountNotification} setActivePage={setActivePage} activePage={activePage} />
    </div>
  )
}

export default PageLayout