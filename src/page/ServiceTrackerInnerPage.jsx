import { ArrowLeft, Upload } from 'lucide-react';
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule, ColumnAutoSizeModule } from 'ag-grid-community';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatedSearchBar } from '../component/AnimatedSearchBar';
import SmallSizeModal from '../component/SmallSizeModal';
import { appendExcelFile, bulkApproveAllServiceTrackerData, fetchAllInnerPageServiceTracker, fetchAllServiceTrackerSheetData, updateServiceTrackerData, uploadExcelFile } from '../api/service';
import Toggle from '../component/Toggle';
import Snackbars from '../component/Snackbars';
import DeleteModal from '../component/DeleteModal';
import Modal from '../component/Modal';
import SingleSelectTextField from '../component/MuiInputs/SingleSelectTextField';
import { decryptData } from './utils/encrypt';
import MultiSelectFilter from './dashboardDrawerGridDetailPage/MultiSelectFilter';

// Register modules
ModuleRegistry.registerModules([AllCommunityModule]);

const ServiceTrackerInnerPage = () => {
    const { trackerName, id } = useParams();
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [isEditing, setIsEditing] = useState(null);
    const [editData, setEditData] = useState(null);
    const [addData, setAddData] = useState(null);
    const [trackerId, setTrackerId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message: '',
        severityType: '',
    });
    const [current, setCurrent] = useState({
        sheet_name: '',
        sheet_id: null,
        isFilteredData: false,
        sheet_upload_type: '',
        isFileAppended: false

    });
    // // console.log(current?.sheet_name?.[0], 'sheet_name');
    const [uploadStatus, setUploadStatus] = useState("idle");
    const [serviceTrackerSheet, setServiceTrackerSheet] = useState([]);
    const [filters, setFilters] = useState({});

    const gridRef = useRef();
    const openModal = () => {
        setIsModalOpen(true);
        // setIsEditing(null);/
        setAddData(null);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(null);
        setEditData(null);
        setCurrent({ sheet_upload_type: '' })

    };

    const formattedTrackerName = trackerName.toLowerCase().replace(/\s+/g, '_');
    const currentUser = decryptData(localStorage.getItem('user_id'));
    const navigate = useNavigate();
    const defaultColDef = {
        sortable: true,
        filter: true,
        editable: true,
        headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
        flex: 1,
        filterParams: {
            maxNumConditions: 10,
        },
    };
    const SHEET_OPTIONS = [
        { _id: "bulk_upload", name: "Add Sheets" },
        { _id: "replace_sheet", name: "Replace Sheet" },
        { _id: "add_single_record", name: "Add Single Record" },
    ];
    // Handle Delete
    const handleDelete = async (userId) => {
        try {
            const rowToDelete = rowData.find((row) => row._id === userId);
            if (!rowToDelete) {
                throw new Error("Row not found for deletion.");
            }
            const deletePayload = {
                ...rowToDelete,
                is_deleted: true,
            };
            const response = await updateServiceTrackerData(userId, formattedTrackerName, deletePayload);
            const message = response?.message || "Deleted successfully";
            const updatedData = await fetchAllInnerPageServiceTracker(formattedTrackerName);
            setRowData(updatedData);
            setIsDeleteModalOpen(false);
            setIsSnackbarsOpen({
                open: true,
                message,
                severityType: 'success',
                vertical: 'top',
                horizontal: 'center'
            });
        } catch (error) {
            // console.error("Error deleting user:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete user";
            setIsSnackbarsOpen({
                open: true,
                message: errorMessage,
                severityType: 'error',
                vertical: 'top',
                horizontal: 'center'
            });
        }
    };

    // Handle Toggle
    const handleToggleChange = async (e, userId) => {
        try {
            const row = rowData.find((r) => r._id === userId);
            if (!row) throw new Error("Row not found");
            const updatedPayload = {
                ...row,
                is_active: !row.is_active,
            };
            const response = await updateServiceTrackerData(userId, formattedTrackerName, updatedPayload);
            const message = response?.message || "Status updated";
            const updatedData = await fetchAllInnerPageServiceTracker(formattedTrackerName);
            setRowData(updatedData);
            setIsSnackbarsOpen({
                open: true,
                message,
                severityType: 'success',
                vertical: 'top',
                horizontal: 'center'
            });
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || "Update failed";
            setIsSnackbarsOpen({
                open: true,
                message: errorMessage,
                severityType: 'error',
                vertical: 'top',
                horizontal: 'center'
            });
        }
    };
    const handleFilterApply = (newFilters,) => {
        setFilters(newFilters);
    };
    const filteredRowData = useMemo(() => {
        if (Object.keys(filters).length === 0) return rowData;

        return rowData.filter((row) => {
            return Object.entries(filters).every(([column, values]) => {
                return values.includes(row[column]);
            });
        });
    }, [rowData, filters]);
    // Fetch and Set Tracker Data
    const fetchAndSetTrackerData = async (trackerName, sheetName = null) => {
        try {
            const response = await fetchAllInnerPageServiceTracker(trackerName, sheetName);
            setRowData(response || []);
            const dataSample = response?.[0] || {};
            const dynamicCols = Object.keys(dataSample).map((key) => {
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
                                    <span style={{ color, fontSize: '0.8rem', fontWeight: 500 }}>
                                        {getApprovalStatusText(status)}
                                    </span>
                                </div>
                            );
                        }
                    };
                }
                if (key === 'is_active') {
                    return {
                        headerName: 'Status',
                        field: 'is_active',
                        editable: false,
                        pinned: "right",
                        valueGetter: (params) => params.data?.is_active,
                        cellRenderer: (params) => (
                            <Toggle
                                checked={!!params.value}
                                onChange={(e) => handleToggleChange(e, params.data._id)}
                            />
                        )
                    };
                }
                return {
                    headerName: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    field: key,
                    editable: key === 'file_name' || key === 'status',
                    minWidth: 150,
                };
            });
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
                        <button className="btn btn-sm" onClick={() => {
                            setEditData(params.data);
                            setTrackerId(params.data._id);
                            setIsEditing(true);
                            setIsModalOpen(true);
                            setCurrent({ sheet_upload_type: '' })
                        }}>
                            <EditIcon fontSize="small" className="action_icon" />
                        </button>
                        <button className="btn btn-sm" onClick={() => {
                            setTrackerId(params.data._id);
                            setIsDeleteModalOpen(true);
                        }}>
                            <DeleteIcon fontSize="small" className="action_icon" />
                        </button>
                    </div>
                )
            };
            setColumnDefs([...dynamicCols, actionCol]);
        } catch (error) {
            // console.error("Error fetching tracker data:", error);
        }
    };


    //    const fetchAndSetTrackerData = async (trackerName, sheetName = null) => {
    //     try {
    //         const response = await fetchAllInnerPageServiceTracker(trackerName, sheetName);
    //          // console.log("Fetched response:", response);
    //         setRowData(response || []);

    //         const dataSample = response?.[0];
    //          // console.log("dataSample:", dataSample);

    //         if (!dataSample || Object.keys(dataSample).length === 0) {
    //             setColumnDefs([]);
    //             return;
    //         }

    //         const dynamicCols = Object.keys(dataSample).map(key => {
    //             // Simplified columns for debug:
    //             return {
    //                 headerName: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    //                 field: key,
    //                 editable: false,
    //                 minWidth: 150,
    //             };
    //         });

    //         const actionCol = {
    //             headerName: 'Actions',
    //             field: 'actions',
    //             pinned: 'left',
    //             width: 130,
    //             cellStyle: { backgroundColor: 'rgb(252 229 205 / 64%)' },
    //             filter: false,
    //             editable: false,
    //             cellRenderer: (params) => (
    //                 <div className="d-flex gap-2">
    //                     <button className="btn btn-sm" onClick={() => {
    //                         setEditData(params.data);
    //                         setTrackerId(params.data._id);
    //                         setIsEditing(true);
    //                         setIsModalOpen(true);
    //                     }}>
    //                         <EditIcon fontSize="small" className="action_icon" />
    //                     </button>
    //                     <button className="btn btn-sm" onClick={() => {
    //                         setTrackerId(params.data._id);
    //                         setIsDeleteModalOpen(true);
    //                     }}>
    //                         <DeleteIcon fontSize="small" className="action_icon" />
    //                     </button>
    //                 </div>
    //             )
    //         };

    //         setColumnDefs([...dynamicCols, actionCol]);
    //          // console.log("ColumnDefs set:", [...dynamicCols, actionCol]);
    //     } catch (error) {
    //         // console.error("Error fetching tracker data:", error);
    //         setColumnDefs([]);
    //     }
    // };

    const handleAddSingleRecord = () => {
        setIsEditing(false);

        if (rowData.length > 0) {
            const emptyObj = {};
            Object.keys(rowData[0]).forEach((key) => {
                emptyObj[key] = '';
            });
            setAddData(emptyObj);
        }

        setIsModalOpen(true);
    };

    const handleReplaceSheet = () => {
        openModal();
    };

    // Handle File Change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileName(file || '');
    };

    // Handle File Upload
    const handleFileUpload = async () => {
        if (!fileName) {
            alert("Please select a file.");
            return;
        }
        const metadata = {
            bo_user_id: currentUser,
            tracker_name: trackerName,
        };
        const fileUpload = current?.isFileAppended ? appendExcelFile : uploadExcelFile
        try {
            setUploadStatus("pending");
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: "Uploading file...",
                severityType: 'info',
            });
            const result = await fileUpload([fileName], metadata);
            setUploadStatus("success");
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: result?.message,
                severityType: 'success',
            });
            const response = await fetchAllInnerPageServiceTracker(formattedTrackerName);
            setRowData(response || []);
            await fetchAndSetTrackerData(formattedTrackerName);
            setIsModalOpen(false);
        } catch (error) {
            setUploadStatus("error");
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: error?.response?.data?.message || "Upload failed.",
                severityType: 'error',
            });
        }

    };

    // Handle Approve All
    const handleApproveAll = async () => {
        try {
            const response = await bulkApproveAllServiceTrackerData(formattedTrackerName);
            const message = response?.message || "Status updated successfully";
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message,
                severityType: 'success',
            });
            const responseData = await fetchAllInnerPageServiceTracker(formattedTrackerName);
            setRowData(responseData || []);
            await fetchAndSetTrackerData(formattedTrackerName);
        } catch (error) {
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: error?.response?.data?.message || "Approval failed.",
                severityType: 'error',
            });
        }
    };

    // Handle Edit Submission
    const handleEditSubmit = async () => {
        try {
            const response = await updateServiceTrackerData(trackerId, formattedTrackerName, editData);
            const message = response?.message || "Tracker updated successfully";
            const updatedData = await fetchAllInnerPageServiceTracker(formattedTrackerName);
            setRowData(updatedData);
            setIsSnackbarsOpen({
                open: true,
                message,
                severityType: 'success',
                vertical: 'top',
                horizontal: 'center'
            });
        } catch (error) {
            setIsSnackbarsOpen({
                open: true,
                message: error?.response?.data?.message,
                severityType: 'error',
                vertical: 'top',
                horizontal: 'center'
            });
            setIsModalOpen(false);
            setIsEditing(false);
            setEditData(null);
        }
    };
    const handleAddSubmit = async () => {
        try {
            const response = await updateServiceTrackerData(
                null, // backend naya record create karega
                formattedTrackerName,
                addData
            );

            const message = response?.message || 'Record added successfully';

            const updatedData = await fetchAllInnerPageServiceTracker(formattedTrackerName);
            setRowData(updatedData);

            setIsSnackbarsOpen({
                open: true,
                message,
                severityType: 'success',
                vertical: 'top',
                horizontal: 'center',
            });

            closeModal();
            setIsEditing(false);
            setEditData(null);
        } catch (error) {
            setIsSnackbarsOpen({
                open: true,
                message: error?.response?.data?.message || 'Failed to add record',
                severityType: 'error',
                vertical: 'top',
                horizontal: 'center',
            });
        }
    };

    // Handle Edit Input Change
    const handleEditChange = (e, key) => {
        setEditData({ ...editData, [key]: e.target.value });
    };
    const handleAddChange = (e, key) => {
        setAddData({
            ...addData,
            [key]: e.target.value,
        });
    };

    const onRowValueChanged = (event) => {
        //  // console.log('Row updated:', event.data);
    };

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setGridOption(
            'quickFilterText',
            document.getElementById('filter-text-box').value
        );
    }, []);

    const deleteModal = () => (
        <div>
            <div className='delete_message p-4'>
                Are you sure you want to delete <DeleteIcon className='action_icon' /> this tracker?
            </div>
            <div className="row row-gap-2 mt-4">
                <div className='col-6'>
                    <button type="button" className="btn-sm btn btn-secondary" onClick={closeModal}>
                        <span className='button-style'>Cancel</span>
                    </button>
                </div>
                <div className='col-6 d-flex justify-content-end'>
                    <button type="submit" className="btn-sm btn btn-primary" onClick={() => handleDelete(trackerId)}>
                        Yes, I'm sure
                    </button>
                </div>
            </div>
        </div>
    );

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
                    <button type="submit" className="btn btn-primary w-100" disabled={uploadStatus === "pending"} onClick={handleFileUpload}>Upload</button>
                </div>
            </div>
        </div>
    );
    const editServiceTracker = () => (
        <div className="p-3">
            <div className="mb-3">
                {editData &&
                    Object.keys(editData).map((key) => {
                        // Skip certain fields
                        if (
                            [
                                '_id',
                                'created_at',
                                'updated_at',
                                'deleted_at',
                                'deleted_by',
                                'is_deleted',
                                'is_active',
                            ].includes(key)
                        ) {
                            return null;
                        }

                        // Format label by replacing underscores and capitalizing words
                        const label = key
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase());

                        // Determine if the field should be disabled
                        const isDisabled = [
                            // 'approval_status',
                            'approval_status_by_karma',
                            'approved_by',
                            'approved_at',
                            'created_by',
                            'updated_by',
                        ].includes(key);

                        // Render select dropdown for approval_status
                        if (key === 'approval_status') {
                            return (
                                <div key={key} className="mb-3">
                                    <label className="form-label">{label}</label>
                                    <select
                                        className="form-select"
                                        value={editData[key] || ''}
                                        onChange={(e) => handleEditChange(e, key)}
                                        disabled={isDisabled}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="0">Pending</option>
                                        <option value="1">Approved</option>
                                    </select>
                                </div>
                            );
                        }

                        // Render input for other fields
                        return (
                            <div key={key} className="mb-3">
                                <label className="form-label">{label}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editData[key] || ''}
                                    onChange={(e) => handleEditChange(e, key)}
                                    disabled={isDisabled}
                                />
                            </div>
                        );
                    })}
            </div>
            <div className="row row-gap-2">
                <div className="col-12 col-md-6">
                    <button
                        type="button"
                        className="btn btn-secondary w-100"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                </div>
                <div className="col-12 col-md-6">
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        onClick={handleEditSubmit}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
    const serviceTrackerForm = ({ formData, onChange, onSubmit }) => (
        <div className="p-3">
            <div className="mb-3">
                {formData &&
                    Object.keys(formData).map((key) => {
                        if (
                            [
                                '_id',
                                'created_at',
                                'updated_at',
                                'deleted_at',
                                'deleted_by',
                                'is_deleted',
                                'is_active',
                            ].includes(key)
                        ) {
                            return null;
                        }

                        const label = key
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase());

                        const isDisabled =
                            isEditing &&
                            [
                                'approval_status_by_karma',
                                'approved_by',
                                'approved_at',
                                'created_by',
                                'updated_by',
                            ].includes(key);

                        if (key === 'approval_status') {
                            return (
                                <div key={key} className="mb-3">
                                    <label className="form-label">{label}</label>
                                    <select
                                        className="form-select"
                                        value={formData[key] || ''}
                                        onChange={(e) => onChange(e, key)}
                                        disabled={isDisabled}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="0">Pending</option>
                                        <option value="1">Approved</option>
                                    </select>
                                </div>
                            );
                        }

                        return (
                            <div key={key} className="mb-3">
                                <label className="form-label">{label}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData[key] || ''}
                                    onChange={(e) => onChange(e, key)}
                                    disabled={isDisabled}
                                />
                            </div>
                        );
                    })}
            </div>

            <div className="row row-gap-2">
                <div className="col-12 col-md-6">
                    <button
                        type="button"
                        className="btn btn-secondary w-100"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                </div>
                <div className="col-12 col-md-6">
                    <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={onSubmit}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );

    const getRoleColorForFileStatus = (status) => {
        switch (status) {
            case 0: return { color: 'orange' };
            case 1: return { color: 'green' };
            default: return { color: 'gray' };
        }
    };

    // previous code
    //    useEffect(() => {
    //         if (formattedTrackerName && current?.sheet_name)  {
    //             fetchAndSetTrackerData(formattedTrackerName, current.sheet_name);
    //         }
    //     }, [formattedTrackerName, current?.sheet_name]);

    // last updated code
    useEffect(() => {
        if ((formattedTrackerName && current?.sheet_name) || rowData.length > 0) {
            fetchAndSetTrackerData(formattedTrackerName, current.sheet_name);
        }
    }, [formattedTrackerName, current?.sheet_name, rowData.length > 0]);



    useEffect(() => {
        const fetchData = async () => {
            const [serviceTrackerInnerPageData, serviceTrackerSheetResult] = await Promise.allSettled([
                fetchAllInnerPageServiceTracker(formattedTrackerName, current?.sheet_name),
                fetchAllServiceTrackerSheetData(formattedTrackerName)
            ]);

            // Set sheet data
            if (serviceTrackerSheetResult.status === 'fulfilled') {
                const sheets = serviceTrackerSheetResult.value;
                setServiceTrackerSheet(sheets);

                // If no sheet is selected yet, default to the first one
                if (!current?.sheet_name && sheets?.length > 0) {
                    const firstSheet = sheets[0];
                    setCurrent({
                        sheet_name: firstSheet.name,
                        sheet_id: firstSheet.id || null,
                        isFilteredData: true,
                    });

                    try {
                        const filterUpdateData = await fetchAllInnerPageServiceTracker(
                            formattedTrackerName,
                            firstSheet.name
                        );
                        setRowData(filterUpdateData);
                    } catch (error) {
                        // console.error("Error fetching default sheet data:", error);
                    }

                    return; // Skip rest of the function because default sheet already handled
                }
            } else {
                // console.warn("fetchAllServiceTrackerSheet failed:", serviceTrackerSheetResult.reason);
            }

            // Fetch data only if not filtered and the sheet name is already set
            if (serviceTrackerInnerPageData.status === 'fulfilled' && current?.isFilteredData === false) {
                setRowData(serviceTrackerInnerPageData.value);
            } else if (serviceTrackerInnerPageData.status === 'rejected') {
                // console.warn("fetchAllServiceTrackerInnerPage failed:", serviceTrackerInnerPageData.reason);
            }
        };

        fetchData();
    }, [current]);

    const onFilterOpened = (params) => {
        // console.log("Filter opened");
        const field = params.column.getColId();

        const rowData = [];

        params.api.forEachNode((node) => {
            if (node.data && node.data[field] !== undefined) {
                rowData.push(node.data[field]);
            }
        });

        const uniqueValues = [...new Set(rowData)];

        // console.log({ [field]: uniqueValues });

        const filterComponent = document.querySelectorAll('.ag-filter')

        const filterDiv = document.createElement('div');

        filterDiv.style.padding = '10px';
        filterDiv.innerHTML = `
            <div><strong>Unique Values:</strong></div>
            <div style="max-height: 150px; overflow-y: auto;">
                ${uniqueValues.map(value => `
                    <div>
                        <label style="display:flex; align-items:center; gap:6px;">
                            <input type="checkbox" value="${value}" class="form-check-input"/>
                            <span>${value}</span>
                        </label>
                    </div>
                `).join('')}
            </div>
        `;

        filterComponent[0].appendChild(filterDiv);

        const checkboxes = filterDiv.querySelectorAll('.form-check-input');

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const checkedValues = Array.from(filterDiv.querySelectorAll('.form-check-input:checked')).map(checkbox => checkbox.value);
                const filterInput = filterComponent[0].querySelectorAll('input[type="text"]');

                const conditions = checkedValues.map(val => ({
                    filterType: 'text',
                    type: 'equals',
                    filter: val
                }));

                if (conditions.length > 0) {
                    gridRef.current.api.setFilterModel({
                        [field]: {
                            filterType: 'text',
                            operator: 'OR',
                            conditions: conditions
                        }
                    });
                } else {
                    // clear filter if nothing selected
                    gridRef.current.api.setFilterModel(null);
                }

                gridRef.current.api.onFilterChanged();

                // gridRef.current.api.setFilterModel({
                //     ...gridRef.current.api.getFilterModel(),
                //     [field]: {
                //         type: 'set',
                //         filter: checkedValues,
                //     }
                // });
                // gridRef.current.api.onFilterChanged();
            });
        });
    };
    const getCrudForm = () => {
        if (isEditing) {
            return editServiceTracker;
        }

        if (addData) {
            return () =>
                serviceTrackerForm({
                    formData: addData,
                    onChange: handleAddChange,
                    onSubmit: handleAddSubmit,
                });
        }

        if (
            current?.sheet_upload_type === 'Replace Sheet' ||
            current?.sheet_upload_type === 'Add Sheets'
        ) {
            return fileUploadForm;
        }

        return null;
    };

    return (
        <div>
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} uploadStatus={uploadStatus} />
            <DeleteModal deleteForm={deleteModal} deleteTitle='Delete Tracker' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />
            <SmallSizeModal
                crudForm={getCrudForm()}
                crudTitle={
                    isEditing
                        ? 'Edit Tracker'
                        : addData
                            ? 'Add Tracker'
                            : 'Upload File'
                }
                isEditing={isEditing}
                editCrudTitle="Edit Tracker"
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                closeModal={closeModal}
            />

            <div className='service-tracker-inner-page-header d-lg-flex d-md-flex align-items-center'>
                <div className="notification-page-title">
                    <button
                        className="back-button"
                        onClick={() => navigate("/service_trackers")}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>{trackerName}</h1>
                    </div>
                </div>
                <div className='d-lg-flex d-md-flex gap-2 mt-2'>
                    <div style={{ width: '250px' }}>
                        <SingleSelectTextField
                            name="sheet_upload_type"
                            label="Sheet Upload"
                            value={current?.sheet_upload_type || ''}
                            onChange={(e) => {
                                const selectSheetType = e.target.value;
                                setCurrent((prev) => ({
                                    ...prev,
                                    sheet_upload_type: selectSheetType,
                                    isFilteredData: !!selectSheetType,
                                    isFileAppended: e.target.value === "Add Sheets" ? true : false
                                }));

                                if (selectSheetType === "Replace Sheet" || selectSheetType === "Add Sheets") {
                                    handleReplaceSheet();
                                }

                                if (selectSheetType === "Add Single Record") {
                                    handleAddSingleRecord();
                                }

                            }}
                            names={SHEET_OPTIONS}
                        />

                    </div>
                    {/* <button
                        className="w-100 mb-2 justify-content-center reject upload-wrapper upload-label mt-lg-2 mt-md-2"
                        onClick={() => {
                            setIsEditing(false);

                            // editData se keys le kar empty object banana
                            if (rowData.length > 0) {
                                const emptyObj = {};
                                Object.keys(rowData[0]).forEach((key) => {
                                    emptyObj[key] = '';
                                });
                                setAddData(emptyObj);
                            }

                            setIsModalOpen(true);
                        }}
                    >
                        <span className="text" style={{ whiteSpace: 'nowrap' }}>Add Record</span>
                    </button> */}

                    {/* <button className="w-100 mb-2 justify-content-center reject upload-wrapper upload-label" onClick={openModal}>
                        <Upload size={20} />
                        <span className="text">Upload</span>
                    </button> */}
                    <div className='btn-wrap-div mt-lg-2 mt-md-2'>
                        <button className="button approve w-100 justify-content-center" onClick={handleApproveAll}>
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
                <div className="table_div p-3">
                    <div className='d-lg-flex d-md-flex  justify-content-between'>
                        <div className='d-flex'>
                            <AnimatedSearchBar placeholder="Search..." type="text" id="filter-text-box" onInput={onFilterTextBoxChanged} />
                            <div className='ps-3 mt-1'>
                                <MultiSelectFilter
                                    rowData={rowData}
                                    filterColumns={rowData.length > 0 ? Object.keys(rowData[0]) : []}
                                    onFilterApply={handleFilterApply}
                                />
                            </div>

                        </div>

                        <div style={{ width: '250px' }}>
                            <SingleSelectTextField
                                name="sheet_name"
                                label="Sheet Name"
                                value={current?.sheet_name || ''}
                                onChange={async (e) => {
                                    const selectedName = e.target.value;
                                    setCurrent((prev) => ({
                                        ...prev,
                                        sheet_name: selectedName,
                                        isFilteredData: !!selectedName,
                                    }));

                                    try {
                                        // Call fetchAndSetTrackerData with selectedName filter
                                        await fetchAndSetTrackerData(formattedTrackerName, selectedName || null);
                                    } catch (error) {
                                        // console.error("Error fetching service tracker data:", error);
                                    }
                                }}
                                names={
                                    serviceTrackerSheet?.map((data) => ({
                                        _id: data?.name,
                                        name: data?.name
                                    })) || []
                                }
                            />
                        </div>

                    </div>
                    <div className="ag-theme-quartz" style={{ height: '600px', width: '100%', marginTop: '1rem' }}>
                        <AgGridReact
                            theme="legacy"
                            ref={gridRef}
                            rowData={filteredRowData || []}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            editType="fullRow"
                            rowSelection="single"
                            pagination={true}
                            onFilterOpened={onFilterOpened}
                            onRowValueChanged={onRowValueChanged}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceTrackerInnerPage;