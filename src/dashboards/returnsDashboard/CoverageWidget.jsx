import React, { forwardRef, useMemo, useState } from "react";
import { Chip } from "@mui/material";
import PaginatedGrid from "../../component/PaginatedGrid";
import DashboardCard from "../common/DashboardCard";
import { fetchReturnsDashCoverage } from "../../api/service";
import { CoverageStatusBadge } from "./ReturnsBadges";
import { COVERAGE_STATUSES } from "./returnsUtils";

/**
 * RT-10: location worklist. Applicable locations without any filing come first; transaction-only
 * locations (filings but nothing applicable) are a data gap. A row opens its records.
 */
const CoverageWidget = forwardRef(function CoverageWidget(
    { loading, params, coverageStatus, coverage, statusFiltersActive, isCompanyMode, onStatusChange, onOpenRow },
    ref
) {
    const [total, setTotal] = useState(null);

    const columnDefs = useMemo(
        () => [
            { headerName: "Status", field: "status", width: 160, flex: 0, pinned: "left", cellRenderer: (p) => <CoverageStatusBadge status={p.value} /> },
            { headerName: "Company", field: "company_name", minWidth: 220, flex: 2, hide: isCompanyMode },
            { headerName: "State", field: "state", minWidth: 140 },
            { headerName: "Location", field: "location", minWidth: 160 },
            { headerName: "Applicable Returns", field: "applicable_returns", maxWidth: 170 },
            { headerName: "Filings", field: "transactions", maxWidth: 110 },
            { headerName: "Filed", field: "filed", maxWidth: 100 },
        ],
        [isCompanyMode]
    );

    const toggleStatus = (status) =>
        onStatusChange(coverageStatus.includes(status) ? coverageStatus.filter((s) => s !== status) : [...coverageStatus, status]);

    const hasRows = (coverage?.applicable_locations ?? 0) + (coverage?.transaction_only ?? 0) > 0;

    return (
        <div ref={ref}>
            <DashboardCard
                loading={loading}
                title="Location Coverage Worklist"
                subtitle={
                    <>
                        Applicable locations without filings first; click a row to see its records
                        {total !== null && ` · ${total} rows`}
                        {statusFiltersActive && " · status filters don't apply here"}
                    </>
                }
                isEmpty={!hasRows}
                emptyText="No applicable or filed locations for the selected filters"
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
                            fetchReturnsDashCoverage({ ...params, coverage_status: coverageStatus, page, limit }).then((res) => {
                                setTotal(res?.total ?? null);
                                return res;
                            })
                        }
                        pageSize={20}
                        height="460px"
                        columnDefs={columnDefs}
                        defaultColDef={{ resizable: true, flex: 1, minWidth: 100 }}
                        rowStyle={{ cursor: "pointer" }}
                        onRowClicked={(e) => e.data && onOpenRow(e.data)}
                    />
                </div>
            </DashboardCard>
        </div>
    );
});

export default CoverageWidget;
