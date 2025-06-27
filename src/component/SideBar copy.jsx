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
import SummarizeIcon from '@mui/icons-material/Summarize';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
function SideBar({ sidebarOpen, setSidebarOpen }) {
    const [activeItem, setActiveItem] = useState('Dashboard');

    const menuItems = [
        // { icon: <DashboardCustomizeIcon className="side-bar-icon sidebar-close-icon-active" />, label: 'Dashboard' },
        { icon: (active) => <DashboardCustomizeOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Dashboard', link: 'dashboard' },

        { icon: (active) => <AssignmentIndOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Create User Role', link: 'create_user_role' },
        // { icon: <GroupAddIcon className={`${activeItem?'side-bar-icon-active ':'side-bar-icon'}`} />, label: 'Add User' },
        // { icon: <img src={add_user} alt="Add User" className={`${activeItem?'side-bar-icon-active ':'side-bar-icon'}`} />, label: 'Add User',link:'add_user' },
        // { icon: <BusinessIcon className={`${activeItem?'side-bar-icon-active ':'side-bar-icon'}`} />, label: 'Group Of Holding' },
        { icon: (active) => <DomainAddOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Group/Holding', link: 'group_holding' },
        // { icon: <GroupIcon className={`${activeItem?'side-bar-icon-active ':'side-bar-icon'}`} />, label: 'Companies' },
        { icon: (active) => <ApartmentOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'company', link: 'company' },
        // { icon: <ManageAccountsIcon className={`${activeItem?'side-bar-icon-active ':'side-bar-icon'}`} />, label: 'User Management' },
        // { icon: <img src={user_managnment} alt="User Management" className={`${activeItem?'side-bar-icon-active ':'side-bar-icon'}`} />, label: 'User Management',link:'user_management' },
        { icon: (active) => <TravelExploreOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Location', link: 'location' },
        { icon: (active) => <ViewModuleOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Module', link: 'module' },
        { icon: (active) => <ExtensionOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'SubModule', link: 'sub_module' },
        { icon: (active) => <DesktopAccessDisabledOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Access Control', link: 'access_control' },
        { icon: (active) => <EmojiPeopleOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Onboarding', link: 'onboarding' },
        { icon: (active) => <ReceiptLongOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Onbarding Compliance Scope', link: 'onbarding_compliance_scope' },
        { icon: (active) => <CurrencyRupeeOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Onbarding Payroll Compliance', link: 'onbarding_payroll_compliance' },
        { icon: (active) => <NextWeekOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Outsourcing Scope', link: 'outsourcing_scope' },
        { icon: (active) => <CurrencyExchangeOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Reimbursements', link: 'reimbursements' },
        { icon: (active) => <AccountBalanceWalletIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Payroll Management', link: 'payroll_management' },
        { icon: (active) => <TableRowsOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Service Trackers', link: 'service_trackers' },
        { icon: (active) => <AddModeratorOutlinedIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Role Manager', link: 'role_manager' },
        { icon: (active) => <EditDocumentIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Upload Document', link: 'upload_documents' },
        { icon: (active) => <SummarizeIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Document Repository', link: 'document_repository' },

    ];
    const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);

    const documentSubItems = [
        { icon: (active) => <EditDocumentIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Upload Document', link: 'upload_documents' },
        { icon: (active) => <SummarizeIcon className={`${active ? 'side-bar-icon-active ' : 'side-bar-icon'}`} />, label: 'Document Repository', link: 'document_repository' },
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
                        <img src={complyn_mgmt_logo} alt='logo' width={115} className={`${sidebarOpen ? 'mt-1 nav-open-logo' : 'mt-1 display-none'}`} />
                    </div>
                    <div style={{ paddingTop: 75 }}>
                        {menuItems.map(({ icon, label, link }, i) => {
                            const isActive = activeItem === label;
                            return (
                                <div key={i}>
                                    <Link
                                        to={`/${link}`}
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
                        <div className={`${sidebarOpen ? 'ms-2 mb-2 d-flex flex-column open-sidebar-wrap' : 'ms-2 mb-2 d-flex flex-column'}`}>
                            <div
                                className={`${sidebarOpen ? 'd-flex align-items-center cursor-pointer mb-4 menu-sidebar-content' : 'd-flex align-items-center cursor-pointer mb-4 '}`}
                                onClick={() => setShowDocumentDropdown(!showDocumentDropdown)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className='sidebar-close-icon-span'>
                                    {showDocumentDropdown ? <KeyboardArrowDownIcon className='side-bar-icon' /> : <KeyboardArrowRightIcon className='side-bar-icon' />}

                                </span>
                                <span className={`${sidebarOpen ? 'ps-3 pe-2 side-bar-icon-text' : 'side-bar-close'}`}>
                                    Document Records
                                </span>

                            </div>

                            {showDocumentDropdown && (
                                <div className='pt-2'>
                                    {documentSubItems.map(({ icon, label, link }, i) => {
                                        const isActive = activeItem === label;
                                        return (
                                            <div key={i}>
                                                <Link
                                                    to={`/${link}`}
                                                    onClick={() => setActiveItem(label)}
                                                    className='d-flex d-inline-block mb-4'
                                                >
                                                    {/* <div
                                                        className={`${sidebarOpen ? 'ms-2 mb-4 d-flex d-inline-block open-sidebar-wrap' : 'ms-2 mb-4 d-flex d-inline-block'}`}
                                                        tabIndex="0"
                                                        data-toggle="tooltip"
                                                        title={label}
                                                    > */}
                                                    <span className={`sidebar-close-icon-span ${isActive ? 'side-bar-active-tab' : ''}`}>
                                                        {icon(isActive)}
                                                    </span>
                                                    <span className={`${sidebarOpen ? 'ps-3 pe-2 side-bar-icon-text' : 'side-bar-close'}`}>
                                                        {label}
                                                    </span>
                                                    {/* </div> */}
                                                </Link>
                                            </div>

                                        );
                                    })}
                                </div>
                            )}
                        </div>

                    </div>

                </div>



            </div>
            <div id="main" style={{ marginLeft: sidebarOpen ? '250px' : '90px' }} className='mobile-page-layout'>
                <Outlet />
            </div>
        </div>
    );
}


export default SideBar;
