// OnbardingPayrollCompliance.jsx
import React, { useState, useRef, useCallback } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AgGridSearchBar from './MuiInputs/AgGridSearchBar';
import Modal from './Modal'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import exportCsvIcon from '../assets/Arrow-Line.png'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import * as XLSX from 'xlsx';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register module
ModuleRegistry.registerModules([AllCommunityModule]);

const OnbardingPayrollCompliance = () => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [fileName, setFileName] = useState(''); // State to store the file name
  const gridRef = useRef();
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const defaultColDef = {
    sortable: true,
    filter: true,
    editable: true,
    headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
   
  };

  const addRow = () => {
    const newRow = Object.fromEntries(columnDefs.map(col => [col.field, '']));
    setRowData(prev => [...prev, newRow]);
  };

  const onRowValueChanged = (event) => {
    console.log('Row updated:', event.data);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      setFileName(file); // Set the file name in the state
    } else {
      setFileName('No file selected');
    }

  };
 const uploadFile = () => {
  const reader = new FileReader();

  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    // Read second sheet (index 1)
    const sheetName = workbook.SheetNames[0];
    console.log('Sheet Name:', sheetName);
    if (!sheetName) {
      alert('The workbook does not have a second sheet.');
      return;
    }

    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    const headers = sheet[0] || [];
    const rows = sheet.slice(1).map(row =>
      Object.fromEntries(headers.map((h, i) => [h, row?.[i] ?? '']))
    );

    setColumnDefs(headers.map(h => ({ field: h, editable: true })));
    setRowData(rows);
  };
  setIsModalOpen(false);

  reader.readAsArrayBuffer(fileName);
  }
  const crudForm = () => {
    return (
      <div>
        <div className=" mb-3 ps-3 pe-3 pb-3 mt-4">
          <div className="button-wrap">
            <label className="upload_button" htmlFor="upload"><span className='me-2 upload_file_icon'><CloudUploadIcon /></span>Upload File</label>
            <input
              className="upload_file_input"
              id="upload"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange} // Handle file change event
            />
          </div>
          {fileName ? <div className='mt-4 uploaded_file_name'><span ><FilePresentIcon /></span><span>{fileName?.name}</span> </div> : <div className='mt-4  not_uploaded_file_text'><span><FilePresentIcon /></span>File is not uploaded </div>}


        </div>
        <div className="row row-gap-2">
          <div className='col col-12 col-md-6'>
            <button type="button" className="btn btn-secondary w-100" onClick={closeModal}>Cancle</button>
          </div>
          <div className='col col-12 col-md-6'>
            <button type="submit" className="btn btn-primary w-100" onClick={uploadFile}>Upload</button>
          </div>
        </div>
      </div>

    )

  }
  const crudTitle = "Upload File"

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
    <div className="client-onboarding-2">
      {/* Add NavBar if you have it */}
      <Modal crudForm={crudForm} crudTitle={crudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      <h5>Client Onboarding - 2B Payroll Compliance</h5>
      <div className='table_div  p-3'>

        <div className='d-lg-flex d-md-flex justify-content-between'>
          <div className="search-bar-container h-25">
            <AgGridSearchBar label='Search...' type='text' id="filter-text-box" onInput={onFilterTextBoxChanged} />
            <button className='search-icon'><SearchIcon /></button>
          </div>
          <div className='d-lg-flex d-md-flex justify-content-between'>

            <div className='d-lg-flex d-md-flex gap-2'>
              <div>
                <button onClick={onBtnExport} className='crud_btn'><ExitToAppIcon style={{width:18}}/>Export</button>
              </div>
              <div>
                <div className=' d-flex justify-content-end'>
                  <button className='crud_btn' onClick={openModal}>Upload File</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ag-theme-quartz" style={{ height: '600px', width: '100%', marginTop: '1rem' }}>
          <AgGridReact
            theme="legacy"
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            editType="fullRow"
            rowSelection="single"
            pagination={true}
            rowBuffer={rowBuffer}
            onRowValueChanged={onRowValueChanged}
          />
        </div>
      </div>

    </div>
  );
};

export default OnbardingPayrollCompliance;
