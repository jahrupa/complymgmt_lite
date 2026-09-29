import React from "react";
import { COVERAGE_STATUSES } from "./registerUtils";

// Execution row badges: Completed / Pending, Overdue, Variance open, SLA missed
export const ExecutionBadges = ({ computed }) => {
    if (!computed) return null;
    if (computed.sheet === "applicability") {
        return computed.is_applicable ? (
            <span className="dw-badge complied">Applicable</span>
        ) : (
            <span className="dw-badge pending">Not applicable</span>
        );
    }
    if (computed.sheet === "master") return null;
    return (
        <span className="d-inline-flex gap-1 align-items-center">
            {computed.is_completed ? (
                <span className="dw-badge complied">Completed</span>
            ) : (
                <span className="dw-badge pending">Pending</span>
            )}
            {computed.overdue && <span className="dw-badge overdue">Overdue</span>}
            {computed.variance_open && <span className="dw-badge exception">Variance open</span>}
            {computed.sla_met === false && <span className="dw-badge exception">SLA missed</span>}
        </span>
    );
};

export const CoverageStatusBadge = ({ status }) => {
    const s = COVERAGE_STATUSES[status];
    return s ? <span className={`dw-badge ${s.badge}`}>{s.label}</span> : null;
};
