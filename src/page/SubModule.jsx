
import React, { useEffect, useRef, useState } from 'react';
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

import VisibilityIcon from '@mui/icons-material/Visibility';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import DeleteModal from '../component/DeleteModal';
import { createsSubModule, deleteSubModuleById, fetchAllModulesName, fetchAllSubModule, updateSubModuleById, updateSubModuleStatusById } from '../api/service';
import Snackbars from '../component/Snackbars';
import Toggle from '../component/Toggle';
ModuleRegistry.registerModules([AllCommunityModule]);

const dummuJsonData = [
    {
        id: 1744096161424,
        sub_module_name: "Tata",
        sub_module_description: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin",
        sub_module_id: ["tracker"]
    },
    {
        id: 1744096161425,
        sub_module_name: "Tata",
        sub_module_description: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin",
        sub_module_id: ["tracker"]
    },
    {
        id: 1744096161426,
        sub_module_name: "Tata",
        sub_module_description: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin",
        sub_module_id: ["tracker"]
    },
    {
        id: 1744096161427,
        sub_module_name: "Tata",
        sub_module_description: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin",
        sub_module_id: ["tracker"]
    },
    {
        id: 1744096161428,
        sub_module_name: "Tata",
        sub_module_description: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin",
        sub_module_id: ["tracker"]
    },
    {
        id: 1744096161429,
        sub_module_name: "Tata",
        sub_module_description: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin",
        sub_module_id: ["tracker"]

    },
];

