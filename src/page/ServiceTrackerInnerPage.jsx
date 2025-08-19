import { ArrowLeft, Upload } from 'lucide-react';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register modules
ModuleRegistry.registerModules([AllCommunityModule]);
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatedSearchBar } from '../component/AnimatedSearchBar';
import SmallSizeModal from '../component/SmallSizeModal';
import { bulkApproveAllServiceTrackerData, fetchAllInnerPageServiceTracker, updateServiceTrackerData, uploadExcelFile } from '../api/service';
import Toggle from '../component/Toggle';
import Snackbars from '../component/Snackbars';
import DeleteModal from '../component/DeleteModal';

const ServiceTrackerInnerPage = () => {
    const { trackerName, id } = useParams();
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);
    // console.log(columnDefs, 'columnDefs')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [trackerId, setTrackerId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    console.log(isDeleteModalOpen, isModalOpen, 'isDeleteModalOpen')
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message: '',
        severityType: '',
    });
    const gridRef = useRef();
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const formattedTrackerName = trackerName.toLowerCase().replace(/\s+/g, '_');
    const currentUser = localStorage.getItem('user_id');
    const defaultColDef = {
        sortable: true,
        filter: true,
        editable: true,
        headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
        flex: 1,
    };

    // Handle Delete
    const handleDelete = async (userId) => {
        try {
            // Find the full data row for the given userId
            const rowToDelete = rowData.find((row) => row._id === userId);
            if (!rowToDelete) {
                throw new Error("Row not found for deletion.");
            }
            // Add delete-related fields dynamically
            const deletePayload = {
                ...rowToDelete,
                is_deleted: true,
            };

            // Send the updated object to the backend
            const response = await updateServiceTrackerData(userId, formattedTrackerName, deletePayload);

            const message = response?.message || "Deleted successfully";

            // Refresh the data
            const updatedData = await fetchAllInnerPageServiceTracker(formattedTrackerName);
            setRowData(updatedData);
            setIsDeleteModalOpen(false);

            // Show success notification
            setIsSnackbarsOpen({
                open: true,
                message,
                severityType: 'success',
                vertical: 'top',
                horizontal: 'center'
            });

        } catch (error) {
            console.error("Error deleting user:", error);

            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete user";

            setIsSnackbarsOpen({
                open: true,
                message: errorMessage,
                severityType: 'error',
                vertical: 'top',
                horizontal: 'center'
            });
        }
    };
    // console.log(rowData, 'rowData')
    const handleToggleChange = async (e, userId) => {
        try {
            const row = rowData.find((r) => r._id === userId);
            console.log(row, userId, rowData, 'row')
            if (!row) throw new Error("Row not found");

            const updatedPayload = {
                ...row,
                is_active: !row.is_active, // toggle the value
                // updated_by: localStorage.getItem("user_id"),
                // updated_at: new Date().toISOString()
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

    // const handleToggleChange = async (e, tracker_id) => {
    //     const rowToToggleUpdate = rowData.find((row) => row._id === tracker_id);
    //     if (!rowToToggleUpdate) {
    //         throw new Error("Row not found for toggle update.");
    //     }
    //     const newIsActive = {
    //         ...rowToToggleUpdate,
    //         "IsActive": e.target.checked
    //     };
    //     try {
    //         const response = await updateServiceTrackerData(tracker_id, formattedTrackerName, newIsActive);

    //         const message = response?.message || "Status update successfully"
    //         // Show success snackbar
    //         setIsSnackbarsOpen({
    //             ...issnackbarsOpen,
    //             open: true,
    //             message,
    //             severityType: 'success',
    //         });
    //     } catch (error) {
    //         // console.error("Error:", error);
    //         const errorMessage =
    //             error?.response?.data?.message ||
    //             error?.message ||
    //             "Failed to update user sataus";

    //         // Show error snackbar
    //         setIsSnackbarsOpen({
    //             ...issnackbarsOpen,
    //             open: true,
    //             message: errorMessage,
    //             severityType: 'error',
    //         });
    //     }
    //     const updatedData = await fetchAllInnerPageServiceTracker(formattedTrackerName);

    //     setData(updatedData);
    // };
    // const handleDelete = async (userId) => {

    //     try {
    //         const response = await updateServiceTrackerData(userId);
    //         const message = response?.message || "User deleted successfully";

    //         // Refresh data
    //         const updatedData = await fetchAllInnerPageServiceTracker(trackerName);
    //         setRowData(updatedData);
    //         setIsDeleteModalOpen(false);

    //         // Show success snackbar
    //         setIsSnackbarsOpen({
    //             ...issnackbarsOpen,
    //             open: true,
    //             message,
    //             severityType: 'success',
    //         });
    //     } catch (error) {
    //         console.error("Error deleting user:", error);

    //         // Extract error message safely
    //         const errorMessage =
    //             error?.response?.data?.message ||
    //             error?.message ||
    //             "Failed to delete user";

    //         // Show error snackbar
    //         setIsSnackbarsOpen({
    //             ...issnackbarsOpen,
    //             open: true,
    //             message: errorMessage,
    //             severityType: 'error',
    //         });
    //     }
    // };
    const fetchAndSetTrackerData = async (trackerName) => {
        try {
            const response = await fetchAllInnerPageServiceTracker(trackerName);
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
                        <button className="btn btn-sm" onClick={() => setIsEditing(true)}>
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
            console.error("Error fetching tracker data:", error);
        }
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
            bo_user_id: currentUser,
            tracker_name: trackerName,
        };
        try {
            const result = await uploadExcelFile([fileName], metadata);
            // console.log("File uploaded successfully:", result);
            const response = await fetchAllInnerPageServiceTracker(formattedTrackerName);
            setRowData(response || []);
            await fetchAndSetTrackerData(formattedTrackerName);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("❌ Upload failed. Please try again.");
        }
    };
    const handleApproveAll = async () => {
        try {
            const response = await bulkApproveAllServiceTrackerData(formattedTrackerName);
            const message = response?.message || "Status update successfully"
            // Show success snackbar
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message,
                severityType: 'success',
            });
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to update user sataus";

            // Show error snackbar
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: errorMessage,
                severityType: 'error',
            });
        }
        const response = await fetchAllInnerPageServiceTracker(formattedTrackerName);
        setRowData(response || []);
        await fetchAndSetTrackerData(formattedTrackerName);
        // setData(updatedData);
        // try {
        //     const response = await bulkApproveAllServiceTrackerData(formattedTrackerName);
        //     // Handle the response as needed
        // } catch (error) {
        //     console.error("Error approving all service tracker data:", error);
        // }
    };

    const onRowValueChanged = (event) => {
        // console.log('Row updated:', event.data);
    };

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setGridOption(
            'quickFilterText',
            document.getElementById('filter-text-box').value
        );
    }, []);

    const deleteModal = () => {
        return (
            <div>
                <div className='delete_message p-4'>
                    Are you sure you want to delete <DeleteIcon className='action_icon' /> this tracker?
                </div>

                <div className="row row-gap-2 mt-4">
                    <div className='col-6'>
                        <button type="button" className="btn-sm btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col-6 d-flex justify-content-end'>
                        <button type="submit"
                            className="btn-sm btn btn-primary"
                            onClick={() => handleDelete(trackerId)}>Yes, I'm sure</button>
                    </div>
                </div>
            </div>
        )

    }
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
        if (formattedTrackerName) {
            fetchAndSetTrackerData(formattedTrackerName);
        }
    }, [formattedTrackerName]);

    const navigate = useNavigate();

    return (
        <div>
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
            <DeleteModal deleteForm={deleteModal} deleteTitle='Delete Tracker' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />
            <SmallSizeModal crudForm={fileUploadForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle="Edit Uploaded File" isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} closeModal={closeModal} />
            <div className='service-tracker-inner-page-header d-lg-flex d-md-flex'>
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
                    <div>
                    </div>
                </div>
                <div className='d-lg-flex d-md-flex gap-2 mt-2'>
                    <button className="w-100 mb-2 justify-content-center reject upload-wrapper upload-label" onClick={openModal}>
                        <Upload size={20} />
                        <span className="text">Upload</span>
                    </button>
                    <div className='btn-wrap-div'>
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
                    <AnimatedSearchBar placeholder="Search..." type="text" id="filter-text-box" onInput={onFilterTextBoxChanged} />
                    <div className="ag-theme-quartz" style={{ height: '600px', width: '100%', marginTop: '1rem' }}>
                        <AgGridReact
                            theme="legacy"
                            ref={gridRef}
                            rowData={rowData || []}
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