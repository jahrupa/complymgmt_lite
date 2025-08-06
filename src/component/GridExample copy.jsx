// GridExample.js
import React, { useCallback, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import exportCsvIcon from '../assets/Arrow-Line.png'
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { useFetchJson } from './useFetchJson';
import SearchIcon from '@mui/icons-material/Search';
import AgGridSearchBar from './MuiInputs/AgGridSearchBar';
import ScrollableTabsButton from './ScrollableTabsButton';

ModuleRegistry.registerModules([AllCommunityModule]);

const GridExample = () => {
  const gridRef = useRef(null);

  // Row Data: The data to be displayed.
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/space-mission-data.json",
  );
  console.log(data, 'data')
  // Column Definitions: Defines & controls grid columns.
  const [colDefs] = useState([
    {
      field: "successful", pinned: 'left',
      headerStyle: { color: "#515151", backgroundColor: "#ffffe24d" },
    },
    {
      field: "mission",
      filter: true,
      headerStyle: { color: "#515151", backgroundColor: "#ffffe24d" },

    },
    {
      field: "company",
      headerStyle: { color: "#515151", backgroundColor: "#ffffe24d" },

    },
    {
      field: "location",
      headerStyle: { color: "#515151", backgroundColor: "#ffffe24d" },

    },
    {
      field: "date",
      headerStyle: { color: "#515151", backgroundColor: "#ffffe24d" },

    },
    {
      field: "price",
      headerStyle: { color: "#515151", backgroundColor: "#ffffe24d" },
    },

    {
      field: "rocket",
      headerStyle: { color: "#515151", backgroundColor: "#ffffe24d" },
    },
  ]);
  // GOOD - only one instance created
  //  const defaultColDef = useMemo( ()=> { filter: true }, []);
  const rowBuffer = 0;
  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      "quickFilterText",
      document.getElementById("filter-text-box").value,
    );
  }, []);

  return (
    <div className='table_div p-3'>
      <ScrollableTabsButton/>
      <div className='d-lg-flex d-md-flex justify-content-between'>
        <div className="search-bar-container h-25">
          <AgGridSearchBar label='Search...' type='text' id="filter-text-box" onInput={onFilterTextBoxChanged} />
          <button className='search-icon'><SearchIcon /></button>
        </div>
        <div className='d-lg-flex d-md-flex gap-2'>
          <div>
            <button onClick={onBtnExport} className='crud_btn w-100'><img src={exportCsvIcon} alt='csv export icon' width='12' className='mb-1 me-1' />Export</button>
          </div>
          <div>
            <button onClick={onBtnExport} className='crud_btn w-100'><img src={exportCsvIcon} alt='csv export icon' width='12' className='mb-1 me-1' />Export</button>
          </div>
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          theme="legacy"
          rowData={data}
          ref={gridRef}
          loading={loading}
          columnDefs={colDefs}
          defaultColDef={{ filter: true }}
          rowBuffer={rowBuffer}
          suppressDragLeaveHidesColumns={true}
          // suppressMoveWhenColumnDragging={true}
          pagination={true} // Enable Pagination
          groupDisplayType="multipleColumns" // ✅ Essential for grouping to show
          animateRows={true}
        />
      </div>
    </div>

  );
};

export default GridExample;
