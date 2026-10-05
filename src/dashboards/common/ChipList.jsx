import React from "react";

// One-line chips for fixed-height grid rows; the full list is in the title tooltip
const ChipList = ({ value, className }) => (
    <div className="d-flex gap-1 align-items-center h-100 overflow-hidden" title={(value || []).join("\n")}>
        {(value || []).map((text) => (
            <span key={text} className={`dw-badge ${className}`} style={{ whiteSpace: "nowrap" }}>
                {text}
            </span>
        ))}
    </div>
);

export default ChipList;
