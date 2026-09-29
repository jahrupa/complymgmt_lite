import React, { useMemo } from "react";
import PaginatedGrid from "../../component/PaginatedGrid";
import DashboardCard from "../common/DashboardCard";
import ChipList from "../common/ChipList";
import { fetchRegisterDashExceptions } from "../../api/service";
import { ExecutionBadges } from "./RegisterBadges";

// RG-9: server paginated list of rows needing attention, most urgent first
const ExceptionsWidget = ({ selection, loading, params, total, isCompanyMode, onView }) => {
    const columnDefs = useMemo(
        () => [
            { headerName: "Company", field: "company", minWidth: 170, hide: isCompanyMode },
            { headerName: "Location", field: "location", minWidth: 170 },
            { headerName: "Register", field: "register", minWidth: 180 },
            { headerName: "Form", field: "form", width: 110, flex: 0 },
            { headerName: "Month", field: "month", width: 110, flex: 0 },
            { headerName: "Status", field: "computed", width: 260, flex: 0, cellRenderer: (p) => <ExecutionBadges computed={p.value} /> },
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
        <DashboardCard
            selection={selection}
            loading={loading}
            title="Needs Attention"
            subtitle={`${total ?? 0} exceptions: overdue, SLA missed or variance open`}
            isEmpty={!total}
            emptyText="No exceptions for the selected filters"
            minHeight={200}
        >
            <div onClick={(e) => e.stopPropagation()}>
                <PaginatedGrid
                    // a new key restarts paging from page 1 when the filters change
                    key={JSON.stringify(params)}
                    fetchPage={(page, limit) => fetchRegisterDashExceptions({ ...params, page, limit })}
                    getRows={(res) =>
                        (res?.data || []).map((row) => ({
                            _id: row._id,
                            company: row.record?.company_name,
                            location: row.record?.location,
                            register: row.record?.register_name,
                            form: row.record?.form_id,
                            month: row.computed?.month_label,
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

export default ExceptionsWidget;
