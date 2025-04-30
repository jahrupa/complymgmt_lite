import React, { useState } from 'react';
import '../style/sidebar.css';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import { Link, Outlet } from 'react-router-dom';
import location from '../assets/location.png'
import module_icon from '../assets/module.png'
import sub_module from '../assets/sub-module.png'
import user_role from '../assets/user-role.png'
import dashboard from '../assets/dashboard-3.png'
import add_user from '../assets/add-user.png'
import company from '../assets/company-1.png'
import group_of_company from '../assets/group_of_company-1.png'
import user_managnment from '../assets/user_managnment.png'






function SideBar({ sidebarOpen }) {
    const [activeItem, setActiveItem] = useState('Dashboard');

    const menuItems = [
        // { icon: <DashboardCustomizeIcon className="side-bar-icon sidebar-close-icon-active" />, label: 'Dashboard' },
        { icon: <img src={dashboard} alt="Dashboard" className="side-bar-icon" />, label: 'Dashboard' },

        { icon: <img src={user_role} alt="Create User Role" className="side-bar-icon" />, label: 'Create User Role' },
        // { icon: <GroupAddIcon className="side-bar-icon" />, label: 'Add User' },
        { icon: <img src={add_user} alt="Add User" className="side-bar-icon" />, label: 'Add User' },
        // { icon: <BusinessIcon className="side-bar-icon" />, label: 'Group Of Holding' },
        { icon: <img src={group_of_company} alt="Group Of Holding" className="side-bar-icon" />, label: 'Group Of Holding' },
        // { icon: <GroupIcon className="side-bar-icon" />, label: 'Companies' },
        { icon: <img src={company} alt="company" className="side-bar-icon" />, label: 'company' },
        // { icon: <ManageAccountsIcon className="side-bar-icon" />, label: 'User Management' },
        { icon: <img src={user_managnment} alt="User Management" className="side-bar-icon" />, label: 'User Management' },
        { icon: <img src={location} alt="Location" className="side-bar-icon" />, label: 'Location' },
        { icon: <img src={module_icon} alt="Module" className="side-bar-icon" />, label: 'Module' },
        { icon: <img src={sub_module} alt="SubModule" className="side-bar-icon" />, label: 'SubModule' },

    ];
    return (
        <div>
            <div className={`${sidebarOpen ? "sidebar sidebar-open" : "sidebar sidebar-close"}`}>
            {menuItems.map(({ icon, label }, i) => (
    <Link 
        to={`/${label.toLowerCase().replace(/\s+/g, '')}`} 
        key={i}
        onClick={() => setActiveItem(label)}
    >
        <div 
            className="justify-content-center mb-4 d-flex d-inline-block" 
            tabIndex="0" 
            data-toggle="tooltip" 
            title={label}
        >
            <span className={`sidebar-close-icon-span ${activeItem === label ? 'side-bar-active-tab' : ''}`}>
                {icon}
            </span>
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
