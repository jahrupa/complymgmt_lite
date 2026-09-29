import React from "react";

// Same select checkbox behaviour as the helpdesk chart cards, plus loading / empty states.
// `selection` comes from ChallanDashboard's cardSelection(id).
const ChallanCard = ({
    selection,
    title,
    subtitle,
    actions,
    loading,
    isEmpty,
    emptyText = "No Data Found",
    minHeight = 300,
    children,
}) => {
    const { id, canSelect, selected, disabled, onSelect, onToggle } = selection;

    let body = children;
    if (isEmpty) {
        body = (
            <div className="no-data" style={{ minHeight }}>
                {loading ? "Loading..." : emptyText}
            </div>
        );
    }

    return (
        <div
            className={`chart-card mb-4 ${canSelect && selected ? "selected-card" : ""}`}
            onClick={canSelect ? () => onSelect(id) : undefined}
            style={{ cursor: canSelect ? "pointer" : "default" }}
        >
            <div className="d-flex justify-content-between align-items-start gap-2">
                <div>
                    <div className="fw-600">{title}</div>
                    {subtitle && <div className="text-muted small">{subtitle}</div>}
                </div>
                <div className="d-flex align-items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {actions}
                    <input
                        type="checkbox"
                        className="chart-select-checkbox"
                        onChange={() => onToggle(id)}
                        checked={selected}
                        disabled={disabled}
                    />
                </div>
            </div>
            <div className="mt-3" style={{ opacity: loading && !isEmpty ? 0.6 : 1, transition: "opacity 0.2s" }}>
                {body}
            </div>
        </div>
    );
};

export default ChallanCard;
