import React from 'react';
import '../style/toggle.css';

const Toggle = ({ checked, onChange, marginTop, disabled }) => {
    return (
        <div style={{ marginTop: marginTop ? marginTop : 12, opacity: disabled ? 0.5 : 1 }}>
            <label className="switch" style={disabled ? { cursor: 'not-allowed' } : undefined}>
                <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
                <span className={`${checked ? 'slider  round' : 'slider-in-active round'}`}></span>
            </label>
        </div>

    );
};

export default Toggle;
