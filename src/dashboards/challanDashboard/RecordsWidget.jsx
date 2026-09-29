import React, { forwardRef, useMemo, useState } from "react";
import { Checkbox, ListItemText, ListSubheader, Menu, MenuItem } from "@mui/material";
import { Columns3 } from "lucide-react";
import PaginatedGrid from "../../component/PaginatedGrid";
import ChallanCard from "./ChallanCard";
import StatusBadges from "./StatusBadges";
import { fetchChallanRecords } from "../../api/service";
import { DATE_COLUMNS, DEFAULT_RECORD_COLUMNS, SORT_BY_FOR_COLUMN, formatRawDate } from "./challanUtils";

const COLUMNS_STORAGE_KEY = "challanRecordColumns";

// Days late is computed by the backend, not part of the uploaded row
const DAYS_LATE_COLUMN = { key: "days_late", label: "Days Late", section: "Computed" };

const loadVisibleColumns = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(COLUMNS_STORAGE_KEY));
        if (Array.isArray(saved) && saved.length) return saved;
    } catch {
        // storage unavailable or corrupt; fall back to the defaults
    }
    return DEFAULT_RECORD_COLUMNS;
};

// CH-7: full records table with server side pagination + sorting and a column picker
const RecordsWidget = forwardRef(function RecordsWidget({ selection, loading, params, columns, total, onView }, ref) {
    const [visible, setVisible] = useState(loadVisibleColumns);
    const [pickerAnchor, setPickerAnchor] = useState(null);

    // Hidden fields (tracker external-access settings) are simply missing from `columns`
    const allColumns = useMemo(() => [...(columns || []), DAYS_LATE_COLUMN], [columns]);

    const toggleColumn = (key) => {
        setVisible((prev) => {
            const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
            try {
                localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // not persisting the choice is fine
            }
            return next;
        });
    };

    const columnDefs = useMemo(
        () => [
            {
                headerName: "Status",
                colId: "status",
                width: 190,
                flex: 0,
                pinned: "left",
                cellRenderer: (p) => <StatusBadges computed={p.data?._computed} />,
            },
            ...allColumns.map((col) => ({
                headerName: col.label,
                colId: col.key,
                hide: !visible.includes(col.key),
                sortable: Boolean(SORT_BY_FOR_COLUMN[col.key]),
                // Record keys contain characters like "?" and "()", so read them with bracket access
                valueGetter: (p) =>
                    col.key === DAYS_LATE_COLUMN.key ? p.data?._computed?.days_late : p.data?.[col.key],
                valueFormatter: DATE_COLUMNS.has(col.key) ? (p) => formatRawDate(p.value) : undefined,
            })),
            {
                headerName: "",
                colId: "view",
                width: 90,
                flex: 0,
                pinned: "right",
                cellRenderer: (p) =>
                    p.data?._id ? (
                        <button className="btn btn-sm btn-outline-primary py-0" onClick={() => onView(p.data._id)}>
                            View
                        </button>
                    ) : null,
            },
        ],
        [allColumns, visible, onView]
    );

    // Group picker entries by their section, keeping the Excel order
    const sections = allColumns.reduce((acc, col) => {
        (acc[col.section] = acc[col.section] || []).push(col);
        return acc;
    }, {});

    const fetchPage = (page, limit, search, sortModel) => {
        const sort = sortModel?.[0];
        const sortBy = sort && SORT_BY_FOR_COLUMN[sort.colId];
        return fetchChallanRecords(page, limit, undefined, {
            ...params,
            ...(sortBy ? { sort_by: sortBy, sort_order: sort.sort } : {}),
        });
    };

    return (
        <div ref={ref}>
            <ChallanCard
                selection={selection}
                loading={loading}
                title="Challan Records"
                subtitle={`${total ?? 0} records match the filters`}
                isEmpty={!total}
                emptyText="No records for the selected filters"
                minHeight={200}
                actions={
                    <>
                        <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={(e) => setPickerAnchor(e.currentTarget)}>
                            <Columns3 size={16} /> Columns
                        </button>
                        <Menu
                            anchorEl={pickerAnchor}
                            open={Boolean(pickerAnchor)}
                            onClose={() => setPickerAnchor(null)}
                            slotProps={{ paper: { style: { maxHeight: 420 } } }}
                        >
                            {Object.entries(sections).flatMap(([section, cols]) => [
                                <ListSubheader key={`h-${section}`}>{section}</ListSubheader>,
                                ...cols.map((col) => (
                                    <MenuItem key={col.key} dense onClick={() => toggleColumn(col.key)}>
                                        <Checkbox size="small" checked={visible.includes(col.key)} />
                                        <ListItemText primary={col.label} />
                                    </MenuItem>
                                )),
                            ])}
                        </Menu>
                    </>
                }
            >
                <div onClick={(e) => e.stopPropagation()}>
                    <PaginatedGrid
                        // a new key restarts paging from page 1 when the filters change
                        key={JSON.stringify(params)}
                        fetchPage={fetchPage}
                        getRows={(res) =>
                            (res?.data || []).map((row) => ({ ...row.record, _id: row._id, _computed: row.computed }))
                        }
                        pageSize={20}
                        columnDefs={columnDefs}
                        defaultColDef={{ resizable: true, flex: 1, minWidth: 140, sortable: false }}
                    />
                </div>
            </ChallanCard>
        </div>
    );
});

export default RecordsWidget;
