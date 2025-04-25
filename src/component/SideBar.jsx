import React, { useState } from 'react';
import '../style/sidebar.css';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import { Link, Outlet } from 'react-router-dom';
function SideBar({ sidebarOpen }) {
    const menuItems = [
        { icon: <DashboardCustomizeIcon className="side-bar-icon sidebar-close-icon-active" />, label: 'Dashboard' },
        { icon: <GroupAddIcon className="side-bar-icon" />, label: 'User Roles' },
        { icon: <GroupIcon className="side-bar-icon" />, label: 'Group Onboarding' },
        { icon: <BusinessIcon className="side-bar-icon" />, label: 'Group Of Companies' },
        { icon: <ManageAccountsIcon className="side-bar-icon" />, label: 'User Management' },
    ];
    return (
        <div>
            <div className={`${sidebarOpen ? "sidebar sidebar-open" : "sidebar sidebar-close"}`}>
                {menuItems.map(({ icon, label }, i) => (
                    <Link to={`/${label.toLowerCase().replace(/\s+/g, '')}`} key={i}>
                        <div className="ps-3 pe-3 mb-4 d-flex d-inline-block" tabindex="0" data-toggle="tooltip" title= {label}>

                            <span className="sidebar-close-icon-span">{icon}</span>
                            <span className={`${sidebarOpen ? 'ps-3 pe-2 side-bar-icon-text' : 'side-bar-close'}`}>
                                {label}
                            </span>


                        </div>
                    </Link>
                ))}
            </div>
            <div id="main" style={{ marginLeft: sidebarOpen ? '250px' : '90px' }}>
                <Outlet />
            </div>
        </div>
    );
}


export default SideBar;
