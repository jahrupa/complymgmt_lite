
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
import { fetchAllGroupHolding, fetchAllModulesNameByLocationId, fetchAllSubModuleNameByModuleId, fetchAllUser, fetchAllUserAccessLevels, fetchCompaniesNameByGroupId, getLocationByCompanyId } from '../api/service';
// Register module
ModuleRegistry.registerModules([AllCommunityModule]);

const dummuJsonData = [
    {
        id: 1744096161424,
        sub_module_name: "Tata",
        module_desc: "XYZ",
        created_at: "Tata",
        updated_at: "Tata",
        location: "Mumbai",
        approved_by: ["Admin"]
    },
    {
        id: 1744096161425,
        sub_module_name: "Tata",
        module_desc: "XYZ",
        created_at: "Tata",
        updated_at: "Tata",
        location: "Mumbai",
        approved_by: ["Admin"]
    },
    {
        id: 1744096161426,
        sub_module_name: "Tata",
        module_desc: "XYZ",
        created_at: "Tata",
        updated_at: "Tata",
        location: "Mumbai",
        approved_by: ["Admin"]
    },
    {
        id: 1744096161427,
        sub_module_name: "Tata",
        module_desc: "XYZ",
        created_at: "Tata",
        updated_at: "Tata",
        location: "Mumbai",
        approved_by: ["Admin"]
    },
    {
        id: 1744096161428,
        sub_module_name: "Tata",
        module_desc: "XYZ",
        created_at: "Tata",
        updated_at: "Tata",
        location: "Mumbai",
        approved_by: ["Admin"]
    },
    {
        id: 1744096161429,
        sub_module_name: "Tata",
        module_desc: "XYZ",
        created_at: "Tata",
        updated_at: "Tata",
        location: "Mumbai",
        approved_by: ["Admin"],
        sub_module_id: ["tracker"]

    },
];

