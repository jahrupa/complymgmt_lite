import React from 'react'
import SideBar from '../component/SideBar'
import NavBar from '../component/NavBar'

const PageLayout = ({sidebarOpen,setSidebarOpen}) => {
  return (
    <div>
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <NavBar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen}/>
    </div>
  )
}

export default PageLayout