import React, { useMemo } from "react";
import PaginatedGrid from "../../component/PaginatedGrid";
import ChallanCard from "./ChallanCard";
import StatusBadges from "./StatusBadges";
import { fetchChallanExceptions } from "../../api/service";
import { ACT_KEY } from "./challanUtils";

// Infinite row model rows have a fixed height, so chips stay on one line and the full list is in the title
const ChipList = ({ value, className }) => (
    <div className="d-flex gap-1 align-items-center h-100 overflow-hidden" title={(value || []).join("\n")}>
        {(value || []).map((text) => (
            <span key={text} className={`challan-badge ${className}`} style={{ whiteSpace: "nowrap" }}>
                {text}
            </span>
        ))}
    </div>
);

// CH-6: server paginated list of rows needing attention, most severe first
const ExceptionsWidget = ({ selection, loading, params, total, isCompanyMode, onView }) => {
    const columnDefs = useMemo(
        () => [
            { headerName: "Company", field: "company", minWidth: 170, hide: isCompanyMode },
            { headerName: "State", field: "state", minWidth: 120 },
            { headerName: "Location", field: "location", minWidth: 170 },
            { headerName: "Act", field: "act", width: 90, flex: 0 },
            { headerName: "Wage Month", field: "wage_month", width: 120, flex: 0 },
            { headerName: "Status", field: "computed", width: 200, flex: 0, cellRenderer: (p) => <StatusBadges computed={p.value} /> },
            { headerName: "Exceptions", field: "exceptions", minWidth: 320, flex: 3, cellRenderer: (p) => <ChipList value={p.value} className="exception" /> },
            {
                headerName: "",
                field: "_id",
                width: 90,
                flex: 0,
                pinned: "right",
                cellRenderer: (p) =>
                    p.value ? (
                        <button className="btn btn-sm btn-outline-primary py-0" onClick={() => onView(p.value)}>
                            View
                        </button>
                    ) : null,
            },
        ],
        [isCompanyMode, onView]
    );

    return (
        <ChallanCard
            selection={selection}
            loading={loading}
            title="Needs Attention"
            subtitle={`${total ?? 0} exceptions: non-complied, paid late, overdue, skipped employees or penalty`}
            isEmpty={!total}
            emptyText="No exceptions for the selected filters"
            minHeight={200}
        >
            <div onClick={(e) => e.stopPropagation()}>
                <PaginatedGrid
                    // a new key restarts paging from page 1 when the filters change
                    key={JSON.stringify(params)}
                    fetchPage={(page, limit) => fetchChallanExceptions(params, page, limit)}
                    getRows={(res) =>
                        (res?.data || []).map((row) => ({
                            _id: row._id,
                            company: row.record?.company_name,
                            state: row.record?.state,
                            location: row.record?.location,
                            act: row.record?.[ACT_KEY],
                            wage_month: row.computed?.month_label || row.record?.wage_month,
                            computed: row.computed,
                            exceptions: row.computed?.exceptions || [],
                        }))
                    }
                    pageSize={20}
                    height="460px"
                    rowHeight={44}
                    columnDefs={columnDefs}
                    defaultColDef={{ resizable: true, flex: 1, minWidth: 100 }}
                />
            </div>
        </ChallanCard>
    );
};

export default ExceptionsWidget;
