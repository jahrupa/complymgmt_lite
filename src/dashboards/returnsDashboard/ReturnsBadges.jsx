import React from "react";
import { COVERAGE_STATUSES } from "./returnsUtils";

// Filing: Filed on time / Filed late / Not filed / Overdue; plus Non-compliant, At risk, Escalated
export const ReturnBadges = ({ computed }) => {
    if (!computed) return null;
    if (computed.sheet === "applicability") {
        return computed.is_applicable ? (
            <span className="dw-badge complied">Applicable</span>
        ) : (
            <span className="dw-badge pending">Not applicable</span>
        );
    }
    if (computed.sheet === "master") return null;

    let filing;
    if (computed.overdue) filing = <span className="dw-badge overdue">Overdue</span>;
    else if (!computed.is_filed) filing = <span className="dw-badge pending">Not filed</span>;
    else if (computed.on_time === false) filing = <span className="dw-badge overdue">Filed late</span>;
    else filing = <span className="dw-badge complied">Filed on time</span>;

    return (
        <span className="d-inline-flex gap-1 align-items-center">
            {filing}
            {computed.status === "non_compliant" && <span className="dw-badge non-complied">Non-compliant</span>}
            {computed.status === "partial" && <span className="dw-badge overdue">Partially compliant</span>}
            {(computed.compliance_risk || computed.fine_risk) && <span className="dw-badge exception">At risk</span>}
            {computed.escalation && <span className="dw-badge exception">Escalated</span>}
        </span>
    );
};

export const CoverageStatusBadge = ({ status }) => {
    const s = COVERAGE_STATUSES[status];
    return s ? <span className={`dw-badge ${s.badge}`}>{s.label}</span> : null;
};
