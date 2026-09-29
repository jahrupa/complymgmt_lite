import React, { useMemo } from "react";
import PaginatedGrid from "../../component/PaginatedGrid";
import DashboardCard from "./DashboardCard";
import ChipList from "./ChipList";

/**
 * "Needs attention" list: server paginated RecordItems, most urgent first, with status badges,
 * computed.exceptions as chips and a View action.
 *
 * - fetchPage(page, limit)   API call returning { data: RecordItem[], total }
 * - leadColumns             identifying columns (fields produced by mapRow)
 * - mapRow(row)             RecordItem -> grid row; _id, computed and exceptions are added here
 * - renderStatus(computed)  status badges
 * - gridKey                 a change restarts paging from page 1 (e.g. the filter JSON)
 */
const ExceptionsCard = ({
    selection,
    loading,
    subtitle,
    total,
    fetchPage,
    gridKey,
    leadColumns,
    mapRow,
    renderStatus,
    statusWidth = 220,
    onView,
}) => {
    const columnDefs = useMemo(
        () => [
            ...leadColumns,
            { headerName: "Status", field: "computed", width: statusWidth, flex: 0, cellRenderer: (p) => renderStatus(p.value) },
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
        [leadColumns, renderStatus, statusWidth, onView]
    );

    return (
        <DashboardCard
            selection={selection}
            loading={loading}
            title="Needs Attention"
            subtitle={subtitle}
            isEmpty={!total}
            emptyText="No exceptions for the selected filters"
            minHeight={200}
        >
            <div onClick={(e) => e.stopPropagation()}>
                <PaginatedGrid
                    key={gridKey}
                    fetchPage={fetchPage}
                    getRows={(res) =>
                        (res?.data || []).map((row) => ({
                            ...mapRow(row),
                            _id: row._id,
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
        </DashboardCard>
    );
};

export default ExceptionsCard;
