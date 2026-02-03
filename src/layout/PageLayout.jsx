import React, { useEffect, useState } from 'react'
import SideBar from '../component/SideBar'
import NavBar from '../component/NavBar'
import NotificationPage from '../component/notification/NotificationPage';
import { getInAppNotification } from '../api/service';
import { decryptData } from '../page/utils/encrypt';

const PageLayout = ({
  sidebarOpen,
  setSidebarOpen,
  unreadCountNotification,
  setUnreadCountNotification,
  setActivePage,
  activePage
}) => {
     const [showNotifications, setShowNotifications] = useState(false);
     const SystemUserId = decryptData(localStorage.getItem("user_id"));
      useEffect(() => {
         const fetchNotifications = async () => {
           try {
             const response = await getInAppNotification(SystemUserId || "");
             setUnreadCountNotification(response?.length || 0);
           } catch {
             // handle error silently
           }
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