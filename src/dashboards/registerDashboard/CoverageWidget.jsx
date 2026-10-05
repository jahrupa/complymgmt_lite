import React, { forwardRef, useMemo, useState } from "react";
import { Chip } from "@mui/material";
import PaginatedGrid from "../../component/PaginatedGrid";
import DashboardCard from "../common/DashboardCard";
import { fetchRegisterDashCoverage } from "../../api/service";
import { CoverageStatusBadge } from "./RegisterBadges";
import { COVERAGE_STATUSES, hasApplicability } from "./registerUtils";

/**
 * RG-10: the "what's missing" worklist. Every applicable register with its status, not started
 * first. Rows with an execution_id open that execution record.
 */
const CoverageWidget = forwardRef(function CoverageWidget(
    { loading, params, coverageStatus, coverage, executionFiltersActive, isCompanyMode, onStatusChange, onView },
    ref
) {
    const [total, setTotal] = useState(null);

    const columnDefs = useMemo(
        () => [
            { headerName: "Status", field: "status", width: 140, flex: 0, pinned: "left", cellRenderer: (p) => <CoverageStatusBadge status={p.value} /> },
            { headerName: "Company", field: "company_name", minWidth: 180, hide: isCompanyMode },
            { headerName: "State", field: "state", minWidth: 120 },
            { headerName: "Location", field: "location", minWidth: 170 },
            { headerName: "Register", field: "register_name", minWidth: 190 },
            { headerName: "Form", field: "form_id", width: 110, flex: 0 },
            { headerName: "Act", field: "applicable_act", minWidth: 200 },
            { headerName: "Month", field: "month_label", width: 110, flex: 0 },
            {
                headerName: "",
                field: "execution_id",
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

    const toggleStatus = (status) =>
        onStatusChange(coverageStatus.includes(status) ? coverageStatus.filter((s) => s !== status) : [...coverageStatus, status]);

    return (
        <div ref={ref}>
            <DashboardCard
                loading={loading}
                title="Coverage Worklist"
                subtitle={
                    <>
                        Applicable registers and whether they are done; not started first
                        {total !== null && ` · ${total} rows`}
                        {executionFiltersActive && " · execution filters don't apply here"}
                    </>
                }
                isEmpty={!hasApplicability(coverage)}
                emptyText="No applicability data for the selected period"
                minHeight={200}
                actions={
                    <div className="d-flex gap-1">
                        {Object.entries(COVERAGE_STATUSES).map(([key, s]) => (
                            <Chip
                                key={key}
                                size="small"
                                label={`${s.label} ${coverage?.[key] ?? 0}`}
                                variant={coverageStatus.includes(key) ? "filled" : "outlined"}
                                sx={coverageStatus.includes(key) ? { background: s.color, color: "white" } : { borderColor: s.color }}
                                onClick={() => toggleStatus(key)}
                            />
                        ))}
                    </div>
                }
            >
                <div onClick={(e) => e.stopPropagation()}>
                    <PaginatedGrid
                        // a new key restarts paging from page 1 when the filters change
                        key={JSON.stringify([params, coverageStatus])}
                        fetchPage={(page, limit) =>
                            fetchRegisterDashCoverage({ ...params, coverage_status: coverageStatus, page, limit }).then((res) => {
                                setTotal(res?.total ?? null);
                                return res;
                            })
                        }
                        pageSize={20}
                        height="460px"
                        columnDefs={columnDefs}
                        defaultColDef={{ resizable: true, flex: 1, minWidth: 100 }}
                        getRowStyle={(p) => (p.data?.execution_id ? { cursor: "pointer" } : undefined)}
                        onRowClicked={(e) => e.data?.execution_id && onView(e.data.execution_id)}
                    />
                </div>
            </DashboardCard>
        </div>
    );
});

export default CoverageWidget;
