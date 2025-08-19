
import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../style/useRole.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '../component/Modal';
import MuiTextField from '../component/MuiInputs/MuiTextField';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import MultipleSelectFields from '../component/MuiInputs/MultipleSelectFields';
import MuiSearchBar from '../component/MuiInputs/MuiSearchBar';
import SmallSizeModal from '../component/SmallSizeModal';
import SingleSelectTextField from '../component/MuiInputs/SingleSelectTextField';
import MuiTextAreaField from '../component/MuiInputs/MuiTextAreaField';
import { bulkApproveAllPageData, createModule, deleteModuleById, fetchAllModule, updateModuleById, updateModuleStatusById } from '../api/service';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import DeleteModal from '../component/DeleteModal';
import Snackbars from '../component/Snackbars';
import Toggle from '../component/Toggle';
import { AnimatedSearchBar } from '../component/AnimatedSearchBar';
ModuleRegistry.registerModules([AllCommunityModule]);

const dummuJsonData = [
    {
        id: 1744096161424,
        module_name: "Tata",
        module_description: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin"
    },
    {
        id: 1744096161425,
        module_name: "Tata",
        module_description: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin"
    },
    {
        id: 1744096161426,
        module_name: "Tata",
        module_description: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin"
    },
    {
        id: 1744096161427,
        module_name: "Tata",
        module_description: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin"
    },
    {
        id: 1744096161428,
        module_name: "Tata",
        module_description: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin"
    },
    {
        id: 1744096161429,
        module_name: "Tata",
        module_description: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin"
    },
];

