
import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../style/useRole.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiTextField from '../component/MuiInputs/MuiTextField';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MuiSearchBar from '../component/MuiInputs/MuiSearchBar';
import SmallSizeModal from '../component/SmallSizeModal';
import SingleSelectTextField from '../component/MuiInputs/SingleSelectTextField';
import { bulkApproveAllPageData, createLocation, deleteLocationById, fetchAllGroupHolding, fetchAllLocation, fetchCompaniesNameByGroupId, getCompanyByGroupId, updateLocationById, updateLocationStatusById } from '../api/service';
import DeleteModal from '../component/DeleteModal';
import Snackbars from '../component/Snackbars';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import Toggle from '../component/Toggle';
import { AnimatedSearchBar } from '../component/AnimatedSearchBar';
ModuleRegistry.registerModules([AllCommunityModule]);

const Location = () => {
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState(
        {
            _id: null,
            group_holding_id: null,
            company_name: '',
            company_id: null,
            group_name: '',
            created_at: '',
            location_name: "",
            location_id: null,
            updated_at: '',
            city: '',
            state: '',
            location_description: ''
        });
    console.log(current, 'company_name')
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupHoldingData, setGroupHoldinData] = useState([])
    const [companyNameData, setCompanyNameData] = useState([])
    // console.log(companyNameData, 'companyNameData')
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const [locationId, setLocationId] = useState(null);
    const [companyNameByGroupHoldingId, setCompanyNameByGroupHoldingId] = useState([])
    // console.log(companyNameByGroupHoldingId, 'companyNameByGroupHoldingId')
    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!current?.company_name) tempErrors.company_name = "Company name is required";
        if (!current?.location_name) tempErrors.location_name = "Location name is required";
        if (!current?.group_name) tempErrors.group_name = "Group name is required";
        if (!current?.location_description) tempErrors.location_description = "Description is required";
        if (!current?.city) tempErrors.city = "City is required";
        if (!current?.state) tempErrors.state = "State is required";

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
            const response = await bulkApproveAllPageData('company_location');
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
        const updatedData = await fetchAllUser();
        setData(updatedData);
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!validate()) return; // Don't proceed if validation fails

        const payload = {
            "GroupHoldingsID": current?.group_holding_id,
            "CompanyID": current?.company_id,
            "LocationName": current?.location_name,
            "LocationDescription": current?.location_description,
            "City": current?.city,
            "State": current?.state,
            "CommonAttributes": {
                "Created_By": "68480959d7038d326905b02c"
            }
        };
        const EditPayload = {
            "GroupHoldingsID": current?.group_holding_id,
            "CompanyID": current?.company_id,
            "LocationName": current?.location_name,
            "LocationDescription": current?.location_description,
            "City": current?.city,
            "State": current?.state,
            "CommonAttributes": {
                "Updated_By": "68480959d7038d326905b02c"
            }
        };

        try {
            if (isEditing) {
                // Update existing company
                await updateLocationById(current._id, EditPayload);
            } else {
                // Create new company
                await createLocation(payload);
            }
            // Refresh data
            const updatedData = await fetchAllLocation();
            setData(updatedData);
        } catch (error) {
            console.error("Error saving company:", error);
        }

        // Reset form state
        setCurrent({
            company_id: null,
            company_name: '',
            group_name: '',
            group_holding_id: null,
            created_at: '',
            updated_at: '',
            location_description: '',
        });

        setIsEditing(false);
        setIsModalOpen(false);
    };

    const handleDelete = async (locationId) => {
        try {
            const response = await deleteLocationById(locationId);
            const message = response?.message || "Company deleted successfully";

            // Refresh data
            const updatedData = await fetchAllLocation();
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
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locationData, groupHolding, companyName,] = await Promise.all([
                    fetchAllLocation(),
                    fetchAllGroupHolding(),
                ]);
                setData(locationData);
                setGroupHoldinData(groupHolding);
                setCompanyNameData(companyName);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await fetchCompaniesNameByGroupId(current?.group_holding_id);
                if (data) {
                    setCompanyNameByGroupHoldingId(data);
                }
            } catch (error) {
                console.error("Failed to fetch company:", error);
            }
        };

        if (current?.group_holding_id) {
            fetchCompany();
        }
    }, [current?.group_holding_id]);

    const handleToggleChange = async (e, params) => {
        const newIsActive = {
            "IsActive": e.target.checked
        };
        try {
            const response = await updateLocationStatusById(params.data._id, newIsActive);
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
        const updatedData = await fetchAllLocation();
        setData(updatedData);
    };

    const crudForm = () => {
        return (
            <>
                <div>
                    <SingleSelectTextField
                        name="group_name"
                        label="Group Holding"
                        value={current?.group_name || ''}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const matchedGroup = groupHoldingData.find((g) => g.name === selectedName) || {};
                            setCurrent((prev) => ({
                                ...prev,
                                group_name: selectedName,
                                group_holding_id: matchedGroup._id || null,
                                company_name: '',
                            }));
                        }}
                        names={groupHoldingData}
                        isdisable={isEditing}
                        error={!!errors.group_name}
                        helperText={errors.group_name}
                    />
                </div>

                <div>
                    <SingleSelectTextField
                        name="company_name"
                        label="Company Name"
                        value={current?.company_name || ''}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const matchedGroup = companyNameByGroupHoldingId.find((g) => g.company_name === selectedName) || {};
                            console.log(matchedGroup, 'matchedGroup')
                            setCurrent((prev) => ({
                                ...prev,
                                company_name: selectedName,
                                company_id: matchedGroup._id || null,
                            }));
                        }}
                        names={companyNameByGroupHoldingId?.map((data) => ({
                            _id: data?._id,
                            name: data?.company_name
                        }))}
                        isdisable={isEditing}
                        error={!!errors.company_name}
                        helperText={errors.company_name}
                    />
                </div>
                <div>
                    <MuiTextField
                        label="Location"
                        type="text"
                        isRequired={true}
                        fieldName="location_name"
                        handleChange={handleChange}
                        value={current?.location_name || ''}
                        error={!!errors.location_name}
                        helperText={errors.location_name}
                    />
                </div>

                <div>
                    <MuiTextField
                        label="City"
                        type="text"
                        isRequired={true}
                        fieldName="city"
                        handleChange={handleChange}
                        value={current?.city || ''}
                        error={!!errors.city}
                        helperText={errors.city}
                    />
                </div>

                <div>
                    <MuiTextField
                        label="State"
                        type="text"
                        isRequired={true}
                        fieldName="state"
                        handleChange={handleChange}
                        value={current?.state || ''}
                        error={!!errors.state}
                        helperText={errors.state}
                    />
                </div>
                <div>
                    <MuiTextField
                        label="Description"
                        type="text"
                        isRequired={true}
                        fieldName="location_description"
                        handleChange={handleChange}
                        value={current?.location_description || ''}
                        error={!!errors.location_description}
                        helperText={errors.location_description}
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
            </>

        );
    };

    const crudTitle = "Add company Location"
    const editCrudTitle = "Edit Location"
    const deleteModal = () => {
        return (
            <div>
                <div className='delete_message p-4'>
                    Are you sure you want to delete <DeleteIcon className='action_icon' /> this company Location?
                </div>

                <div className="row row-gap-2 mt-4">
                    <div className='col-6'>
                        <button type="button" className="btn-sm btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col-6 d-flex justify-content-end'>
                        <button type="submit"
                            className="btn-sm btn btn-primary"
                            onClick={() => handleDelete(locationId)}>Yes, I'm sure</button>
                    </div>
                </div>
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

                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                setCurrent(params.data);
                                setIsEditing(true);
                                setIsModalOpen(true);
                                setLocationId(params.data._id)
                            }}
                        >
                            <EditIcon fontSize="small" className="action_icon" />
                        </button>
                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                setLocationId(params.data._id)
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            <DeleteIcon fontSize="small" className="action_icon" />
                        </button>
                        {/* <button
                            className="btn btn-sm"
                            onClick={() => {
                                setIsDeleteModalOpen(true);
                                setLocationId(params.data._id)

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
        { field: 'city', headerName: 'City', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'state', headerName: 'State', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'location_name', headerName: 'Location', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'location_description', headerName: 'Description', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'group_name', headerName: 'Group Holding', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'company_name', headerName: 'Company Name', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
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
        }, { field: 'common_attributes.approval_time', headerName: 'Approval Time', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'common_attributes.approved_by', headerName: 'Approved By', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },

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
                        <h1>{data?.length > 1 ? "Locations" : "Location"}</h1>
                    </div>
                </div>
                <div className='d-lg-flex d-md-flex gap-2 mt-2'>
                    <button className='crud_btn w-100 mb-2' onClick={openModal}>
                        <span><AddIcon /></span> <span className='button-style'>Add company Location</span>
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
            <DeleteModal deleteForm={deleteModal} deleteTitle='Delete Location' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />
            <SmallSizeModal crudForm={crudForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} closeModal={closeModal} />

            {/* Table to display data */}
            <div className='table_div p-3'>
                <div className='d-lg-flex d-md-flex  justify-content-between'>
                    <AnimatedSearchBar placeholder="Search..." type="text" id="filter-text-box" onInput={onFilterTextBoxChanged} />

                    <div className='d-lg-flex d-md-flex  justify-content-end mb-3'>
                        {/* <div>
                            <button className='crud_btn w-100' onClick={openModal}>
                                <span><AddIcon /></span> <span className='button-style'>Add company Location</span>
                            </button>
                        </div> */}
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

export default Location;
