import React, { useState } from 'react'
import SideBar from '../component/SideBar'
import NavBar from '../component/NavBar'
import NotificationPage from '../component/notification/NotificationPage';

const PageLayout = ({sidebarOpen,setSidebarOpen,unreadCountNotification}) => {
     const [showNotifications, setShowNotifications] = useState(false);
     if (showNotifications) {
    return <NotificationPage onBack={() => setShowNotifications(false)} />;
  }
  return (
    <div>
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <NavBar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} unreadCountNotification={unreadCountNotification} />
    </div>
  )
}

export default PageLayout