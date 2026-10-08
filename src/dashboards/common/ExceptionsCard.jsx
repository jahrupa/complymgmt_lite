import React, { useMemo, useState } from "react";
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
    // Lead fields that had a value in some loaded row. Fields hidden from external users are left out of
    // the record entirely (mapRow yields undefined), so a column that never gets one is dropped.
    const [seen, setSeen] = useState({ gridKey, fields: null });
    const seenFields = seen.gridKey === gridKey ? seen.fields : null;
    const noteRows = (rows) => {
        const fields = new Set(seenFields || []);
        rows.forEach((r) => leadColumns.forEach((c) => r[c.field] !== undefined && fields.add(c.field)));
        if (!seenFields || fields.size > seenFields.size) setSeen({ gridKey, fields });
    };

    const columnDefs = useMemo(
        () => [
            ...leadColumns.filter((c) => !seenFields || seenFields.has(c.field)),
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
        [leadColumns, seenFields, renderStatus, statusWidth, onView]
    );

    return (
        <DashboardCard
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
                    getRows={(res) => {
                        const rows = (res?.data || []).map((row) => ({
                            ...mapRow(row),
                            _id: row._id ?? row.record?._id,
                            computed: row.computed,
                            exceptions: row.computed?.exceptions || [],
                        }));
                        if (rows.length) noteRows(rows);
                        return rows;
                    }}
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
