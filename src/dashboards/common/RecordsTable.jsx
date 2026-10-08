import React, { forwardRef, useMemo, useState } from "react";
import { Checkbox, ListItemText, ListSubheader, Menu, MenuItem } from "@mui/material";
import { Columns3 } from "lucide-react";
import PaginatedGrid from "../../component/PaginatedGrid";
import DashboardCard from "./DashboardCard";
import { formatRawValue } from "./dashboardUtils";

// Internal fields never shown as a column, even if the API lists them
const HIDDEN_KEYS = ["sheet"];

const humanize = (key) => String(key).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const loadVisibleColumns = (storageKey, defaults) => {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (Array.isArray(saved) && saved.length) return saved;
    } catch {
        // storage unavailable or corrupt; fall back to the defaults
    }
    return defaults;
};

/**
 * Full records table: server side pagination + sorting, a column picker and a status column.
 *
 * - fetchPage(page, limit, sort)  sort is { sort_by, sort_order } or {} for the default order
 * - columns                      [{ key, label, section }] from the API; hidden fields are simply missing
 * - computedColumns              extra columns read from row.computed, e.g. { key: "days_late", label, section, after }
 * - labelOverrides               column key -> label to use instead of the API label
 * - sortByForColumn              column key -> backend sort_by value; other columns are not sortable
 *                                ("__status" makes the status column sortable)
 * - renderStatus(computed)       status badges
 * - statusHeader                 header of the badge column (default "Status")
 * - gridKey                      a change restarts paging from page 1 (e.g. the filter JSON)
 */
const RecordsTable = forwardRef(function RecordsTable(
    {
        loading,
        title,
        subtitle,
        tabs,
        note,
        isEmpty,
        emptyText = "No records for the selected filters",
        columns,
        computedColumns = [],
        defaultColumns,
        labelOverrides,
        storageKey,
        sortByForColumn,
        renderStatus,
        statusHeader = "Status",
        fetchPage,
        gridKey,
        onView,
    },
    ref
) {
    const [savedVisible, setVisible] = useState(() => loadVisibleColumns(storageKey, defaultColumns));
    const [pickerAnchor, setPickerAnchor] = useState(null);

    // Computed columns go after the column named in `after`, or at the end
    const allColumns = useMemo(() => {
        // Only columns the API sent exist: fields hidden from external users are simply missing
        const result = (Array.isArray(columns) ? columns : [])
            .filter((col) => col?.key && !HIDDEN_KEYS.includes(col.key))
            .map((col) => ({
                ...col,
                label: labelOverrides?.[col.key] || col.label || humanize(col.key),
                section: col.section || "Other",
            }));
        computedColumns.forEach((col) => {
            const index = col.after ? result.findIndex((c) => c.key === col.after) : -1;
            if (index === -1) result.push(col);
            else result.splice(index + 1, 0, col);
        });
        return result;
    }, [columns, computedColumns, labelOverrides]);
    const computedKeys = useMemo(() => new Set(computedColumns.map((c) => c.key)), [computedColumns]);

    // If none of the saved / default columns came back (e.g. all hidden for an external user),
    // show the first few that did instead of an empty grid
    const visible = useMemo(() => {
        const available = new Set(allColumns.map((c) => c.key));
        if (savedVisible.some((key) => available.has(key))) return savedVisible;
        return allColumns.slice(0, 6).map((c) => c.key);
    }, [savedVisible, allColumns]);

    const toggleColumn = (key) => {
        setVisible(() => {
            const prev = visible;
            const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
            try {
                localStorage.setItem(storageKey, JSON.stringify(next));
            } catch {
                // not persisting the choice is fine
            }
            return next;
        });
    };

    const columnDefs = useMemo(
        () => [
            // renderStatus may be omitted, e.g. for a catalogue sheet without row status
            ...(renderStatus
                ? [
                      {
                          headerName: statusHeader,
                          // "__status" so it can't clash with a record column named "status"
                          colId: "__status",
                          width: 230,
                          flex: 0,
                          pinned: "left",
                          sortable: Boolean(sortByForColumn.__status),
                          cellRenderer: (p) => (p.data ? renderStatus(p.data._computed) : null),
                      },
                  ]
                : []),
            ...allColumns.map((col) => ({
                headerName: col.label,
                colId: col.key,
                hide: !visible.includes(col.key),
                sortable: Boolean(sortByForColumn[col.key]),
                // Record keys contain characters like "?", "()" and ".", so read them with bracket access
                valueGetter: (p) => (computedKeys.has(col.key) ? p.data?._computed?.[col.key] : p.data?.[col.key]),
                valueFormatter: (p) =>
                    computedKeys.has(col.key) ? (p.value ?? "—") : formatRawValue(p.value),
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
        [allColumns, computedKeys, visible, sortByForColumn, renderStatus, statusHeader, onView]
    );

    // Group picker entries by their section, keeping the Excel order
    const sections = allColumns.reduce((acc, col) => {
        (acc[col.section] = acc[col.section] || []).push(col);
        return acc;
    }, {});

    const gridFetch = (page, limit, search, sortModel) => {
        const sort = sortModel?.[0];
        const sortBy = sort && sortByForColumn[sort.colId];
        return fetchPage(page, limit, sortBy ? { sort_by: sortBy, sort_order: sort.sort } : {});
    };

    return (
        <div ref={ref}>
            <DashboardCard
                loading={loading}
                title={title}
                subtitle={subtitle}
                isEmpty={isEmpty}
                emptyText={emptyText}
                minHeight={200}
                actions={
                    <>
                        {tabs}
                        <button
                            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                            onClick={(e) => setPickerAnchor(e.currentTarget)}
                        >
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
                    {note && <div className="text-muted small mb-2">{note}</div>}
                    <PaginatedGrid
                        key={gridKey}
                        fetchPage={gridFetch}
                        getRows={(res) =>
                            (res?.data || []).map((row) => ({ ...row.record, _id: row._id ?? row.record?._id, _computed: row.computed }))
                        }
                        pageSize={20}
                        columnDefs={columnDefs}
                        defaultColDef={{ resizable: true, flex: 1, minWidth: 140, sortable: false }}
                    />
                </div>
            </DashboardCard>
        </div>
    );
});

export default RecordsTable;
