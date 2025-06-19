import React from 'react';
import '../style/toggle.css';

const Toggle = ({ checked, onChange }) => {
    return (
        <div style={{marginTop:12}}>
            <label className="switch">
                <input type="checkbox" checked={checked} onChange={onChange} />
                <span className={`${checked?'slider  round':'slider-in-active round'}`}></span>
            </label>
        </div>

    );
};

export default Toggle;
