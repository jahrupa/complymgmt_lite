
import React, { useEffect, useRef, useState } from 'react';
import '../style/useRole.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiTextField from '../component/MuiInputs/MuiTextField';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MuiSearchBar from '../component/MuiInputs/MuiSearchBar';
import SmallSizeModal from '../component/SmallSizeModal';
import { createGroup, deleteGroupById, fetchAllGroup, fetchAllGroupHolding, fetchAllServiceTracker, fetchCompaniesNameByGroupId, getLocationByCompanyId, updateGroupById, updateGroupStatusById } from '../api/Service';
import Snackbars from '../component/Snackbars';
import DeleteModal from '../component/DeleteModal';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import Toggle from '../component/Toggle';
import Modal from './Modal';
import SingleSelectTextField from './MuiInputs/SingleSelectTextField';
// Register module
ModuleRegistry.registerModules([AllCommunityModule]);

const ServiceTrackers = () => {
    const [data, setData] = useState([]);
    const [errors, setErrors] = useState({});
    const [current, setCurrent] = useState(
        {
            _id: null,
            service_tracker_name: '',
            group_holdings_id: null,
            group_holding_account_owner: '',
            created_at: '',
            group_holding_name: '',
            company_name: '',
            company_name_id: null,
            location_name: '',
            module_name: '',
            sub_module_name: '',
        });

    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userId, setUserId] = useState(null)
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message: '',
        severityType: '',
    });
    const [groupId, setgroupId] = useState(null)
    const [groupHoldingData, setGroupHoldinData] = useState([]);
    const [companyNameByGroupHoldingId, setCompanyNameByGroupHoldingId] = useState([]);
    const [locationNameByCompanyId, setLocationNameByCompanyId] = useState([]);

    console.log(current, 'current')
    // Role wise access
    const names = [
        'Create',
        'Editor',
        'Viewer',
        'Delete',
        'All'
    ];

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrent((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!current?.service_tracker_name) tempErrors.service_tracker_name = "Group Holding Name is required";
        if (!current?.group_holding_name) tempErrors.group_holding_name = "Description is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default submit behavior

        if (!validate()) return; // Don't proceed if validation fails

        const payload = {
            "GroupDescription": current?.group_holding_name,
            "GroupName": current?.service_tracker_name,
            "CommonAttributes": {
                "Approved_By": "68480959d7038d326905b02c",
                "Created_By": "68480959d7038d326905b02c",
                "IsActive": true,
                "IsDeleted": false
            }
        };

        try {
            let response;
            if (isEditing) {
                response = await updateGroupById(current?._id, payload);
            } else {
                response = await createGroup(payload);
            }

            const message = response?.message;
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message, severityType: 'success' });
            const updatedData = await fetchAllGroup();
            setData(updatedData);
        } catch (error) {
            console.error("Error saving company:", error);
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: "Failed to save group", severityType: 'error' });
        }

        // Reset form state
        setCurrent({
            _id: null,
            service_tracker_name: '',
            group_holding_account_owner: '',
            created_at: '',
            group_holding_name: '',
        });
        setIsEditing(false);
        setIsModalOpen(false);
        setErrors({}); // ✅ Reset errors after submission
    };



    // Handle Edit
    const handleEdit = (id) => {
        const item = data.find((item) => item.group_holdings_id === id);
        setCurrent(item);
        setIsEditing(true);
        setIsModalOpen(true);

    };

    // Handle Delete
    const handleDelete = async (groupId) => {
        try {
            const response = await deleteGroupById(groupId);
            const message = response?.message || "Group holding  successfully";

            // Refresh data
            const updatedData = await fetchAllGroup();
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
    };
    // Active/InActive status
    const handleToggleChange = async (e, params) => {
        const newIsActive = {
            "IsActive": e.target.checked
        };
        try {
            const response = await updateGroupStatusById(params.data._id, newIsActive);
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
        const updatedData = await fetchAllGroup();
        setData(updatedData);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [serviceTracker, groupHolding] = await Promise.all([
                    fetchAllServiceTracker(),
                    fetchAllGroupHolding(),
                ]);
                setData(serviceTracker);
                setGroupHoldinData(groupHolding);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await fetchCompaniesNameByGroupId(current?.group_holdings_id);
                if (data) {
                    setCompanyNameByGroupHoldingId(data);
                }
            } catch (error) {
                console.error("Failed to fetch company:", error);
            }
        };

        if (current?.group_holdings_id) {
            fetchCompany();
        }
    }, [current?.group_holdings_id]);


    useEffect(() => {
        const fetchLocationByCompanyId = async () => {
            try {
                const data = await getLocationByCompanyId(current?.company_name_id);
                if (data) {
                    setLocationNameByCompanyId(data);
                }
            } catch (error) {
                console.error("Failed to fetch location by company_id:", error);
            }
        };

        if (current?.company_name_id) {
            fetchLocationByCompanyId();
        }
    }, [current?.company_name_id]);

    const crudForm = () => {
        return (
            <div>
                <div className='d-lg-flex d-md-flex gap-2'>
                    <MuiTextField label='Service Tracker Name' type='text' isRequired={true} fieldName='service_tracker_name' handleChange={handleChange} value={current.service_tracker_name} />

                    <SingleSelectTextField
                        name="group_holding_name"
                        label="Group Holding"
                        value={current?.group_holding_name}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const matchedGroup = groupHoldingData.find(
                                (g) => g.name === selectedName
                            );
                            setCurrent((prev) => ({
                                ...prev,
                                group_holding_name: selectedName,
                                group_holdings_id: matchedGroup?._id || null,
                                company_name: '',
                            }));
                        }}
                        names={groupHoldingData}
                    // isdisable={isEditing}
                    />

                </div>
                <div className='d-lg-flex d-md-flex gap-2'>
                    <SingleSelectTextField
                        name="company_name"
                        label="Company"
                        value={current?.company_name}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const matchedGroup = companyNameByGroupHoldingId.find(
                                (g) => g.name === selectedName
                            );
                            setCurrent((prev) => ({
                                ...prev,
                                company_name: selectedName,
                                company_name_id: matchedGroup?._id || null,
                            }));
                        }}
                        names={companyNameByGroupHoldingId}
                    // isdisable={isEditing}
                    />
                    <SingleSelectTextField
                        name="location_name"
                        label="Location"
                        // value={current?.location_name}
                        onChange={(e) => setCurrent((prev) => ({ ...prev, location_name: e.target.value }))}
                        names={locationNameByCompanyId}
                    // isdisable={isEditing}
                    />


                </div>
                <div className='d-lg-flex d-md-flex gap-2'>
                    <SingleSelectTextField
                        name="module_name"
                        label="Module"
                        // value={current?.module_name}
                        onChange={(e) => {
                            // const selectedName = e.target.value;
                            // const matchedGroup = groupHoldingData.find(
                            //     (g) => g.name === selectedName
                            // );
                            // setCurrent((prev) => ({
                            //     ...prev,
                            //     module_name: selectedName,
                            //     group_holdings_id: matchedGroup?.id || null,
                            //     module_name: '', 
                            // }));
                        }}
                    // names={groupHoldingData}
                    // isdisable={isEditing}
                    />

                    <SingleSelectTextField
                        name="sub_module_name"
                        label="Sub-Module"
                        // value={current?.sub_module_name}
                        onChange={(e) => setCurrent((prev) => ({ ...prev, sub_module_name: e.target.value }))}
                    // names={groupHoldingData}
                    // isdisable={isEditing}
                    />
                </div>
                <div className="row row-gap-2">
                    <div className='col col-12 col-md-6'>
                        <button type="button" className="btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col col-12 col-md-6 d-flex justify-content-end'>
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{isEditing ? <span className='button-style'>Save Changes</span> : <span className='button-style'>Create Service Tracker</span>}</button>
                    </div>
                </div>
            </div>

        )

    }
    const crudTitle = "Add New Service Tracker"
    const deleteModal = () => {
        return (
            <div>
                <div className='delete_message p-4'>
                    Are you sure you want to delete <DeleteIcon className='action_icon' /> this Company Holding?
                </div>

                <div className="row row-gap-2 mt-4">
                    <div className='col col-12 col-md-6'>
                        <button type="button" className="btn-sm btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col col-12 col-md-6 d-flex justify-content-end'>
                        <button type="submit"
                            className="btn-sm btn btn-primary"
                            onClick={() => handleDelete(groupId)}>Yes, I'm sure</button>
                    </div>
                </div>
            </div>
        )
    }

    const getRoleColorForFileStatus = (status) => {
        switch (status) {
            case 1:
                return { color: '#4CAF50' }; // green
            case 0:
                return { color: '#F44336' }; // brown
            default:
                return { color: '#41464b' }; // gray
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
                        <button className="btn btn-sm" onClick={() => {
                            setCurrent(params.data);
                            setIsEditing(true);
                            setIsModalOpen(true);
                            setUserId(params.data._id);
                        }}>
                            <EditIcon fontSize="small" className="action_icon" />
                        </button>
                        <button className="btn btn-sm" onClick={() => {
                            setgroupId(params.data._id);
                            setIsDeleteModalOpen(true);
                        }}>
                            <DeleteIcon fontSize="small" className="action_icon" />
                        </button>
                    </div>
                );
            }
        },
        { field: '_id', headerName: 'ID', filter: true, editable: false, },
        { field: 'service_tracker_name', headerName: 'Service Tracker Name', filter: true, editable: false, },
        { field: 'group_holding_name', headerName: 'Group Holding', filter: true, editable: false, },
        { field: 'company_name', headerName: 'company', filter: true, editable: false, },
        { field: 'location_name', headerName: 'Location', filter: true, editable: false, },
        { field: 'module_name', headerName: 'Module', filter: true, editable: false, },
        { field: 'sub_module_name', headerName: 'Sub-Module', filter: true, editable: false, },
        {
            field: 'common_attributes.approval_status', // or use valueGetter instead (recommended)
            headerName: 'Approval Status',
            editable: false,
            headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
            filter: true,

            valueGetter: (params) => params.data?.common_attributes?.approval_status, // safer access

            cellRenderer: (params) => {
                const getApprovalStatusText = (status) => {
                    switch (status) {
                        case 0: return 'Pending';
                        case 1: return 'Approved';
                        default: return '-'; // fallback
                    }
                };

                const status = params.value;
                const { color } = getRoleColorForFileStatus(status || 0); // Fallback to 0 (Pending) if undefined

                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            checked={true}
                            readOnly // ✅ prevent manual toggle unless you implement onChange
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
        },
        { field: 'common_attributes.created_at', headerName: 'Created At', filter: true, editable: false, },
        { field: 'common_attributes.updated_at', headerName: 'Updated At', filter: true, editable: false, },
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
    return (
        <div>
            <div className='mb-4'>
                <h5>Service Tracker Manager</h5>
            </div>
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
            <div className='table_div p-3'>
                <div className='d-lg-flex d-md-flex  justify-content-between'>
                    <div className='d-flex h-100'>
                        <div className="search-bar-container h-25">
                            <MuiSearchBar label='Search...' type='text' />
                            <button className='search-icon'><SearchIcon /></button>
                        </div>
                    </div>
                    <div className='d-lg-flex d-md-flex  justify-content-end mb-3'>
                        <div className='pe-2'>
                            <button className='crud_btn' onClick={openModal}>
                                <span><AddIcon /></span> <span className='button-style'>Add Service Tracker</span>
                            </button>

                        </div>
                        <button className="button approve">
                            <span className="icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12 3.41 13.41 9 19 21 7 19.59 5.59z" />
                                </svg>
                            </span>
                            <span className="text">Approve All</span>
                        </button>
                        <DeleteModal deleteForm={deleteModal} deleteTitle='Delete Company Holding' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />

                        <Modal crudForm={crudForm} crudTitle={crudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} closeModal={closeModal}/>

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

export default ServiceTrackers;
