import React from "react";

// Chart card with a title row, optional header actions and loading / empty states.
// Which users see a widget is managed on the Widget Access page, not on the dashboard.
const DashboardCard = ({
    title,
    subtitle,
    actions,
    loading,
    isEmpty,
    emptyText = "No Data Found",
    minHeight = 300,
    children,
}) => {
    let body = children;
    if (isEmpty) {
        body = (
            <div className="no-data" style={{ minHeight }}>
                {loading ? "Loading..." : emptyText}
            </div>
        );
    }

    return (
        <div className="chart-card mb-4">
            <div className="d-flex justify-content-between align-items-start gap-2">
                <div>
                    <div className="fw-600">{title}</div>
                    {subtitle && <div className="text-muted small">{subtitle}</div>}
                </div>
                {actions && <div className="d-flex align-items-center gap-2">{actions}</div>}
            </div>
            <div className="mt-3" style={{ opacity: loading && !isEmpty ? 0.6 : 1, transition: "opacity 0.2s" }}>
                {body}
            </div>
        </div>
    );
};

export default DashboardCard;
