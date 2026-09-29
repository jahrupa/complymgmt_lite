import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

// Accepts a plain array or a paginated `{ data, total }` style response
const defaultGetRows = (response) =>
  Array.isArray(response) ? response : response?.data || [];

const defaultGetTotal = (response) =>
  response?.total ?? response?.total_count ?? response?.totalRecords;

/**
 * AG Grid with server side pagination (infinite row model).
 * The grid asks for a block of rows and we fetch that page with page & limit.
 *
 * Props:
 *  - fetchPage(page, limit, search, sortModel)  API call, page starts from 1;
 *                             sortModel is AG Grid's [{ colId, sort }] for server side sorting
 *  - search                   search text for the API; a change reloads from page 1
 *  - getRows(response)        pick the rows out of the response
 *  - getTotal(response)       pick the total record count out of the response
 *  - rowFilter(row)           optional client side filter on the current page
 *  - onPageLoaded(rows)       called with the raw rows of every loaded page
 *  - pageSize                 rows per page (default 20)
 *  - height                   grid height (default 600px)
 *  - any other AgGridReact prop (columnDefs, defaultColDef, ...)
 *
 * Ref exposes `refresh()` (reload current page) and `api` (AG Grid api).
 */
const PaginatedGrid = forwardRef(function PaginatedGrid(
  {
    fetchPage,
    search,
    getRows = defaultGetRows,
    getTotal = defaultGetTotal,
    rowFilter,
    onPageLoaded,
    pageSize = 20,
    height = "600px",
    ...gridProps
  },
  ref,
) {
  const gridRef = useRef();

  // Keep latest callbacks in a ref so the datasource identity only depends on
  // the search text, not on props that change on every render.
  const callbacksRef = useRef();
  callbacksRef.current = {
    fetchPage,
    getRows,
    getTotal,
    rowFilter,
    onPageLoaded,
  };

  // A new search means a different result set, so the grid has to start over.
  // Handing AG Grid a new datasource is what resets it properly: it throws away
  // the cached blocks AND the old row count, and pagination falls back to
  // page 1. refreshInfiniteCache() would instead reload whichever page the user
  // was on (page 4 stays page 4) and keep the stale total.
  const dataSource = useMemo(
    () => ({
      getRows: async (params) => {
        const { startRow, endRow, sortModel } = params;
        const limit = endRow - startRow;
        const page = startRow / limit + 1; // AG Grid rows are 0 based
        const cb = callbacksRef.current;

        try {
          const response = await cb.fetchPage(page, limit, search, sortModel);
          const rows = cb.getRows(response) || [];
          const total = cb.getTotal(response);

          cb.onPageLoaded?.(rows);

          const visibleRows = cb.rowFilter ? rows.filter(cb.rowFilter) : rows;

          // Without a total from the API, a short page means it's the last one
          const lastRow =
            total ?? (rows.length < limit ? startRow + rows.length : undefined);
          params.successCallback(visibleRows, lastRow);
        } catch (error) {
          console.error("PaginatedGrid: failed to fetch page", error);
          params.failCallback();
        }
      },
    }),
    [search],
  );

  useImperativeHandle(ref, () => ({
    refresh: () => gridRef.current?.api?.refreshInfiniteCache(),
    get api() {
      return gridRef.current?.api;
    },
  }));

  return (
    <div className="ag-theme-quartz" style={{ height, width: "100%" }}>
      <AgGridReact
        theme="legacy"
        {...gridProps}
        ref={gridRef}
        rowModelType="infinite"
        datasource={dataSource}
        pagination={true}
        paginationPageSize={pageSize}
        cacheBlockSize={pageSize}
        // paginationPageSizeSelector={false}
      />
    </div>
  );
});

export default PaginatedGrid;