const SubModule = () => {
    // const [data, setData] = useState([]);
    // if you want to show dummy jason data 
    const [data, setData] = useState(dummuJsonData);
    const [current, setCurrent] = useState({ id: null, sub_module_name: '', sub_module_description: '', created_at: '', location: "", updated_at: '', desc: '', approved_by: '', module_name: '', module_id: null });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [subModuleId, setSubModuleId] = useState(null)
    const [moduleId, setModuleId] = useState(null)
    // console.log(moduleId, subModuleId, 'subModuleId')
    const [errors, setErrors] = useState({});
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message: '',
        severityType: '',
    });
    const [moduleName, setModuleName] = useState([]);
    console.log(moduleName,'moduleName')
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // You can adjust the number of items per page


    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrent((prev) => ({ ...prev, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));

    };

    const validate = () => {
        let tempErrors = {};
        if (!current?.sub_module_name) tempErrors.sub_module_name = "Sub-Module Name is required";
        if (!current?.sub_module_description) tempErrors.sub_module_description = "Description is required";
        if (!current?.module_name) tempErrors.module_name = "Select Module Name";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!validate()) return; // Don't proceed if validation fails
        const payload = {
            "SubModuleName": current.sub_module_name,
            "SubModuleDescription": current.sub_module_description,
            ModuleID: current.module_id,
            "CommonAttributes": {
                "Created_By": "68480959d7038d326905b02c"
            }
        };

        try {
            let response;
            if (isEditing) {
                // Update existing company
                response = await updateSubModuleById(subModuleId, {
                    "SubModuleName": current.sub_module_name,
                    "SubModuleDescription": current.sub_module_description,
                    ModuleID: current.module_id,
                    "CommonAttributes": {
                        "Updated_By": "68480959d7038d326905b02c"
                    }
                });
            } else {
                // Create new company
                response = await createsSubModule(payload);
            }
            const message = response?.message;

            // ✅ Get the message from response
            // Set snackbar with message
            // setSnackbarMessage(message); // You'll need this state
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'success' });

            // Refresh data
            const updatedData = await fetchAllSubModule();
            setData(updatedData);
        } catch (error) {
            // const message = response?.message;

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
        setErrors({}); // ✅ Reset errors after submission

    };
    // Handle Delete
    // const handleDelete = (id) => {
    //     setIsDeleteModalOpen(false)
    //     const filteredData = data.filter((item) => item.id !== id);
    //     setData(filteredData);
    //     setSelectedRows(selectedRows.filter((rowId) => rowId !== id)); // Remove deleted row from selected
    // };

    const handleDelete = async (id) => {
        try {
            const response = await deleteSubModuleById(id);
            const message = response?.message || "Company deleted successfully";

            // Refresh data
            const updatedData = await fetchAllSubModule();
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
            console.error("Error deleting company:", error);

            // Extract error message safely
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
    };
    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setErrors({})
        setCurrent({})
    };
    const handleToggleChange = async (e, params) => {
        const newIsActive = {
            "IsActive": e.target.checked
        };
        try {
            const response = await updateSubModuleStatusById(params.data._id, newIsActive);
            const message = response?.message || "Status update successfully"
            // Show success snackbar
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message,
                severityType: 'success',
            });
        } catch (error) {
            console.error("Error:", error);
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
        const updatedData = await fetchAllSubModule();
        setData(updatedData);
    };
    const crudForm = () => {
        return (
            <div>
                {/* <form onSubmit={handleSubmit}> */}
                <div>
                    {/* <SingleSelectTextField name="module_name" label="Module" value={current.module_name} onChange={(e) => setCurrent((prev) => ({ ...prev, module_name: e.target.value ,module_id:''}))} names={moduleName} /> */}
                    <SingleSelectTextField
                        name="module_name"
                        label="Module"
                        value={current.module_name}
                        isRequired={true}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const matchedModule = moduleName.find((m) => m.name === selectedName) || {};
                            setCurrent((prev) => ({
                                ...prev,
                                module_name: selectedName,
                                module_id: matchedModule._id || ''
                            }));
                        }}
                        names={moduleName}
                        error={!!errors.module_name}
                        helperText={errors.module_name}
                    />

                </div>
                
                <div>
                    <MuiTextField
                        error={!!errors.sub_module_name}
                        helperText={errors.sub_module_name}
                        isRequired={true}
                        label='Sub Module Name'
                        type='text'
                        fieldName='sub_module_name'
                        handleChange={handleChange}
                        value={current.sub_module_name} />

                    {/* <MuiTextField label='Location' type='text' isRequired={true} fieldName='location' handleChange={handleChange} value={current.location} /> */}

                </div>
                <div className=''>
                    <MuiTextAreaField
                        value={current.sub_module_description}
                        handleChange={handleChange}
                        name='sub_module_description'
                        label='Sub Module Description'
                        error={!!errors.sub_module_description}
                        helperText={errors.sub_module_description}
                        isRequired={true}
                    />
                </div>
                
                {/* <div>
                    <SingleSelectTextField name="approved_by" label="Approved By" value={current.approved_by} onChange={(e) => setCurrent((prev) => ({ ...prev, approved_by: e.target.value }))} names={groupHolding} />

                </div> */}

                <div className="row row-gap-2">
                    <div className='col col-12 col-md-6'>
                        <button type="button" className="btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col col-12 col-md-6 d-flex justify-content-end'>
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{isEditing ? <span className='button-style'>Save Changes</span> : <span className='button-style'>Create SubModule</span>}</button>
                    </div>
                </div>
                {/* </form> */}
            </div>

        )

    }
    const crudTitle = "Add New SubModule"
    const editCrudTitle = "Edit SubModule"

    const deleteModal = () => {
        return (
            <div>
                <div className='delete_message p-4'>
                    Are you sure you want to delete <DeleteIcon className='action_icon' /> this Sub Module?
                </div>

                <div className="row row-gap-2 mt-4">
                    <div className='col col-12 col-md-6'>
                        <button type="button" className="btn-sm btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col col-12 col-md-6 d-flex justify-content-end'>
                        <button type="submit"
                            className="btn-sm btn btn-primary"
                            onClick={() => handleDelete(subModuleId)}>Yes, I'm sure</button>
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

    const colDefs = [
        {
            headerName: 'Actions',
            field: 'actions',
            filter: false,
            editable: false,
            width: 130,
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
                                setSubModuleId(params.data._id); // OR .user_id based on your data
                                setModuleId(params.data.module_id)
                            }}
                        >
                            <EditIcon fontSize="small" className="action_icon" />
                        </button>
                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                setSubModuleId(params.data._id);
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            <DeleteIcon fontSize="small" className="action_icon" />
                        </button>
                        {/* <button
                            className="btn btn-sm"
                            onClick={() => {
                                setSubModuleId(params.data._id);
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            <VisibilityIcon fontSize="small" className="action_icon" />
                        </button> */}
                    </div>
                );
            }
        }
        ,

        { field: '_id', headerName: 'ID', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'module_name', headerName: 'Module Name', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },

        {
            field: 'approved_by', headerName: 'Approved By', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true,
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
        { field: 'sub_module_name', headerName: 'Sub-Module Name', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'sub_module_description', headerName: 'Sub-Module Description', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'sub_module_id', headerName: 'Sub-Module Access', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'location', headerName: 'Location', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'common_attributes.created_at', headerName: 'Created At', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'common_attributes.created_by', headerName: 'Created By', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'common_attributes.updated_at', headerName: 'Updated At', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'common_attributes.updated_by', headerName: 'Updated By', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
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
        },

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
 useEffect(() => {
  const fetchData = async () => {
    const [subModuleData, moduleNameList] = await Promise.allSettled([
      fetchAllSubModule(),
                    fetchAllModulesName(),
    ]);

    if (subModuleData.status === 'fulfilled') {
      setData(subModuleData.value);
    } else {
      console.warn("fetchAllSubModule failed:", subModuleData.reason);
    }

    if (moduleNameList.status === 'fulfilled') {
      setModuleName(moduleNameList.value);
    } else {
      console.warn("fetchAllModulesName failed:", moduleNameList.reason);
    }
  };

  fetchData();
}, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [subModuleData, moduleNameList] = await Promise.all([
    //                 fetchAllSubModule(),
    //                 fetchAllModulesName(),
    //             ]);
    //             setData(subModuleData);
    //             setModuleName(moduleNameList)

    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };

    //     fetchData();
    // }, []);
    return (
        <div>
            <h5>Sub-Module</h5>
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
            <div className='table_div p-3'>
                <div className='d-lg-flex d-md-flex  justify-content-between'>
                    <div className='d-flex h-100'>
                        <div class="search-bar-container h-25">
                            <MuiSearchBar label='Search...' type='text' />
                            <button className='search-icon'><SearchIcon /></button>
                        </div>
                    </div>
                    <div className='d-lg-flex d-md-flex  justify-content-end mb-3'>
                        <div>
                            <button className='crud_btn w-100' onClick={openModal}>
                                <span><AddIcon /></span> <span className='button-style'>Add New SubModule</span>
                            </button>
                        </div>
                        <DeleteModal deleteForm={deleteModal} deleteTitle='Delete User' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />
                        <SmallSizeModal closeModal={closeModal}crudForm={crudForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                    </div>
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

export default SubModule;
