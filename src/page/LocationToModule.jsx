
import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../style/useRole.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '../component/Modal';
import SingleSelectTextField from '../component/MuiInputs/SingleSelectTextField';
import { bulkApproveAllPageData, createsLocationToModule, deleteLocationToModuleByStatusId, fetchAllGroupHolding, fetchAllModulesName, fetchCompaniesNameByGroupId, fetchLocationToModuleModule, getLocationByCompanyId, updateLocationToModuleById, updateLocationToModuleByStatusId, } from '../api/service';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import DeleteModal from '../component/DeleteModal';
import Snackbars from '../component/Snackbars';
import Toggle from '../component/Toggle';
import { AnimatedSearchBar } from '../component/AnimatedSearchBar';
import { Link } from 'lucide-react';
ModuleRegistry.registerModules([AllCommunityModule]);

const LocationToModule = () => {
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState(
        {
            id: null,
            module_description: '',
            created_at: '',
            updated_at: '',
            desc: '',
            approved_by: '',
            group_name: "",
            group_holdings_id: null,
            company_name: "",
            company_id: null,
            location_name: "",
            location_id: null,
            module_name: '',
            module_id: null,
        });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [id, setId] = useState(null)
    // console.log(id, 'id')
    const [groupHoldingName, setGroupHoldingName] = useState([])
    const [companyName, setCompanyName] = useState([])
    // console.log(companyName, 'companyName')
    const [locationName, setLocationName] = useState([])
    const [moduleName, setModuleName] = useState([])
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message: '',
        severityType: '',
    });

    const [errors, setErrors] = useState({});
    const crudTitle = "Tag Location To Module"
    const editCrudTitle = "Edit Tagged Location To Module"
    const validate = () => {
        let tempErrors = {};
        if (!current?.group_name) tempErrors.group_name = "Group Holding is required";
        if (!current?.company_name) tempErrors.company_name = "Company is required";
        if (!current?.location_name) tempErrors.location_name = "Location is required";
        if (!current?.module_name) tempErrors.module_name = "Module is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleApproveAll = async () => {
        try {
            const response = await bulkApproveAllPageData('location_to_module');
            const message = response?.message || "Status update successfully"
            // Show success snackbar
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message,
                severityType: 'success',
            });
        } catch (error) {
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: error?.response?.data?.message,
                severityType: 'error',
            });
        }
        const updatedData = await fetchLocationToModuleModule();
        setData(updatedData);
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!validate()) return; // Don't proceed if validation fails
        const CommonAttributes = {
            [isEditing ? "Updated_By" : "Created_By"]: localStorage.getItem("user_id") || "",
        };
        const payload = {
            "CompanyID": current?.company_id,
            "LocationID": current?.location_id,
            "ModuleID": current?.module_id,
            "CommonAttributes": CommonAttributes
        };

        try {
            let response;
            if (isEditing) {
                // Update existing company
                response = await updateLocationToModuleById(id, payload);
            } else {
                // Create new company
                response = await createsLocationToModule(payload);
            }
            // ✅ Get the message from response
            const message = response?.message;
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'success' });
            // Refresh data
            const updatedData = await fetchLocationToModuleModule();
            setData(updatedData);
        } catch (error) {
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: error?.response?.data?.message, severityType: 'error' });
        }

        // Reset form state
        setCurrent({
            group_name: "",
            group_holdings_id: null,
            company_name: "",
            company_id: null,
            location_name: "",
            location_id: null,
            module_name: '',
            module_id: null,
        });
        setIsEditing(false);
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        try {
            const response = await deleteLocationToModuleByStatusId(id);
            const message = response?.message || "Module deleted successfully";

            // Refresh data
            const updatedData = await fetchLocationToModuleModule();
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
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: error?.response?.data?.message,
                severityType: 'error',
            });
        }
    };


    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
        setIsEditing(false);
        setErrors({})
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setCurrent({
            group_name: "",
            group_holdings_id: null,
            company_name: "",
            company_id: null,
            location_name: "",
            location_id: null,
            module_name: '',
            module_id: null,
        });
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.allSettled([
                    fetchLocationToModuleModule(),
                    fetchAllGroupHolding(),
                    fetchAllModulesName(),
                ]);
                if (results[0].status === 'fulfilled') setData(results[0].value);
                if (results[1].status === 'fulfilled') setGroupHoldingName(results[1].value);
                if (results[2].status === 'fulfilled') setModuleName(results[2].value);
                results.forEach((result, idx) => {
                    if (result.status === 'rejected') {
                        console.error(`Error fetching data at index ${idx}:`, result.reason);
                    }
                });
            } catch (error) {
                console.error("Error in fetchData:", error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await fetchCompaniesNameByGroupId(current?.group_holdings_id);
                if (data) {
                    setCompanyName(data);
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
                const data = await getLocationByCompanyId(current?.company_id);
                if (data) {
                    setLocationName(data);
                }
            } catch (error) {
                console.error("Failed to fetch location by company_id:", error);
            }
        };

        if (current?.company_id) {
            fetchLocationByCompanyId();
        }
    }, [current?.company_id]);

    const crudForm = () => {
        return (
            <div>
                <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
                    <SingleSelectTextField
                        name="group_name"
                        label="Group Holding"
                        value={current.group_name}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const matchedGroup = groupHoldingName.find(
                                (g) => g.name === selectedName
                            );
                            setCurrent((prev) => ({
                                ...prev,
                                group_name: selectedName,
                                group_holdings_id: matchedGroup?._id || null,
                                company_name: '',
                                location_name: '',
                            }));
                        }}
                        names={groupHoldingName}
                        error={!!errors.group_name}
                        helperText={errors.group_name}
                    />
                    <SingleSelectTextField name="company_name" label="Company Name" value={current?.company_name}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const matchedCompany = companyName.find(
                                (g) => g.company_name === selectedName
                            );
                            setCurrent((prev) => ({
                                ...prev,
                                company_name: selectedName,
                                company_id: matchedCompany?._id || null,
                            }));
                        }}
                        names={companyName.map((item) => ({
                            _id: item._id,
                            name: item.company_name,
                        }))}
                        error={!!errors.company_name}
                        helperText={errors.company_name}
                    // isdisable={isEditing ? true : false}

                    />
                    <SingleSelectTextField name="location_name" label="Location" value={current?.location_name}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const matchedLocation = locationName.find(
                                (g) => g.location_name === selectedName
                            );
                            setCurrent((prev) => ({
                                ...prev,
                                location_name: selectedName,
                                location_id: matchedLocation?._id || null,
                            }));
                        }}
                        names={locationName.map((item) => ({
                            _id: item._id,
                            name: item.location_name,
                        }))}
                        // isdisable={isEditing ? true : false}
                        error={!!errors.location_name}
                        helperText={errors.location_name}

                    />
                </div>
                <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
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
                        error={!!errors.module_name}
                        helperText={errors.module_name}
                    />
                </div>

                <div className="row row-gap-2">
                    <div className='col-6'>
                        <button type="button" className="btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col-6 d-flex justify-content-end'>
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{isEditing ? <span className='button-style'>Save Changes</span> : <span className='button-style'>Tag Module</span>}</button>
                    </div>
                </div>
                {/* </form> */}
            </div>

        )

    }

    const deleteModal = () => {
        return (
            <div>
                <div className='delete_message p-4'>
                    Are you sure you want to delete <DeleteIcon className='action_icon' /> this user Tagged Location To Module?
                </div>

                <div className="row row-gap-2 mt-4">
                    <div className='col-6'>
                        <button type="button" className="btn-sm btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col-6 d-flex justify-content-end'>
                        <button type="submit"
                            className="btn-sm btn btn-primary"
                            onClick={() => handleDelete(id)}>Yes, I'm sure</button>
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
            const response = await updateLocationToModuleByStatusId(params.data._id, newIsActive);
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
                "Failed to update status";

            // Show error snackbar
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: errorMessage,
                severityType: 'error',
            });
        }
        const updatedData = await fetchLocationToModuleModule();
        setData(updatedData);
    };

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

                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                setCurrent(params.data);
                                setIsEditing(true);
                                setIsModalOpen(true);
                                setId(params.data._id); // OR .user_id based on your data
                            }}
                        >
                            <EditIcon fontSize="small" className="action_icon" />
                        </button>
                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                setId(params.data._id);
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            <DeleteIcon fontSize="small" className="action_icon" />
                        </button>
                    </div>
                );
            }
        }
        ,

        // { field: '_id', headerName: 'ID', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },

        { field: 'module_name', headerName: 'Module Name', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        {
            field: 'group_name',
            headerName: 'Group Holding',
            editable: true,
            filter: true,
            headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
        },
        {
            field: 'company_name',
            headerName: 'Company Name',
            editable: true,
            filter: true,
            headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
        },
        { field: 'location_name', headerName: 'Location', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
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
        {
            field: 'approved_by', headerName: 'approved by', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true,
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
        { field: 'common_attributes.created_at', headerName: 'Created At', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'common_attributes.created_by', headerName: 'Created By', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'common_attributes.updated_at', headerName: 'Updated At', editable: true, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'common_attributes.updated_by', headerName: 'Updated By', editable: true, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },

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
                        {/* <h1>{data?.length > 1 ? "Companies" : "Company"}</h1> */}
                        <h1>Location to module</h1>
                    </div>
                </div>
                <div className='d-lg-flex d-md-flex gap-2 mt-2'>
                    <button className='crud_btn w-100 mb-2' onClick={openModal}>
                        <span><Link style={{ width: '15px', height: '15px' }} /></span> <span className='button-style'>Link Location To Module</span>
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
            <Modal crudForm={crudForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} closeModal={closeModal} />
            <DeleteModal deleteForm={deleteModal} deleteTitle='Delete User' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />
            <div className='table_div p-3'>
                <div className='d-lg-flex d-md-flex  justify-content-between'>
                    <AnimatedSearchBar placeholder="Search..." type="text" id="filter-text-box" onInput={onFilterTextBoxChanged} />
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

export default LocationToModule;
