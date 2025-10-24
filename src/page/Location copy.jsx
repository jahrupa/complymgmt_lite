import React, { useEffect, useRef, useState } from 'react';
import '../style/useRole.css';
import {
    createLocation,
    deleteLocationById,
    fetchAllCompaniesName,
    fetchAllGroupHolding,
    fetchAllLocation,
    fetchCompaniesNameByGroupId,
    getCompanyByGroupId,
    updateLocationById,
    updateLocationStatusById
} from '../api/service';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import Modal from '../component/Modal';
import MuiTextField from '../component/MuiInputs/MuiTextField';
import SingleSelectTextField from '../component/MuiInputs/SingleSelectTextField';
import MuiSearchBar from '../component/MuiInputs/MuiSearchBar';
import SmallSizeModal from '../component/SmallSizeModal';
import DeleteModal from '../component/DeleteModal';
import Snackbars from '../component/Snackbars';
import Toggle from '../component/Toggle';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

const Location = () => {
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState({
        _id: null,
        groups_holdings_id: null,
        company_id: null,
        company_name: '',
        group_name: '',
        location_name: '',
        city: '',
        state: '',
        created_at: '',
        updated_at: ''
    });
    //  console.log(current, 'current')
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({ open: false, vertical: 'top', horizontal: 'center' });
    const [locationId, setLocationId] = useState(null);
    const [groupHoldingData, setGroupHoldinData] = useState([]);
    const [companyNameByGroupHoldingId, setCompanyNameByGroupHoldingId] = useState([]);
    //  console.log(companyNameByGroupHoldingId, 'companyNameByGroupHoldingId')
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrent((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setCurrent({
            _id: null,
            groups_holdings_id: null,
            company_id: null,
            company_name: '',
            group_name: '',
            location_name: '',
            city: '',
            state: '',
            created_at: '',
            updated_at: ''
        });
        setIsEditing(false);
    };

    const closeModal = () => {
        resetForm();
        setIsModalOpen(false);
    };

    const handleSubmit = async () => {
        const payload = {
            GroupHoldingsID: current.groups_holdings_id,
            CompanyID: current.company_id,
            LocationName: current.location_name,
            "LocationDescription": "Technology and customer relationship management center.",
            City: current.city,
            State: current.state,
            CommonAttributes: { Created_By: "68480959d7038d326905b02c" }
        };
        try {
            let response;
            if (isEditing) {
                response = await updateLocationById(locationId, {
                    GroupHoldingsID: current.groups_holdings_id,
                    CompanyID: current.company_id,
                    LocationName: current.location_name,
                    "LocationDescription": "Technology and customer relationship management center.",
                    City: current.city,
                    State: current.state,
                    CommonAttributes: { Updated_By: "68480959d7038d326905b02c" }
                });
            } else {
                response = await createLocation(payload);
            }
            const message = response?.message;

            const updatedData = await fetchAllLocation();
            setData(updatedData);
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'success' });
        } catch (error) {
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'error' });
            console.error("Error saving location:", error);
        }

        closeModal();
    };

    const handleDelete = async (id) => {
        try {
            let response;
            response = await deleteLocationById(id);
            const updatedData = await fetchAllLocation();
            setData(updatedData);
            setIsDeleteModalOpen(false);
            const message = response?.message;
            //  console.log(message, 'message')
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'success' });

        } catch (error) {
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'error' });
        }
    };

    const handleToggleChange = async (e, params) => {
        try {
            await updateLocationStatusById(params.data._id, { IsActive: e.target.checked });
            const updatedData = await fetchAllLocation();
            setData(updatedData);
            setIsSnackbarsOpen({ open: true, message: "Status updated", severityType: 'success' });
        } catch (error) {
            setIsSnackbarsOpen({ open: true, message: "Failed to update status", severityType: 'error' });
        }
    };



    const deleteModal = () => (
        <div>
            <div className='p-4'>Are you sure you want to delete this location?</div>
            <div className="row row-gap-2 mt-4">
                <div className='col-6'>
                    <button type="button" className="btn-sm btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                </div>
                <div className='col-6 d-flex justify-content-end'>
                    <button type="submit" className="btn-sm btn btn-primary" onClick={() => handleDelete(locationId)}>Yes, Delete</button>
                </div>
            </div>
        </div>
    );

    const colDefs = [
        {
            headerName: 'Actions',
            field: 'actions',
            pinned: 'left',
            width: 130,
            cellStyle: { 'background-color': 'rgb(252 229 205 / 64%)' },
            headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
            cellRenderer: (params) => (
                <div className="d-flex justify-content-around align-items-center">
                    <button className="btn btn-sm" onClick={() => {
                        setCurrent(params.data);
                        setIsEditing(true);
                        setIsModalOpen(true);
                    }}><EditIcon fontSize="small" className="action_icon" /></button>
                    <button className="btn btn-sm" onClick={() => {
                        setLocationId(params.data._id);
                        setIsDeleteModalOpen(true);
                    }}> <DeleteIcon fontSize="small" className="action_icon" /></button>
                </div>
            )
        },
        { field: '_id', headerName: 'ID', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'location_name', headerName: 'Location', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'city', headerName: 'City', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'state', headerName: 'State', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'group_name', headerName: 'Group Holding', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'company_name', headerName: 'Company Name', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        {
            headerName: 'Status',
            field: 'common_attributes.is_active',
            editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true,
            cellRenderer: (params) => (
                <Toggle checked={!!params.value} onChange={(e) => handleToggleChange(e, params)} />
            )
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locationData, groupHolding, companyName] = await Promise.all([
                    fetchAllLocation(),
                    fetchAllGroupHolding(),
                    // fetchAllCompaniesName(),
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
                const data = await fetchCompaniesNameByGroupId(current?.groups_holdings_id);
                if (current?.groups_holdings_id) {
                    // Set data name list for dropdown (even though it's disabled)
                    setCompanyNameByGroupHoldingId(data);
                    //  console.log("first")
                    // Set selected data name in state
                    // setCurrent((prev) => ({
                    //     ...prev,
                    //     company_name: data.name,
                    //     company_id: data._id,

                    // }));
                }
            } catch (error) {
                console.error("Failed to fetch company:", error);
            }
        };

        if (current?.groups_holdings_id) {
            fetchCompany();
        }
    }, [current?.groups_holdings_id]);

    const crudForm = () => (
        <>
            <SingleSelectTextField
                name="group_name"
                label="Group Holding"
                value={current?.group_name}
                onChange={(e) => {
                    const selectedName = e.target.value;
                    const matchedGroup = groupHoldingData.find((g) => g.name === selectedName);
                    setCurrent((prev) => ({
                        ...prev,
                        group_name: selectedName,
                        groups_holdings_id: matchedGroup?._id || null,
                        // company_name: ''
                    }));
                }}
                names={groupHoldingData}
                isdisable={isEditing}
            />
            <SingleSelectTextField
                name="company_name"
                label="Company Name"
                value={current?.company_name}
                names={companyNameByGroupHoldingId}
                isdisable={isEditing}
                onChange={(e) => {
                    const selected = companyNameByGroupHoldingId.find(c => c.name === e.target.value);
                    setCurrent(prev => ({ ...prev, company_name: selected?.name, company_id: selected?._id }));
                }}
            />
            <MuiTextField label='Location' type='text' isRequired fieldName='location_name' handleChange={handleChange} value={current?.location_name} />
            <MuiTextField label='City' type='text' isRequired fieldName='city' handleChange={handleChange} value={current?.city} />
            <MuiTextField label='State' type='text' isRequired fieldName='state' handleChange={handleChange} value={current?.state} />

            <div className="row row-gap-2">
                <div className='col-6'>
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                </div>
                <div className='col-6 d-flex justify-content-end'>
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                        {isEditing ? 'Save Changes' : 'Create Location'}
                    </button>
                </div>
            </div>
        </>
    );
    return (
        <div>
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
            <div className='table_div p-3'>
                <div className='d-flex justify-content-between'>
                    <div className="search-bar-container">
                        <MuiSearchBar label='Search...' />
                        <button className='search-icon'><SearchIcon /></button>
                    </div>
                    <button className='crud_btn w-100' onClick={() => setIsModalOpen(true)}><AddIcon /> Add Location</button>
                </div>
                <div className="ag-theme-quartz" style={{ height: '600px', width: '100%', marginTop: '1rem' }}>
                    <AgGridReact
                        theme="legacy"
                        ref={useRef()}
                        rowData={data}
                        columnDefs={colDefs}
                        defaultColDef={{ sortable: true, filter: true }}
                        pagination={true}
                        rowSelection="single"
                    />
                </div>
            </div>

            <DeleteModal deleteForm={deleteModal} deleteTitle="Delete Location" isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />
            <SmallSizeModal crudForm={crudForm} crudTitle="Add Location" isEditing={isEditing} editCrudTitle="Edit Location" isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
    );
};

export default Location;