const AccessControl = () => {
    // const [data, setData] = useState([]);
    // if you want to show dummy jason data 
    const [data, setData] = useState(dummuJsonData);
    const [current, setCurrent] = useState({ id: null, sub_module_name: '', module_desc: '', created_at: '', location: "", updated_at: '', desc: '', approved_by: [], sub_module_id: [] });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupHoldingData, setGroupHoldingData] = useState([]);
    console.log(groupHoldingData, 'groupHoldingData')
    const [companyNameByGroupHoldingId, setCompanyNameByGroupHoldingId] = useState([]);
    const [locationNameByCompanyId, setLocationNameByCompanyId] = useState([]);
    const [moduleName, setModuleName] = useState([]);
    const [subModuleName, setSubModuleName] = useState([]);
    const [userNameListRes, setUserNameListRes] = useState([]);
    // Handle Add or Edit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            const updatedData = data.map((item) =>
                item.id === current.id ? { ...item, sub_module_name: current.sub_module_name, module_desc: current.module_desc, created_at: current.created_at, location: current.location, updated_at: current.updated_at, desc: current.desc, approved_by: current.approved_by, sub_module_id: current.sub_module_id } : item
            );
            setData(updatedData);
        } else {
            const newData = { id: Date.now(), sub_module_name: current.sub_module_name, module_desc: current.module_desc, created_at: current.created_at, location: current.location, updated_at: current.updated_at, desc: current.desc, approved_by: current.approved_by, sub_module_id: current.sub_module_id };
            setData((prev) => [...prev, newData]);
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
    const groupHolding = [
        "Tata",
        "Groupon",
        "Influitive",
        "Spinfluence",
        "Intellivision",
        "Omnilert",
        "Technologent",
        "Securiteam"
    ];
    const accessLevel = [
        "Group",
        "Company",
        "Location",
        "Module",
        "Sub-Module",
        "Role",
        "Tracker",
        "Own/Self",
        "All",

    ];
    const accessControl = [
        "Upload/Add New",
        "Edit",
        "Delete",
        "Can Approve",
    ];
    const crudTitle = "Add New Access Control"
    const editCrudTitle = "Edit Access Control"
    const handleRoleAccessChange = (newValue) => {
        setCurrent((prev) => ({ ...prev, approved_by: newValue }));
    };

    const crudForm = () => {
        return (
            <div>
                {/* <form onSubmit={handleSubmit}> */}
                <div className='d-lg-flex d-md-flex justify-content-between  gap-3'>
                    <SingleSelectTextField 
                    name="user_name" 
                    label="User Name" 
                    value={current.user_name} 
                    onChange={(e) => setCurrent((prev) => ({ ...prev, user_name: e.target.value }))} 
                    names={userNameListRes.map((item) => ({
                            _id: item._id,
                            name: item.name,
                        }))}
                         />
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
                            }));
                        }}
                        names={groupHoldingData.map((item) => ({
                            _id: item._id,
                            name: item.name,
                        }))}
                    // error={!!errors.group_name}
                    // helperText={errors.group_name}
                    />
                </div>
                <div className='d-lg-flex d-md-flex justify-content-between  gap-3'>
                    {/* <MuiTextField label='Sub Module Name' type='text' isRequired={true} fieldName='sub_module_name' handleChange={handleChange} value={current.sub_module_name} /> */}
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
                                company_id: matchedGroup?._id || null,
                            }));
                        }}
                        names={companyNameByGroupHoldingId}
                    // error={!!errors.company_name}
                    // helperText={errors.company_name}
                    />
                    <SingleSelectTextField name="location_name" label="Location"
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
                            }));
                        }}
                        names={locationNameByCompanyId}
                    // error={!!errors.location_name}
                    // helperText={errors.location_name}

                    />

                    {/* <MuiTextField label='Location' type='text' isRequired={true} fieldName='location' handleChange={handleChange} value={current.location} /> */}

                </div>
                <div className='d-lg-flex d-md-flex justify-content-between  gap-3'>
                    {/* <MuiTextField label='Sub Module Name' type='text' isRequired={true} fieldName='sub_module_name' handleChange={handleChange} value={current.sub_module_name} /> */}
                    <SingleSelectTextField
                        name="module_name"
                        label="Module"
                        value={current.module_name}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const matchedGroup = moduleName.find(
                                (g) => g.name === selectedName
                            );
                            setCurrent((prev) => ({
                                ...prev,
                                module_name: selectedName,
                                module_id: matchedGroup?._id || null,
                            }));
                        }}
                        names={moduleName}
                    // error={!!errors.module_name}
                    // helperText={errors.module_name}
                    />
                    <SingleSelectTextField
                        name="sub_module_name"
                        label="Sub-Module"
                        value={current?.sub_module_name}
                        // onChange={(e) => setCurrent((prev) => ({ ...prev, sub_module_name: e.target.value, }))}

                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const matchedGroup = subModuleName.find(
                                (g) => g.name === selectedName
                            );
                            setCurrent((prev) => ({
                                ...prev,
                                sub_module_name: selectedName,
                                sub_module_id: matchedGroup?._id || null,
                            }));
                        }}
                        names={subModuleName}
                    // error={!!errors.sub_module_name}
                    // helperText={errors.sub_module_name}
                    />

                    {/* <MuiTextField label='Location' type='text' isRequired={true} fieldName='location' handleChange={handleChange} value={current.location} /> */}

                </div>
                <div className='d-lg-flex d-md-flex justify-content-between  gap-3'>
                    {/*  */}
                    {/* <SingleSelectTextField name="service_trackers" label="Service Trackers" value={current.group_name} onChange={(e) => setCurrent((prev) => ({ ...prev, group_name: e.target.value }))} names={groupHolding} /> */}
                    {/* <SingleSelectTextField name="access Level" label="Access Level" value={current.group_name} onChange={(e) => setCurrent((prev) => ({ ...prev, group_name: e.target.value }))} names={accessLevel} /> */}
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
                {/* </form> */}
            </div>

        )

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
                            //   setCurrent(params.data);
                            setIsEditing(true);
                            setIsModalOpen(true);
                            //   setUserId(params.data._id);
                        }}>
                            <EditIcon fontSize="small" className="action_icon" />
                        </button>
                        <button className="btn btn-sm" onClick={() => {
                            //   setgroupId(params.data._id);
                            //   setIsDeleteModalOpen(true);
                        }}>
                            <DeleteIcon fontSize="small" className="action_icon" />
                        </button>
                        {/* <button className="btn btn-sm" onClick={() => {
              setUserId(params.data._id);
              setIsDeleteModalOpen(true);
            }}>
              <VisibilityIcon fontSize="small" className="action_icon" />
            </button> */}
                    </div>
                );
            }
        },
        { field: '_id', headerName: 'ID', filter: true, editable: false, },
        { field: 'group_name', headerName: 'Group Name', filter: true, editable: false, },
        { field: 'group_description', headerName: 'Group Description', filter: true, editable: false, },
        { field: 'common_attributes.created_at', headerName: 'Created At', filter: true, editable: false, },
        { field: 'updated_at', headerName: 'Updated At', filter: true, editable: false, },

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
            const [ userAccessDataRes, groupHoldingRes,userNameListRes] = await Promise.allSettled([
                fetchAllUserAccessLevels(),
                fetchAllGroupHolding(),
                fetchAllUser()
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
                }else {
                    console.warn("fetchAllUser failed:", userNameListRes.reason);
                }
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

                        <SmallSizeModal crudForm={crudForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
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