const Module = () => {
    // const [data, setData] = useState([]);
    // if you want to show dummy jason data 
    const [data, setData] = useState(dummuJsonData);
    const [current, setCurrent] = useState({ module_name: '', module_description: '', });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [moduleId, setModuleId] = useState(null)
    console.log(moduleId, 'moduleId')
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message: '',
        severityType: '',
    });
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // You can adjust the number of items per page
    const [errors, setErrors] = useState({});


    const validate = () => {
        let tempErrors = {};
        if (!current?.module_name) tempErrors.module_name = "Module name is required";
        if (!current?.module_description) tempErrors.module_description = "Description is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrent((prev) => ({ ...prev, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };
    const handleApproveAll = async () => {
        try {
            const response = await bulkApproveAllPageData('module');
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
                "Failed to update module status";

            // Show error snackbar
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: errorMessage,
                severityType: 'error',
            });
        }
        const updatedData = await fetchAllUser();
        setData(updatedData);
    };
    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!validate()) return; // Don't proceed if validation fails
        const payload = {
            "ModuleName": current.module_name,
            "ModuleDescription": current.module_description,
            "CommonAttributes": {
                "Created_By": "68480959d7038d326905b02c"
            }
        };

        try {
            let response;
            if (isEditing) {
                // Update existing company
                response = await updateModuleById(moduleId, {
                    "ModuleName": current.module_name,
                    "ModuleDescription": current.module_description,
                    "CommonAttributes": {
                        "Updated_By": "68480959d7038d326905b02c"
                    }
                });
            } else {
                // Create new company
                response = await createModule(payload);
            }

            // ✅ Get the message from response
            const message = response?.message;
            // Set snackbar with message
            // setSnackbarMessage(message); // You'll need this state
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'success' });

            // Refresh data
            const updatedData = await fetchAllModule();
            setData(updatedData);
        } catch (error) {
            // console.error("Error saving company:", error);
            // setSnackbarMessage("Failed to save company");
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'error' });
        }

        // Reset form state
        setCurrent({
            _id: null,
            module_name: '', module_description: '', created_at: '', location: '', updated_at: '', desc: '', approved_by: ''
        });

        setIsEditing(false);
        setIsModalOpen(false);
    };

    const handleDelete = async (moduleId) => {
        try {
            const response = await deleteModuleById(moduleId);
            const message = response?.message || "Module deleted successfully";

            // Refresh data
            const updatedData = await fetchAllModule();
            setData(updatedData);
            setIsDeleteModalOpen(false);

            // Show success snackbar
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message,
                severityType: 'success',
            });
        } catch (error) {
            // console.error("Error deleting company:", error);

            // Extract error message safely
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete Module";

            // Show error snackbar
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: errorMessage,
                severityType: 'error',
            });
        }
    };

    // Pagination Logic: Slicing the data to display on the current page

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setErrors({})
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locationData] = await Promise.all([
                    fetchAllModule(),

                ]);
                setData(locationData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const crudForm = () => {
        return (
            <div>
                <div>
                    <MuiTextField
                        label='Module Name'
                        type='text'
                        isRequired={true}
                        fieldName='module_name'
                        handleChange={handleChange}
                        value={current.module_name}
                        error={!!errors.module_name}
                        helperText={errors.module_name}
                    />
                </div>
                <div className=''>
                    <MuiTextAreaField
                        value={current.module_description}
                        handleChange={handleChange}
                        name='module_description'
                        label='Module Description'
                        error={!!errors.module_description}
                        helperText={errors.module_description}
                    />
                </div>
                <div className="row row-gap-2">
                    <div className='col-6'>
                        <button type="button" className="btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col-6 d-flex justify-content-end'>
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{isEditing ? <span className='button-style'>Save Changes</span> : <span className='button-style'>Create Module</span>}</button>
                    </div>
                </div>
            </div>
        )

    }
    const crudTitle = "Add New Module"
    const editCrudTitle = "Edit Module"
    const deleteModal = () => {
        return (
            <div>
                <div className='delete_message p-4'>
                    Are you sure you want to delete <DeleteIcon className='action_icon' /> this user role?
                </div>

                <div className="row row-gap-2 mt-4">
                    <div className='col-6'>
                        <button type="button" className="btn-sm btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col-6 d-flex justify-content-end'>
                        <button type="submit"
                            className="btn-sm btn btn-primary"
                            onClick={() => handleDelete(moduleId)}>Yes, I'm sure</button>
                    </div>
                </div>
            </div>


        )

    }

    const getRoleColor = (role) => {
        switch (role) {
            case 'Admin':
                return { background: '#d1e7dd', color: '#0f5132' }; // green
            case 'Manager':
                return { background: '#cff4fc', color: '#055160' }; // blue
            case 'Client':
                return { background: '#fce5cd', color: '#7f4f24' }; // brown
            case 'Super Admin':
                return { background: '#f8d7da', color: '#842029' }; // red
            default:
                return { background: '#e2e3e5', color: '#41464b' }; // gray
        }
    };

    const handleToggleChange = async (e, params) => {
        const newIsActive = {
            "IsActive": e.target.checked
        };
        try {
            const response = await updateModuleStatusById(params.data._id, newIsActive);
            const message = response?.message || "Status update successfully"
            // Show success snackbar
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message,
                severityType: 'success',
            });
        } catch (error) {
            // console.error("Error:", error);
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete company";

            // Show error snackbar
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: errorMessage,
                severityType: 'error',
            });
        }
        const updatedData = await fetchAllModule();
        setData(updatedData);
    };


    const colDefs = [
        {
            headerName: 'Actions',
            field: 'actions',
            filter: false,
            editable: false,
            width: 130,
            flex: 1,
            pinned: "left",
            cellStyle: { 'background-color': 'rgb(252 229 205 / 64%)' },
            cellRenderer: (params) => {
                return (
                    <div className="d-flex justify-content-around align-items-center">

                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                setCurrent(params.data);
                                setIsEditing(true);
                                setIsModalOpen(true);
                                setModuleId(params.data._id); // OR .user_id based on your data
                            }}
                        >
                            <EditIcon fontSize="small" className="action_icon" />
                        </button>
                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                setModuleId(params.data._id);
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            <DeleteIcon fontSize="small" className="action_icon" />
                        </button>
                        {/* <button
                            className="btn btn-sm"
                            onClick={() => {
                                setModuleId(params.data._id);
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            <VisibilityIcon fontSize="small" className="action_icon" />
                        </button> */}
                        {/* <VisibilityIcon/> */}
                    </div>
                );
            }
        }
        ,

        { field: '_id', headerName: 'ID', flex: 1, editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        {
            field: 'approved_by', headerName: 'approved by', flex: 1, editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true,
            cellRenderer: (params) => {
                const { background, color } = getRoleColor(params.value);
                return (
                    <span
                        style={{
                            //   padding: '4px 12px',
                            padding: '5px 12px',
                            backgroundColor: background,
                            color: color,
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            //   display: 'inline-block',
                            textAlign: 'center',
                            minWidth: '60px'
                        }}
                    >
                        <span> <PermIdentityIcon style={{ width: '15', height: '15' }} className='mb-1 me-1' /></span>{params.value}<span></span>
                    </span>
                );
            }
        },
        { field: 'module_name', headerName: 'Module Name', flex: 1, editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        {
            field: 'module_description',
            headerName: 'Module Description',
            editable: true,
            filter: true,
            headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
        },


        { field: 'location', headerName: 'Location', flex: 1, editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'common_attributes.created_at', headerName: 'Created At', flex: 1, editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'common_attributes.updated_at', headerName: 'Updated At', flex: 1, editable: true, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        {
            headerName: 'Status',
            field: 'common_attributes.is_active',
            editable: false,
            pinned: "right",
            valueGetter: (params) => params.data?.common_attributes?.is_active,
            cellRenderer: (params) => (
                <Toggle
                    checked={!!params.value}
                    onChange={(e) => handleToggleChange(e, params)}
                />
            )
        }

    ];
    const gridRef = useRef();
    const defaultColDef = {
        sortable: true,
        filter: true,
        editable: true,
        headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
    };
    const onRowValueChanged = (event) => {
        console.log('Row updated:', event.data);
    };
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setGridOption(
            'quickFilterText',
            document.getElementById('filter-text-box').value
        );
    }, []);
    return (
        <div>
            <div className='service-tracker-inner-page-header d-lg-flex d-md-flex'>
                <div className="notification-page-title">
                    <div>
                        <h1>{data?.length > 1 ? "Modules" : "Module"}</h1>
                    </div>
                </div>
                <div className='d-lg-flex d-md-flex gap-2 mt-2'>
                    <button className='crud_btn w-100 mb-2' onClick={openModal}>
                        <span><AddIcon /></span> <span className='button-style'>Add New Module</span>
                    </button>
                    <div className='btn-wrap-div'>
                        <button className="button approve w-100 justify-content-center" onClick={() => handleApproveAll()}>
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
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
            <SmallSizeModal closeModal={closeModal} crudForm={crudForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            <DeleteModal deleteForm={deleteModal} deleteTitle='Delete User' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />

            <div className='table_div p-3'>
                <div className='d-lg-flex d-md-flex  justify-content-between'>
                    <AnimatedSearchBar placeholder="Search..." type="text" id="filter-text-box" onInput={onFilterTextBoxChanged} />
                    {/* <div className='d-lg-flex d-md-flex  justify-content-end mb-3'>
                        <div>
                            <button className='crud_btn w-100' onClick={openModal}>
                                <span><AddIcon /></span>
                                <span className='button-style'>Add New Module</span>
                            </button>
                        </div>

                    </div> */}
                </div>
                <div className="ag-theme-quartz" style={{ height: '600px', width: '100%', marginTop: '1rem' }}>
                    <AgGridReact
                        theme="legacy"
                        ref={gridRef}
                        rowData={data}
                        columnDefs={colDefs}
                        defaultColDef={defaultColDef}
                        editType="fullRow"
                        rowSelection="single"
                        pagination={true}
                        // rowBuffer={rowBuffer}
                        onRowValueChanged={onRowValueChanged}

                    />
                </div>
            </div>
        </div>
    );
};

export default Module;
