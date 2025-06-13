// Reimbursements.jsx or PayrollManagement.jsx

import React, { useState, useRef, useCallback } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import * as XLSX from 'xlsx';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import exportCsvIcon from '../assets/Arrow-Line.png';
import Modal from './Modal';
import AgGridSearchBar from './MuiInputs/AgGridSearchBar';

// Register modules
ModuleRegistry.registerModules([AllCommunityModule]);

const PayrollManagement = () => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const gridRef = useRef();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const defaultColDef = {
    sortable: true,
    filter: true,
    editable: true,
    headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
    flex: 1,
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file || '');
  };

  const uploadFile = () => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        alert('The workbook does not have any sheets.');
        return;
      }

      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
      const headers = sheet[0] || [];
      const rows = sheet.slice(1).map(row =>
        Object.fromEntries(headers.map((h, i) => [h, row?.[i] ?? '']))
      );

      const dynamicCols = headers.map(h => ({
        field: h,
        editable: true,
      }));

      // Add Actions column
      const actionCol = {
        headerName: 'Actions',
        field: 'actions',
        filter: false,
        editable: false,
        width: 130,
        pinned: 'left',
        cellRenderer: (params) => {
          return (
            <div className="d-flex justify-content-around align-items-center">
              {/* <EditIcon fontSize="small" className="action_icon" /> */}
              <button className="btn btn-sm" onClick={() => alert(`Edit row ${params.rowIndex}`)}>Edit</button>
              <button className="btn btn-sm" onClick={() => alert(`Delete row ${params.rowIndex}`)}>Delete</button>
              {/* <DeleteIcon fontSize="small" className="action_icon" /> */}
            </div>
          );
        }
      };

      setColumnDefs([actionCol, ...dynamicCols]);
      setRowData(rows);
      setIsModalOpen(false);
    };

    if (fileName) {
      reader.readAsArrayBuffer(fileName);
    } else {
      alert('Please select a file to upload.');
    }
  };

  const addRow = () => {
    const newRow = Object.fromEntries(columnDefs.map(col => [col.field, '']));
    setRowData(prev => [...prev, newRow]);
  };

  const onRowValueChanged = (event) => {
    console.log('Row updated:', event.data);
  };

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      'quickFilterText',
      document.getElementById('filter-text-box').value
    );
  }, []);

  const crudForm = () => (
    <div>
      <div className="mb-3 ps-3 pe-3 pb-3 mt-4">
        <div className="button-wrap">
          <label className="upload_button" htmlFor="upload">
            <span className="me-2 upload_file_icon"><CloudUploadIcon /></span>Upload File
          </label>
          <input
            className="upload_file_input"
            id="upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
        </div>

        {fileName ? (
          <div className="mt-4 uploaded_file_name">
            <span><FilePresentIcon /></span>
            <span>{fileName.name}</span>
          </div>
        ) : (
          <div className="mt-4 not_uploaded_file_text">
            <span><FilePresentIcon /></span>File is not uploaded
          </div>
        )}
      </div>

      <div className="row row-gap-2">
        <div className="col-12 col-md-6">
          <button type="button" className="btn btn-secondary w-100" onClick={closeModal}>Cancel</button>
        </div>
        <div className="col-12 col-md-6">
          <button type="submit" className="btn btn-primary w-100" onClick={uploadFile}>Upload</button>
        </div>
      </div>
    </div>
  );

  const crudTitle = "Upload File";

  return (
    <div className="client-onboarding-2">
      <Modal crudForm={crudForm} crudTitle={crudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      <h5>Client Onboarding - 2E_Payroll_Management</h5>

      <div className="table_div p-3">
        <div className="d-lg-flex d-md-flex justify-content-between">
          <div className="search-bar-container h-25">
            <AgGridSearchBar label="Search..." type="text" id="filter-text-box" onInput={onFilterTextBoxChanged} />
            <button className="search-icon"><SearchIcon /></button>



          </div>

          <div className="d-lg-flex d-md-flex justify-content-between">
            <div className="d-lg-flex d-md-flex gap-2">
              {/* <button onClick={onBtnExport} className="crud_btn">
                <img src={exportCsvIcon} alt="csv export icon" width="12" className="mb-1 me-1" />Export
              </button> */}

               <button className=" reject upload-wrapper upload-label" onClick={onBtnExport}>
                <span className="icon">
                  <img src={exportCsvIcon} alt="csv export icon" width="12" className="mb-1 me-1" />
                </span>
                <span className="text">Export</span>
              </button>
              <div className='btn-wrap-div'>

                <button className="button approve">
                  <span className="icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12 3.41 13.41 9 19 21 7 19.59 5.59z" />
                    </svg>
                  </span>
                  <span className="text">Approve</span>
                </button>

                {/* <button className="button reject">
                  <span className="icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M18.3 5.71L12 12l6.3 6.29-1.42 1.42L12 13.41l-6.29 6.3-1.42-1.42L10.59 12 4.29 5.71 5.71 4.29 12 10.59l6.29-6.3z" />
                    </svg>
                  </span>
                  <span className="text">Reject</span>
                </button> */}

              </div>
              {/* <button className="crud_btn" onClick={openModal}>Upload File</button> */}
                <div>
              <button className=" reject upload-wrapper upload-label" onClick={openModal}>
                <span className="icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 20h14v-2H5v2zm7-18l-5.5 5.5h4v6h3v-6h4L12 2z" />
                  </svg>
                </span>
                <span className="text">Upload</span>
              </button>
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
            onRowValueChanged={onRowValueChanged}
          />
        </div>
      </div>
    </div>
  );
};

export default PayrollManagement;
