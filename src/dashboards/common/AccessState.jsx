import React from "react";

// Company-wise mode: 403 = no access to the company, 404 = company not found
const AccessState = ({ status, companyName, dataLabel, onShowAll }) => (
    <div className="chart-card">
        <div className="dw-state-message">
            <h5>{status === 403 ? "No access to this company" : "Company not found"}</h5>
            <div>
                {status === 403
                    ? `You don't have access to ${dataLabel} for "${companyName}".`
                    : `No company named "${companyName}" was found.`}
            </div>
            <button className="btn btn-primary btn-sm mt-2" onClick={onShowAll}>
                View all companies
            </button>
        </div>
    </div>
);

export default AccessState;
