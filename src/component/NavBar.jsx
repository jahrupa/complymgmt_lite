import React from 'react';
import '../style/navbar.css';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import UserProfile from './UserProfile';
function NavBar({ setSidebarOpen, sidebarOpen }) {

    return (
        <div>
            <div className="navbar">
                <div className='d-flex'>
                    <button className="openbtn" onClick={() => setSidebarOpen(prev => !prev)}>
                        {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                    </button>
                    <div className='d-flex'>
                        <div className='nav-bar-logo-name'>Weprocess</div>
                    </div>
                </div>
                <div className='pe-4 ps-4'>
                    <UserProfile />
                </div>
            </div>

        </div>
    );
}

export default NavBar;
