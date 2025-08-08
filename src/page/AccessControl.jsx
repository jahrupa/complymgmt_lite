
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
import MultipleSelectTextFields from '../component/MuiInputs/MultipleSelectTextFields';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import MenuPopup from '../component/MenuPopup';
import MultiFileUpload from '../component/MultiFileUpload';
import RightDrawer from '../component/RightDrawer';
import ResponsiveDatePickers from '../component/DatePicker';
import { ReactPDFViewer } from '../component/ReactPDFViewer';
import { createUserAccessLevel, fetchAllAccessTypes, fetchAllGroupHolding, fetchAllModulesNameByLocationId, fetchAllSubModuleNameByModuleId, fetchAllUser, fetchAllUserAccessLevels, fetchCompaniesNameByGroupId, getLocationByCompanyId } from '../api/service';
// Register module
ModuleRegistry.registerModules([AllCommunityModule]);

const AccessControl = () => {
    // const [data, setData] = useState([]);
    // if you want to show dummy jason data 
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState({
        user_id: null,
        user_name: '',
        group_name: '',
        group_name_id: null,
        company_name: '',
        company_id: null,
        location_name: '',
        location_id: null,
        module_name: '',
        module_id: null,
        sub_module_name: '',
        sub_module_id: null,
        access_type: '',
        approved_by: [],
    });
    console.log(current, 'current')
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupHoldingData, setGroupHoldingData] = useState([]);
    const [companyNameByGroupHoldingId, setCompanyNameByGroupHoldingId] = useState([]);
    const [locationNameByCompanyId, setLocationNameByCompanyId] = useState([]);
    const [moduleName, setModuleName] = useState([]);
    const [subModuleName, setSubModuleName] = useState([]);
    const [userNameListRes, setUserNameListRes] = useState([]);
    const [accessTypeList, setAccessTypeList] = useState([]);
    console.log(accessTypeList, 'accessTypeList')
    const currentUserId = localStorage.getItem('user_id');

    // Handle Add or Edit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            user_id: current?.user_id,
            entity_id: current?.group_name_id || current?.company_id || current?.location_id || current?.module_id || current?.sub_module_id || current?.service_tracker || current?.page,
            entity_name: current?.group_name || current?.company_name || current?.location_name || current?.module_name || current?.sub_module_name || current?.service_tracker || current?.page,
            entity_type: current?.access_type,
            bo_user_id: currentUserId,
            access: Array.isArray(current?.approved_by)
                ? current.approved_by.map(a => a.toLowerCase())
                : []
        }
        try {
            if (isEditing) {
                // Update existing company
                await updateLocationById(current._id, payload);
            } else {
                // Create new company
                await createUserAccessLevel(payload);
            }
            // Refresh data
            const updatedData = await fetchAllUserAccessLevels({ system_user_id: currentUserId });
            setData(updatedData);
        } catch (error) {
            console.error("Error saving company:", error);
        }
        setCurrent({ id: null, sub_module_name: '', module_desc: '', created_at: '', location: '', updated_at: '', desc: '', approved_by: [], sub_module_id: [] });
        setIsEditing(false);
        setIsModalOpen(false);

    };
    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const accessControl = [
        'View',
        'Create',
        'Update',
        'Delete',
    ];
    const crudTitle = "Add New Access Control"
    const editCrudTitle = "Edit Access Control"
    const handleRoleAccessChange = (newValue) => {
        setCurrent((prev) => ({ ...prev, approved_by: newValue }));
    };

    const crudForm = () => {
        // Helper functions for conditional rendering based on current.access_type
        // If access_type is 'submodule', show only module and submodule dropdowns
        // If access_type is 'module', show only module dropdown
        const showOnlyModule = current.access_type === "module";
        const showOnlyModuleAndSubModule = current.access_type === "submodule";

        const showGroup = [
            "group",
            "company",
            "company_location"
        ].includes(current.access_type) && !showOnlyModule && !showOnlyModuleAndSubModule;

        const showCompany = [
            "company",
            "company_location"
        ].includes(current.access_type) && !showOnlyModule && !showOnlyModuleAndSubModule;

        const showLocation = [
            "company_location"
        ].includes(current.access_type) && !showOnlyModule && !showOnlyModuleAndSubModule;

        const showModule = showOnlyModule || showOnlyModuleAndSubModule;
        const showSubModule = current.access_type === "submodule";
        const showServiceTracker = current.access_type === "service_tracker";
        const showLocationToModule = current.access_type === "location_to_module";
        const showPage = current.access_type === "page";

        return (
            <div>
                <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
                    <SingleSelectTextField
                        name="user_name"
                        label="User Name"
                        value={current.user_name}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const matchedUser = userNameListRes.find((item) => item.full_name === selectedName);
                            setCurrent((prev) => ({
                                ...prev,
                                user_name: selectedName,
                                user_id: matchedUser?._id || null
                            }));
                        }}
                        names={userNameListRes.map((item) => ({
                            _id: item._id,
                            name: item.full_name,
                        }))}
                    />
                    <SingleSelectTextField
                        name="access_type"
                        label="Access Type"
                        value={current?.access_type}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            setCurrent((prev) => ({
                                ...prev,
                                access_type: selectedName,
                                group_name: '',
                                group_name_id: null,
                                company_name: '',
                                company_id: null,
                                location_name: '',
                                location_id: null,
                                module_name: '',
                                module_id: null,
                                sub_module_name: '',
                                sub_module_id: null,
                                service_tracker: '',
                                page: ''
                            }));
                        }}
                        names={[
                            { name: "group" },
                            { name: "company" },
                            { name: "company_location" },
                            { name: "module" },
                            { name: "user" },
                            { name: "submodule" },
                            { name: "service_tracker" },
                            { name: "location_to_module" },
                            { name: "user_roles" },
                            { name: "user_access" },
                            { name: "page" }
                        ]}
                    />
                </div>
                <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
                    {showGroup && (
                        <SingleSelectTextField
                            name="group_name"
                            label="Group Holding Name"
                            value={current?.group_name}
                            onChange={(e) => {
                                const selectedName = e.target.value;
                                const matchedGroup = groupHoldingData.find(
                                    (g) => g.name === selectedName
                                );
                                setCurrent((prev) => ({
                                    ...prev,
                                    group_name: selectedName,
                                    group_name_id: matchedGroup?._id || null,
                                    company_name: '',
                                    company_id: null,
                                    location_name: '',
                                    location_id: null,
                                    module_name: '',
                                    module_id: null,
                                    sub_module_name: '',
                                    sub_module_id: null
                                }));
                            }}
                            names={groupHoldingData.map((item) => ({
                                _id: item._id,
                                name: item.name,
                            }))}
                        />
                    )}
                    {showCompany && (
                        <SingleSelectTextField
                            name="company_name"
                            label="Company"
                            value={current?.company_name}
                            onChange={(e) => {
                                const selectedName = e.target.value;
                                const matchedCompany = companyNameByGroupHoldingId.find(
                                    (g) => g.name === selectedName
                                );
                                setCurrent((prev) => ({
                                    ...prev,
                                    company_name: selectedName,
                                    company_id: matchedCompany?._id || null,
                                    location_name: '',
                                    location_id: null,
                                    module_name: '',
                                    module_id: null,
                                    sub_module_name: '',
                                    sub_module_id: null
                                }));
                            }}
                            names={companyNameByGroupHoldingId}
                        />
                    )}
                </div>
                <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
                    {showLocation && (
                        <SingleSelectTextField
                            name="location_name"
                            label="Location"
                            value={current?.location_name}
                            onChange={(e) => {
                                const selectedName = e.target.value;
                                const matchedLocation = locationNameByCompanyId.find(
                                    (g) => g.name === selectedName
                                );
                                setCurrent((prev) => ({
                                    ...prev,
                                    location_name: selectedName,
                                    location_id: matchedLocation?._id || null,
                                    module_name: '',
                                    module_id: null,
                                    sub_module_name: '',
                                    sub_module_id: null
                                }));
                            }}
                            names={locationNameByCompanyId}
                        />
                    )}
                    {showModule && (
                        <SingleSelectTextField
                            name="module_name"
                            label="Module"
                            value={current.module_name}
                            onChange={(e) => {
                                const selectedName = e.target.value;
                                const matchedModule = moduleName.find(
                                    (g) => g.name === selectedName
                                );
                                setCurrent((prev) => ({
                                    ...prev,
                                    module_name: selectedName,
                                    module_id: matchedModule?._id || null,
                                    sub_module_name: '',
                                    sub_module_id: null
                                }));
                            }}
                            names={moduleName}
                        />
                    )}
                </div>
                <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
                    {showSubModule && (
                        <SingleSelectTextField
                            name="sub_module_name"
                            label="Sub-Module"
                            value={current?.sub_module_name}
                            onChange={(e) => {
                                const selectedName = e.target.value;
                                const matchedSubModule = subModuleName.find(
                                    (g) => g.name === selectedName
                                );
                                setCurrent((prev) => ({
                                    ...prev,
                                    sub_module_name: selectedName,
                                    sub_module_id: matchedSubModule?._id || null
                                }));
                            }}
                            names={subModuleName}
                        />
                    )}
                    {showServiceTracker && (
                        <SingleSelectTextField
                            name="service_tracker"
                            label="Service Tracker"
                            value={current?.service_tracker}
                            onChange={(e) => setCurrent((prev) => ({
                                ...prev,
                                service_tracker: e.target.value,
                            }))}
                            names={[]} // Provide your service tracker list here
                        />
                    )}
                </div>
                <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
                    {showLocationToModule && (
                        <SingleSelectTextField
                            name="location_to_module"
                            label="Location To Module"
                            value={current?.location_to_module}
                            onChange={(e) => setCurrent((prev) => ({
                                ...prev,
                                location_to_module: e.target.value,
                            }))}
                            names={[]} // Provide your location to module list here
                        />
                    )}
                    {showPage && (
                        <SingleSelectTextField
                            name="page"
                            label="Page"
                            value={current?.page}
                            onChange={(e) => setCurrent((prev) => ({
                                ...prev,
                                page: e.target.value,
                            }))}
                            names={[]} // Provide your page list here
                        />
                    )}
                </div>
                <div>
                    <MultipleSelectTextFields label='Access Control' value={current.approved_by} onChange={handleRoleAccessChange} names={accessControl} />
                </div>
                <div className="row row-gap-2">
                    <div className='col col-12 col-md-6'>
                        <button type="button" className="btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col col-12 col-md-6 d-flex justify-content-end'>
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{isEditing ? <span className='button-style'>Save Changes</span> : <span className='button-style'>Create Access Control</span>}</button>
                    </div>
                </div>
            </div>
        );
    }

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
                            setIsEditing(true);
                            setCurrent(params.data);
                            setIsModalOpen(true);
                        }}>
                            <EditIcon fontSize="small" className="action_icon" />
                        </button>
                        <button className="btn btn-sm" onClick={() => {
                            // Delete logic here
                        }}>
                            <DeleteIcon fontSize="small" className="action_icon" />
                        </button>
                    </div>
                );
            }
        },
        // { field: 'UserId', headerName: 'User ID', filter: true, editable: false },
        // { field: 'EntityId', headerName: 'Entity ID', filter: true, editable: false },
        { field: 'EntityName', headerName: 'Entity Name', filter: true, editable: false },
        { field: 'EntityType', headerName: 'Entity Type', filter: true, editable: false },
        { field: 'view', headerName: 'View', filter: true, editable: false },
        { field: 'create', headerName: 'Create', filter: true, editable: false },
        { field: 'update', headerName: 'Update', filter: true, editable: false },
        { field: 'delete', headerName: 'Delete', filter: true, editable: false },
        { field: 'IsActive', headerName: 'Is Active', filter: true, editable: false },
        { field: 'Created_By', headerName: 'Created By', filter: true, editable: false },
        { field: 'Created_At', headerName: 'Created At', filter: true, editable: false },
        { field: 'Updated_By', headerName: 'Updated By', filter: true, editable: false },
        { field: 'Updated_At', headerName: 'Updated At', filter: true, editable: false },
        { field: 'Approval_Status', headerName: 'Approval Status', filter: true, editable: false },
        { field: 'Approved_By', headerName: 'Approved By', filter: true, editable: false },
        { field: 'Approved_At', headerName: 'Approved At', filter: true, editable: false },
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
            const [userAccessDataRes, groupHoldingRes, userNameListRes, accessTypeListRes] = await Promise.allSettled([
                fetchAllUserAccessLevels({ system_user_id: currentUserId }),
                fetchAllGroupHolding(),
                fetchAllUser(),
                fetchAllAccessTypes()
            ]);

            if (userAccessDataRes.status === 'fulfilled') {
                setData(userAccessDataRes.value);
            } else {
                console.warn("fetchAllUserAccessLevels failed:", userAccessDataRes.reason);
            }

            if (groupHoldingRes.status === 'fulfilled') {
                const groupHolding = groupHoldingRes.value;
                if (groupHolding && groupHolding.length > 0) {
                    setGroupHoldingData(groupHolding);
                }
            } else {
                console.warn("fetchAllGroupHolding failed:", groupHoldingRes.reason);
            }
            if (userNameListRes.status === 'fulfilled') {
                const userNameList = userNameListRes.value;
                if (userNameList && userNameList.length > 0) {
                    setUserNameListRes(userNameList);
                } else {
                    console.warn("fetchAllUser failed:", userNameListRes.reason);
                }
            }
            if (accessTypeListRes.status === 'fulfilled') {
                setAccessTypeList(accessTypeListRes.value);
            } else {
                console.warn("fetchAllUserAccessLevels failed:", accessTypeListRes.reason);
            }
        };

        fetchData();
    }, []);

    // fetch company by group id
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await fetchCompaniesNameByGroupId(current?.group_name_id);
                if (data) {
                    setCompanyNameByGroupHoldingId(data);
                }
            } catch (error) {
                console.error("Failed to fetch company:", error);
            }
        };

        if (current?.group_name_id) {
            fetchCompany();
        }
    }, [current?.group_name_id]);

    // fetch location by company id
    useEffect(() => {
        const fetchLocationByCompanyId = async () => {
            try {
                const data = await getLocationByCompanyId(current?.company_id);
                if (data) {
                    setLocationNameByCompanyId(data);
                }
            } catch (error) {
                console.error("Failed to fetch location by company_id:", error);
            }
        };

        if (current?.company_id) {
            fetchLocationByCompanyId();
        }
    }, [current?.company_id]);


    // module by location id
    useEffect(() => {
        const fetchModuleByLocationId = async () => {
            try {
                const data = await fetchAllModulesNameByLocationId(current?.location_id);
                if (data) {
                    setModuleName(data);
                }
            } catch (error) {
                console.error("Failed to fetch location by location_id:", error);
            }
        };

        if (current?.location_id) {
            fetchModuleByLocationId();
        }
    }, [current?.location_id]);
    // sub-module by module id
    useEffect(() => {
        const fetchSubModuleByModuleId = async () => {
            try {
                const data = await fetchAllSubModuleNameByModuleId(current?.module_id);
                if (data) {
                    setSubModuleName(data);
                }
            } catch (error) {
                console.error("Failed to fetch location by location_id:", error);
            }
        };

        if (current?.module_id) {
            fetchSubModuleByModuleId();
        }
    }, [current?.module_id]);
    return (
        <div>
            {/* Table to display data */}
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
                                <span><AddIcon /></span> <span className='button-style'>Add New Access Control</span>
                            </button>
                        </div>

                        <Modal crudForm={crudForm} closeModal={closeModal} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
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

export default AccessControl;
