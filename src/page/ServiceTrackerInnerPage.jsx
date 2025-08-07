import { ArrowLeft, Upload } from 'lucide-react';
import AddIcon from '@mui/icons-material/Add';
import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import Modal from '../component/Modal';
import AgGridSearchBar from '../component/MuiInputs/AgGridSearchBar';
import MonthYearCalander from '../component/MonthYearCalander';

// Register modules
ModuleRegistry.registerModules([AllCommunityModule]);
import { useParams } from 'react-router-dom';
import { AnimatedSearchBar } from '../component/AnimatedSearchBar';
import SmallSizeModal from '../component/SmallSizeModal';
import { fetchAllInnerPageServiceTracker, uploadExcelFile } from '../api/service';
import Toggle from '../component/Toggle';

const ServiceTrackerInnerPage = () => {
    const { trackerName, id } = useParams();
    console.log(trackerName, 'trackerName', id, 'id');

    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const gridRef = useRef();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const formattedTrackerName = trackerName.toLowerCase().replace(/\s+/g, '_');

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

    const handleFileUpload = async () => {
        if (!fileName) {
            alert("Please select a file.");
            return;
        }
        const metadata = {
            bo_user_id: '68919bb2e086be682a73a131',
            tracker_name: trackerName,
        };
        try {
            const result = await uploadExcelFile([fileName], metadata);
            console.log("File uploaded successfully:", result);
            setIsModalOpen(false);
            const response = await fetchAllInnerPageServiceTracker(formattedTrackerName);
            setRowData(response.data || []);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("❌ Upload failed. Please try again.");
        }
    };

    // const uploadFile = () => {
    //     const reader = new FileReader();

    //     reader.onload = (evt) => {
    //         const data = new Uint8Array(evt.target.result);
    //         const workbook = XLSX.read(data, { type: 'array' });

    //         const sheetName = workbook.SheetNames[0];
    //         if (!sheetName) {
    //             alert('The workbook does not have any sheets.');
    //             return;
    //         }

    //         const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    //         console.log(sheet,'sheet');
    //         const headers = sheet[0] || [];
    //         const rows = sheet.slice(1).map(row =>
    //             Object.fromEntries(headers.map((h, i) => [h, row?.[i] ?? '']))
    //         );

    //         const dynamicCols = headers.map(h => ({
    //             field: h,
    //             editable: true,
    //         }));
    //         const actionCol = {
    //             headerName: 'Actions',
    //             field: 'actions',
    //             filter: false,
    //             editable: false,
    //             width: 130,
    //             pinned: 'left',
    //             cellRenderer: (params) => {
    //                 return (
    //                     <>
    //                         <button
    //                             className="btn btn-sm"
    //                             onClick={() => {
    //                                 alert(`Edit row ${params.rowIndex}`);
    //                                 setIsEditing(true);
    //                             }}
    //                         >
    //                             Edit
    //                         </button>
    //                         <button
    //                             className="btn btn-sm"
    //                             onClick={() => alert(`Delete row ${params.rowIndex}`)}
    //                         >
    //                             Delete
    //                         </button>
    //                     </>
    //                 );
    //             }
    //         };

    //         setColumnDefs([actionCol, ...dynamicCols]);
    //         setRowData(rows);
    //         setIsModalOpen(false);
    //     };

    //     if (fileName) {
    //         reader.readAsArrayBuffer(fileName);
    //     } else {
    //         alert('Please select a file to upload.');
    //     }
    // };

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

    const fileUploadForm = () => (
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
                    {/* <button type="submit" className="btn btn-primary w-100" onClick={uploadFile}>Upload</button> */}
                    <button type="submit" className="btn btn-primary w-100" onClick={handleFileUpload}>Upload</button>
                </div>
            </div>
        </div>
    );

    const crudTitle = "Upload File";
    // Helper for status color
    const getRoleColorForFileStatus = (status) => {
        switch (status) {
            case 0: return { color: 'orange' };
            case 1: return { color: 'green' };
            default: return { color: 'gray' };
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchAllInnerPageServiceTracker(formattedTrackerName);
                setRowData(response.data || []);
                const dataSample = (response.data && response.data[0]) || {};
                const dynamicCols = Object.keys(dataSample).map(key => {
                    // Approval Status column
                    if (key === 'approval_status' && dataSample.approval_status !== undefined) {
                        return {
                            field: 'approval_status',
                            headerName: 'Approval Status',
                            editable: false,
                            headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
                            filter: true,
                            minWidth: 160,
                            valueGetter: (params) => params.data?.approval_status,
                            cellRenderer: (params) => {
                                const getApprovalStatusText = (status) => {
                                    switch (status) {
                                        case 0: return 'Pending';
                                        case 1: return 'Approved';
                                        default: return '-';
                                    }
                                };
                                const status = params.value;
                                const { color } = getRoleColorForFileStatus(status ?? 0);
                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={status === 1}
                                            readOnly
                                            style={{ cursor: 'default', width: 15, height: 15, accentColor: 'orange' }}
                                        />
                                        <span
                                            style={{
                                                color,
                                                fontSize: '0.8rem',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {getApprovalStatusText(status)}
                                        </span>
                                    </div>
                                );
                            }
                        };
                    }
                    // is_active UI column
                    if (key === 'is_active' && dataSample?.is_active !== undefined) {
                        const newLocal = 'is_active';
                        return {
                            headerName: 'Status',
                            field: newLocal,
                            editable: false,
                            pinned: "right",
                            valueGetter: (params) => params.data?.is_active,
                            cellRenderer: (params) => (
                                <Toggle
                                    checked={!!params.value}
                                // onChange={(e) => handleToggleChange(e, params)}
                                />
                            )
                        };
                    }
                    // Default column
                    return {
                        headerName: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        field: key,
                        editable: key === 'file_name' || key === 'status',
                        minWidth: 150,
                    };
                });

                // Actions column
                const actionCol = {
                    headerName: 'Actions',
                    field: 'actions',
                    pinned: "left",
                    width: 130,
                    cellStyle: { 'background-color': 'rgb(252 229 205 / 64%)' },
                    filter: false,
                    editable: false,
                    cellRenderer: (params) => (
                        <div className="d-flex gap-2">
                            <button className="btn btn-sm" onClick={() => setIsEditing(true)}>
                                <EditIcon fontSize="small" className="action_icon" />
                            </button>
                            <button className="btn btn-sm" onClick={() => alert('Delete action')}>
                                <DeleteIcon fontSize="small" className="action_icon" />
                            </button>
                        </div>
                    )
                };

                setColumnDefs([...dynamicCols, actionCol]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);



    return (
        <div>
            <div className='service-tracker-inner-page-header d-lg-flex d-md-flex'>
                <div className="notification-page-title">
                    <button className="back-button"
                    // onClick={onBack}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>{trackerName}</h1>
                    </div>
                    <div>

                    </div>
                </div>
                <div className='d-lg-flex d-md-flex gap-2 mt-2'>
                    <button className="w-100 mb-2 justify-content-center reject upload-wrapper upload-label" onClick={openModal}>
                        <Upload size={20} />
                        <span className="text">Upload</span>
                    </button>
                    <div className='btn-wrap-div'>

                        <button className="button approve w-100 justify-content-center">
                            <span className="icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12 3.41 13.41 9 19 21 7 19.59 5.59z" />
                                </svg>
                            </span>
                            <span className="text">Approve</span>
                        </button>
                    </div>
                </div>

            </div>

            <div className="client-onboarding-2">
                <SmallSizeModal crudForm={fileUploadForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle="Edit Uploaded File" isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} closeModal={closeModal} />
                {/* <Modal crudForm={crudForm} crudTitle={crudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} closeModal={closeModal} /> */}
                <div className="table_div p-3">
                    <AnimatedSearchBar placeholder="Search..." type="text" id="filter-text-box" onInput={onFilterTextBoxChanged} />
                    {/* <div className="d-lg-flex d-md-flex justify-content-between">
                        <div className="search-bar-container h-25">
                            <AgGridSearchBar label="Search..." type="text" id="filter-text-box" onInput={onFilterTextBoxChanged} />
                            <button className="search-icon"><SearchIcon /></button>
                        </div>
                    </div> */}

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
        </div>


    )
}

export default ServiceTrackerInnerPage