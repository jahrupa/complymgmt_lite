import React from 'react'
import '../style/toggle.css'
const Toggle = () => {
    return (
        <div>
            <label class="switch">
                <input type="checkbox" checked disabled />
                <span class="slider round"></span>
            </label>
        </div>
    )
}

export default Toggle