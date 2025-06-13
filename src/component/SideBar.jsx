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
import dashboard from '../assets/dashboard-4.png'
import add_user from '../assets/add-user-1.png'
import company from '../assets/company-1.png'
import group_of_company from '../assets/group_of_company-1.png'
import user_managnment from '../assets/user_managnment.png'
import access_control from '../assets/access_control.png'
import onboarding from '../assets/onboarding.png'
import outsourcing from '../assets/out_sourcing.jpeg'
import NextWeekOutlinedIcon from '@mui/icons-material/NextWeekOutlined';
import reimbursement from '../assets/reimbursement2.png'
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DomainAddOutlinedIcon from '@mui/icons-material/DomainAddOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import compliance from '../assets/compliance1.png'
import accesscontrol from '../assets/access-control.png'
import PayrollCompliance from '../assets/PayrollCompliance.png'
import AddModeratorOutlinedIcon from '@mui/icons-material/AddModeratorOutlined';
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import complyn_mgmt_logo from '../assets/complyn_mgmt_logo.png'
import DesktopAccessDisabledOutlinedIcon from '@mui/icons-material/DesktopAccessDisabledOutlined';
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import EditDocumentIcon from '@mui/icons-material/EditDocument';

function SideBar({ sidebarOpen, setSidebarOpen }) {
    const [activeItem, setActiveItem] = useState('Dashboard');

    const menuItems = [
        // { icon: <DashboardCustomizeIcon className="side-bar-icon sidebar-close-icon-active" />, label: 'Dashboard' },
        { icon: (active) => <DashboardCustomizeOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Dashboard' },

        { icon: (active) => <AssignmentIndOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Create User Role' },
        // { icon: <GroupAddIcon className={`${activeItem?'side-bar-icon-active ':'side-bar-icon'}`} />, label: 'Add User' },
        // { icon: <img src={add_user} alt="Add User" className={`${activeItem?'side-bar-icon-active ':'side-bar-icon'}`} />, label: 'Add User' },
        // { icon: <BusinessIcon className={`${activeItem?'side-bar-icon-active ':'side-bar-icon'}`} />, label: 'Group Of Holding' },
        { icon: (active) => <DomainAddOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Group Of Holding' },
        // { icon: <GroupIcon className={`${activeItem?'side-bar-icon-active ':'side-bar-icon'}`} />, label: 'Companies' },
        { icon: (active) => <ApartmentOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'company' },
        // { icon: <ManageAccountsIcon className={`${activeItem?'side-bar-icon-active ':'side-bar-icon'}`} />, label: 'User Management' },
        // { icon: <img src={user_managnment} alt="User Management" className={`${activeItem?'side-bar-icon-active ':'side-bar-icon'}`} />, label: 'User Management' },
        { icon: (active) => <TravelExploreOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Location' },
        { icon: (active) => <ViewModuleOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Module' },
        { icon: (active) => <ExtensionOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'SubModule' },
        { icon: (active) => <DesktopAccessDisabledOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Access Control' },
        { icon: (active) => <EmojiPeopleOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Onboarding' },
        { icon: (active) => <ReceiptLongOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Onbarding Compliance Scope' },
        { icon: (active) => <CurrencyRupeeOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Onbarding Payroll Compliance' },
        { icon: (active) => <NextWeekOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Outsourcing Scope' },
        { icon: (active) => <CurrencyExchangeOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Reimbursements' },
        { icon: (active) => <AccountBalanceWalletIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Payroll Management' },
        { icon: (active) => <TableRowsOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Service Trackers' },
        { icon: (active) => <AddModeratorOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Role Manager' },
        { icon: (active) => <EditDocumentIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Upload Document' },

    ];
    return (
        <div>

            <div className={`${sidebarOpen ? "sidebar sidebar-open" : "sidebar sidebar-close"}`}>
                <div>
                    <div className={`${sidebarOpen ? 'd-flex open-sidebar-wrap open-sidebar-logo-wrap ' : 'd-flex close-sidebar-logo-wrap'}`} style={{ alignItems: 'center', marginBottom: 29 }}>
                        <button className="openbtn btn btn-sm w-auto" onClick={() => setSidebarOpen(prev => !prev)} style={!sidebarOpen ? { marginLeft: '6px' } : undefined}

                        >
                            {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                        </button>
                        <img src={complyn_mgmt_logo} alt='logo' width={115} className={`${sidebarOpen ? 'mt-1 ' : 'mt-1 display-none'}`} />
                    </div>
                    <div style={{ paddingTop: 75 }}>
                        {menuItems.map(({ icon, label }, i) => {
                            const isActive = activeItem === label;
                            return (
                                <div key={i}>
                                    <Link
                                        to={`/${label.toLowerCase().replace(/\s+/g, '')}`}
                                        onClick={() => setActiveItem(label)}
                                    >
                                        <div
                                            className={`${sidebarOpen ? 'ms-2 mb-4 d-flex d-inline-block open-sidebar-wrap' : 'ms-2 mb-4 d-flex d-inline-block'}`}
                                            tabIndex="0"
                                            data-toggle="tooltip"
                                            title={label}
                                        >
                                            <span className={`sidebar-close-icon-span ${isActive ? 'side-bar-active-tab' : ''}`}>
                                                {icon(isActive)}
                                            </span>
                                            <span className={`${sidebarOpen ? 'ps-3 pe-2 side-bar-icon-text' : 'side-bar-close'}`}>
                                                {label}
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}

                    </div>

                </div>



            </div>
            <div id="main" style={{ marginLeft: sidebarOpen ? '250px' : '90px' }}>
                <Outlet />
            </div>
        </div>
    );
}


export default SideBar;
