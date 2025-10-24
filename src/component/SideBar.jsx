import React, { useState, } from 'react';
import '../style/sidebar.css';
import { Link, Outlet, } from 'react-router-dom';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import DomainAddOutlinedIcon from '@mui/icons-material/DomainAddOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import AddModeratorOutlinedIcon from '@mui/icons-material/AddModeratorOutlined';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import complyn_mgmt_logo from '../assets/complyn_mgmt_logo.png'
import DesktopAccessDisabledOutlinedIcon from '@mui/icons-material/DesktopAccessDisabledOutlined';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ScanEye } from 'lucide-react';

function SideBar({ sidebarOpen, setSidebarOpen , setActivePage, activePage}) {
    // const [activePage, setActivePage] = useState(() => {
    //     return localStorage.getItem('activeItem') || 'Dashboard';
    // });
    const [showServiceTrackerDropdown, setShowServiceTrackerDropdown] = useState(false);
    const menuItems = [
        { icon: (active) => <DashboardCustomizeOutlinedIcon className={`${active ? 'side-bar-icon-active' : 'side-bar-icon'}`} />, label: 'Dashboard', link: 'dashboard' },
        { icon: (active) => <AssignmentIndOutlinedIcon className={`${active ? 'side-bar-icon-active' : 'side-bar-icon'}`} />, label: 'Create User', link: 'create_user_role' },
        { icon: (active) => <DomainAddOutlinedIcon className={`${active ? 'side-bar-icon-active' : 'side-bar-icon'}`} />, label: 'Group/Holding', link: 'group_holding' },
        { icon: (active) => <ApartmentOutlinedIcon className={`${active ? 'side-bar-icon-active' : 'side-bar-icon'}`} />, label: 'company', link: 'company' },
        { icon: (active) => <TravelExploreOutlinedIcon className={`${active ? 'side-bar-icon-active' : 'side-bar-icon'}`} />, label: 'Location', link: 'location' },
        { icon: (active) => <ViewModuleOutlinedIcon className={`${active ? 'side-bar-icon-active' : 'side-bar-icon'}`} />, label: 'Module', link: 'module' },
        { icon: (active) => <ViewModuleOutlinedIcon className={`${active ? 'side-bar-icon-active' : 'side-bar-icon'}`} />, label: 'Location To Module', link: 'location_to_module' },
        { icon: (active) => <ExtensionOutlinedIcon className={`${active ? 'side-bar-icon-active' : 'side-bar-icon'}`} />, label: 'SubModule', link: 'sub_module' },
        { icon: (active) => <DesktopAccessDisabledOutlinedIcon className={`${active ? 'side-bar-icon-active' : 'side-bar-icon'}`} />, label: 'Access Control', link: 'access_control' },
        // { icon: (active) => <AddModeratorOutlinedIcon className={`${active ? 'side-bar-icon-active' : 'side-bar-icon'}`} />, label: 'Role Manager / Create User Role', link: 'role_manager' },
        { icon: (active) => <EditDocumentIcon className={`${active ? 'side-bar-icon-active' : 'side-bar-icon'}`} />, label: 'Upload Document', link: 'upload_documents' },
        // { icon: (active) => <SummarizeIcon className={`${active ? 'side-bar-icon-active' : 'side-bar-icon'}`} />, label: 'Document Repository', link: 'document_repository' },
    ];


    const serviceTracker = [
        { icon: (active) => <CheckBoxIcon className={`${active ? 'side-bar-icon-active' : 'side-bar-icon'}`} />, label: 'Trackers', link: 'service_trackers' },
        { icon: (active) => <ScanEye className={`${active ? 'side-bar-icon-active' : 'side-bar-icon'}`} />, label: 'Tracker Access', link: 'service_tracker_access' },
    ];

    // Sync active tab with URL on page load
    // useEffect(() => {
    //     const currentPath = location.pathname.split('/')[1];
    //     const allItems = [...menuItems, ...documentSubItems, ...serviceTracker];
    //     const match = allItems.find(item => item.link === currentPath);
    //     if (match) {
    //         setActivePage(match.label);
    //         localStorage.setItem('activeSidebarItem', match.label);
    //     }
    // }, [location.pathname]);

    // 2nd method
    // useEffect(() => {
    //     localStorage.setItem("activeItem", activeItem);  // ✅ save on every change
    //     localStorage.setItem('active_url',window.location.pathname)
    // }, [activeItem]);

    return (
        <div>
            <div className={`${sidebarOpen ? "sidebar sidebar-open" : "sidebar sidebar-close"}`}>
                <div>
                    <div className={`${sidebarOpen ? 'd-flex open-sidebar-wrap open-sidebar-logo-wrap' : 'd-flex close-sidebar-logo-wrap'}`} style={{ alignItems: 'center', marginBottom: 29 }}>
                        <button className="openbtn btn btn-sm w-auto" onClick={() => setSidebarOpen(prev => !prev)} style={!sidebarOpen ? { marginLeft: '6px' } : undefined}>
                            {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                        </button>
                        <img src={complyn_mgmt_logo} alt='logo' width={115} className={`${sidebarOpen ? 'mt-1 nav-open-logo' : 'mt-1 display-none'}`} />
                    </div>

                    <div style={{ paddingTop: 75 }}>
                        {menuItems.map(({ icon, label, link }, i) => {
                            const isActive = activePage === label;
                            return (
                                <div key={i}>
                                    <Link
                                        to={`/${link}`}
                                        onClick={() => {
                                            setActivePage(label);
                                            localStorage.setItem("activeItem", label);
                                            localStorage.setItem('active_url', link)
                                        }}
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

                        {/* Document Dropdown */}
                        <div className={`${sidebarOpen ? 'ms-2 mb-2 d-flex flex-column open-sidebar-wrap' : 'ms-2 mb-2 d-flex flex-column'}`}>
                            <div
                                className="d-flex align-items-center cursor-pointer mb-4"
                                onClick={() => setShowServiceTrackerDropdown?.(prev => !prev)}
                            >
                                <span className='sidebar-close-icon-span'>
                                    {showServiceTrackerDropdown ? <KeyboardArrowDownIcon className='side-bar-icon' /> : <KeyboardArrowRightIcon className='side-bar-icon' />}
                                </span>
                                <span className={`${sidebarOpen ? 'ps-3 pe-2 side-bar-icon-text' : 'side-bar-close'}`}>
                                    Service Tracker
                                </span>
                            </div>
                            {showServiceTrackerDropdown && (
                                <div className='pt-2'>
                                    {serviceTracker.map(({ icon, label, link }, i) => {
                                        const isActive = activePage === label;
                                        return (
                                            <div key={i}>
                                                <Link
                                                    to={`/${link}`}
                                                    onClick={() => {
                                                        setActivePage(label);
                                                        // localStorage.setItem('activeSidebarItem', label);
                                                        localStorage.setItem("activeItem", label);
                                                        localStorage.setItem('active_url', link)
                                                    }}
                                                >
                                                    <div
                                                        className='d-flex d-inline-block mb-4'
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
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <div id="main" style={{ marginLeft: sidebarOpen ? '250px' : '70px' }} className='mobile-page-layout'>
                <Outlet />
            </div>
        </div>
    );
}

export default SideBar;
