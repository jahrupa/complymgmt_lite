import React from "react";

// Complied / Non-complied from computed.is_complied, plus Overdue when computed.overdue
const StatusBadges = ({ computed }) => {
    if (!computed) return null;
    return (
        <span className="d-inline-flex gap-1 align-items-center">
            {computed.is_complied ? (
                <span className="challan-badge complied">Complied</span>
            ) : (
                <span className="challan-badge non-complied">Non-complied</span>
            )}
            {computed.overdue && <span className="challan-badge overdue">Overdue</span>}
        </span>
    );
};

export default StatusBadges;
