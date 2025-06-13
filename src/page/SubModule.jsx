
import React, { useRef, useState } from 'react';
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
ModuleRegistry.registerModules([AllCommunityModule]);

const dummuJsonData = [
    {
        id: 1744096161424,
        sub_module_name: "Tata",
        module_desc: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin",
        sub_module_id: ["tracker"]
    },
    {
        id: 1744096161425,
        sub_module_name: "Tata",
        module_desc: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin",
        sub_module_id: ["tracker"]
    },
    {
        id: 1744096161426,
        sub_module_name: "Tata",
        module_desc: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin",
        sub_module_id: ["tracker"]
    },
    {
        id: 1744096161427,
        sub_module_name: "Tata",
        module_desc: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin",
        sub_module_id: ["tracker"]
    },
    {
        id: 1744096161428,
        sub_module_name: "Tata",
        module_desc: "XYZ",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: "Mumbai",
        approved_by: "Admin",
        sub_module_id: ["tracker"]
    },
    {
        id: 1744096161429,
        sub_module_name: "Tata",
        module_desc: "XYZ",
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
    const [current, setCurrent] = useState({ id: null, sub_module_name: '', module_desc: '', created_at: '', location: "", updated_at: '', desc: '', approved_by: '', sub_module_id: [] });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userId, setUserId] = useState(null)

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // You can adjust the number of items per page


    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrent((prev) => ({ ...prev, [name]: value }));
    };

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
        setCurrent({ id: null, sub_module_name: '', module_desc: '', created_at: '', location: '', updated_at: '', desc: '', approved_by: '', sub_module_id: [] });
        setIsEditing(false);
        setIsModalOpen(false);

    };

    // Handle Edit
    const handleEdit = (id) => {
        const item = data.find((item) => item.id === id);
        setCurrent(item);
        setIsEditing(true);
        setIsModalOpen(true);

    };

    // Handle Delete
    const handleDelete = (id) => {
        setIsDeleteModalOpen(false)
        const filteredData = data.filter((item) => item.id !== id);
        setData(filteredData);
        setSelectedRows(selectedRows.filter((rowId) => rowId !== id)); // Remove deleted row from selected
    };

    // Handle Delete All Selected
    const handleDeleteAll = () => {
        const filteredData = data.filter((item) => !selectedRows.includes(item.id));
        setData(filteredData);
        setSelectedRows([]); // Clear selected rows after deletion
    };

    // Handle Select All checkbox
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = data.map((item) => item.id);
            setSelectedRows(allIds);
        } else {
            setSelectedRows([]);
        }
    };

    // Handle individual row checkbox
    const handleCheckboxChange = (e, id) => {
        if (e.target.checked) {
            setSelectedRows([...selectedRows, id]);
        } else {
            setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
        }
    };

    // Pagination Logic: Slicing the data to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

    // Pagination Button Handler
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Total number of pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

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



    const crudForm = () => {
        return (
            <div>
                {/* <form onSubmit={handleSubmit}> */}
                <div>
                    <MuiTextField label='Sub Module Name' type='text' isRequired={true} fieldName='sub_module_name' handleChange={handleChange} value={current.sub_module_name} />

                    {/* <MuiTextField label='Location' type='text' isRequired={true} fieldName='location' handleChange={handleChange} value={current.location} /> */}

                </div>
                <div className=''>
                    <MuiTextAreaField value={current.module_desc} handleChange={handleChange} name='module_desc' label='Sub Module Description' />

                    {/* <SingleSelectTextField name="sub_module_name" label="sub_module_name" value={current.sub_module_name} onChange={(e) => setCurrent((prev) => ({ ...prev, sub_module_name: e.target.value }))} names={groupHolding} /> */}

                </div>
                <div>
                    <SingleSelectTextField name="sub_module_id" label="sub Module" value={current.sub_module_id} onChange={(e) => setCurrent((prev) => ({ ...prev, sub_module_id: e.target.value }))} names={groupHolding} />

                </div>
                <div>
                    <SingleSelectTextField name="approved_by" label="Approved By" value={current.approved_by} onChange={(e) => setCurrent((prev) => ({ ...prev, approved_by: e.target.value }))} names={groupHolding} />

                </div>

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
                    Are you sure you want to delete <DeleteIcon className='action_icon' /> this user role?
                </div>

                <div className="row row-gap-2 mt-4">
                    <div className='col col-12 col-md-6'>
                        <button type="button" className="btn-sm btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col col-12 col-md-6 d-flex justify-content-end'>
                        <button type="submit"
                            className="btn-sm btn btn-primary"
                            onClick={() => handleDelete(userId)}>Yes, I'm sure</button>
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
                                setUserId(params.data.id); // OR .user_id based on your data
                            }}
                        >
                            <EditIcon fontSize="small" className="action_icon" />
                        </button>
                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                setUserId(params.data.id);
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            <DeleteIcon fontSize="small" className="action_icon" />
                        </button>
                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                setUserId(params.data.id);
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            <VisibilityIcon fontSize="small" className="action_icon" />
                        </button>
                        {/* <VisibilityIcon/> */}
                    </div>
                );
            }
        }
        ,

        { field: 'id', headerName: 'ID', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
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
        { field: 'sub_module_name', headerName: 'Sub Module Name', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'module_desc', headerName: 'Module Desc', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'sub_module_id', headerName: 'Sub Module Access', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'location', headerName: 'Location', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'created_at', headerName: 'Created At', editable: true, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'update_at', headerName: 'Updated At', editable: true, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },


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
            {/* Form for Create or Edit */}
            {/* <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={current.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="number"
          name="module_desc"
          value={current.module_desc}
          onChange={handleChange}
          placeholder="Age"
          required
        />
        <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
      </form> */}

            {/* Button to Delete All Selected Rows */}


            {/* Table to display data */}
            <div className='table_div p-3'>
                <div className='d-lg-flex d-md-flex  justify-content-between'>
                    <div className='d-flex h-100'>
                        <div class="search-bar-container h-25">
                            {/* <input type="text" placeholder="Search..." name="search" className='search-bar-input p-1 w-100' /> */}
                            <MuiSearchBar label='Search...' type='text' />
                            <button className='search-icon'><SearchIcon /></button>
                        </div>
                        <MultipleSelectFields placeholder='Filter By SubModule' roleName={groupHolding} />
                    </div>


                    <div className='d-lg-flex d-md-flex  justify-content-end mb-3'>
                        <div className='pe-2'>
                            <button className='crud_btn' onClick={openModal}>
                                <span><AddIcon /></span> <span className='button-style'>Add New SubModule</span>
                            </button>
                        </div>
                        <div>
                            <button className='crud_btn' onClick={handleDeleteAll} disabled={selectedRows.length === 0}>
                                <span className='button-style'> Delete All</span>
                            </button>
                        </div>
                        <DeleteModal deleteForm={deleteModal} deleteTitle='Delete User' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />
                        <SmallSizeModal crudForm={crudForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                    </div>
                </div>

                {/* <div className='table_div2'>
                    <table className='table_tag'>
                        <thead className='table_head_tag'>
                            <tr >
                                <th className='table_th_tag action_column ps-2 pe-2'>Actions</th>
                                <th className='table_th_tag  ps-2 pe-2'><span>Sub Module Name</span>
                                    <span className='ms-4'>
                                        <ExpandCircleDownIcon className='table_th_icon' />

                                    </span>
                                </th>

                                <th className='table_th_tag  ps-2 pe-2'><span>Sub Module Description</span>
                                    <span className='ms-4'>
                                        <ExpandCircleDownIcon className='table_th_icon' />

                                    </span>
                                </th>
                                <th className='table_th_tag  ps-2 pe-2'><span>Approved By</span>
                                    <span className='ms-4'>
                                        <ExpandCircleDownIcon className='table_th_icon' />

                                    </span>
                                </th>
                                <th className='table_th_tag  ps-2 pe-2'><span>Sub Module Access</span>
                                    <span className='ms-4'>
                                        <ExpandCircleDownIcon className='table_th_icon' />

                                    </span>
                                </th>
                                <th className='table_th_tag  ps-2 pe-2'><span>Created At</span>
                                    <span className='ms-4'>
                                        <ExpandCircleDownIcon className='table_th_icon' />
                                    </span>
                                </th>
                                <th className='table_th_tag  ps-2 pe-2'><span>Updated At</span>
                                    <span className='ms-4'>
                                        <ExpandCircleDownIcon className='table_th_icon' />
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: 'center', height: '300px' }}> <div className='no_data_found'><span><BackupTableIcon /></span><span>No data available</span></div></td>
                                </tr>
                            ) : (
                                currentData.map((item) => (
                                    <tr key={item.id} className='table_tr'>
                                       
                                        <td className='d-flex table_td  ps-2 pe-2 justify-content-between sticky_col'>
                                            <div>
                                                <button className='btn  mt-1 btn-sm' onClick={() => handleEdit(item.id)}><EditIcon className='action_icon' /></button>
                                            </div>
                                            <div>
                                                <button className='btn  mt-1 btn-sm' onClick={() => handleDelete(item.id)}><DeleteIcon className='action_icon' /></button>
                                            </div>
                                        </td>

                                        <td className='  ps-2 pe-2 table_td_tag_space'>{item.sub_module_name}</td>
                                        <td className='  ps-2 pe-2 table_td_tag_space'>{item.module_desc}</td>
                                        <td className='  ps-2 pe-2 table_td_tag_space'>{item.approved_by}</td>
                                        <td className='  ps-2 pe-2 table_td_tag_space'>{item.sub_module_id}</td>
                                        <td className='  ps-2 pe-2 table_td_tag_space'>{item.created_at}</td>
                                        <td className='  ps-2 pe-2 table_td_tag_space'>{item.updated_at}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div> */}

                {/* Pagination Controls */}
                {/* <div className="justify-content-between pagination mt-3">
                    <div className='selected_row_text'>
                        Selected Rows: {selectedRows.length}
                    </div>
                    <div className='d-flex'>
                        <button className='btn btn-sm pagination_btn' onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button className=' btn btn-sm h-75 pagination_btn' key={index + 1} onClick={() => paginate(index + 1)}>{index + 1}</button>
                        ))}
                        <button className='btn btn-sm pagination_btn ' onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                    </div>
                </div> */}
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
