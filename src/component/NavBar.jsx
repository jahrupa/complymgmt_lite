import React from 'react';
import '../style/navbar.css';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import UserProfile from './UserProfile';
// import logo from "../assets/complyn_mgmt_lite_logo.jpg"
import complyn_mgmt_logo from '../assets/complyn_mgmt_logo.png'

function NavBar({ setSidebarOpen, sidebarOpen }) {

    return (
        <div>
            <div className="navbar">
                <div className='d-flex' style={{ alignItems: 'center' }}>
                    <button className="openbtn btn btn-sm w-auto" onClick={() => setSidebarOpen(prev => !prev)}>
                        {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                    </button>
                    <img src={complyn_mgmt_logo} alt='logo' width={115} className='mt-1'/>
                </div>
                <div className='pe-4 ps-4'>
                    <UserProfile />
                </div>
            </div>

        </div>
    );
}

export default NavBar;
