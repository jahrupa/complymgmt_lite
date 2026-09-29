import React from "react";
import { Tooltip } from "@mui/material";
import { VALIDITY, VALIDITY_ORDER, daysToExpireText } from "./licenseUtils";

export const ValidityBadge = ({ validity }) => {
    const v = VALIDITY[validity];
    if (!v) return null;
    return (
        <span className="dw-badge" style={{ background: v.color, color: v.text }}>
            {v.label}
        </span>
    );
};

// Validity plus the flags that make a license need attention
export const LicenseBadges = ({ computed }) => {
    if (!computed) return null;
    return (
        <span className="d-inline-flex gap-1 align-items-center flex-wrap">
            <ValidityBadge validity={computed.validity} />
            {computed.sla_breach && <span className="dw-badge exception">SLA breach</span>}
            {computed.follow_up_overdue && <span className="dw-badge overdue">Follow-up overdue</span>}
            {computed.is_completed && computed.document_uploaded === false && <span className="dw-badge overdue">Doc missing</span>}
            {computed.billing_pending && <span className="dw-badge neutral">Billing pending</span>}
        </span>
    );
};

// Stacked validity bar for a LicenseStats row (table cells)
export const ValidityBar = ({ stats }) => {
    const total = stats?.total || 0;
    if (!total) return <span className="text-muted small">No licenses</span>;
    return (
        <div className="dw-progress">
            <div className="dw-share-bar" style={{ flex: 1, height: 10 }}>
                {VALIDITY_ORDER.filter((key) => stats[key] > 0).map((key) => (
                    <Tooltip key={key} title={`${VALIDITY[key].label}: ${stats[key]}`}>
                        <span style={{ width: `${(stats[key] / total) * 100}%`, background: VALIDITY[key].color }} />
                    </Tooltip>
                ))}
            </div>
        </div>
    );
};

// License chip for the location view: coloured by validity, days to expiry in the tooltip
export const LicenseChip = ({ license, onClick }) => {
    const v = VALIDITY[license.validity] || { color: "#e5e7eb", text: "#374151", label: license.validity };
    return (
        <Tooltip title={`${v.label} · ${daysToExpireText(license.days_to_expire)}`}>
            <span
                className="dw-badge clickable"
                style={{ background: v.color, color: v.text }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(license._id);
                }}
            >
                {license.license_type || "License"}
            </span>
        </Tooltip>
    );
};
