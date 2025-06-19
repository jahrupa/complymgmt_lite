import React, { useState, useEffect, useRef } from 'react';
import '../style/useRole.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '../component/Modal';
import MuiTextAreaField from '../component/MuiInputs/MuiTextAreaField';
import MultipleSelectTextFields from '../component/MuiInputs/MultipleSelectTextFields';
import MuiTextField from '../component/MuiInputs/MuiTextField';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import SingleSelectTextField from '../component/MuiInputs/SingleSelectTextField';
import PasswordInput from '../component/MuiInputs/PasswordInput';
import MultipleSelectFields from '../component/MuiInputs/MultipleSelectFields';
import MuiSearchBar from '../component/MuiInputs/MuiSearchBar';
import Toggle from '../component/Toggle';
import { fetchAllUser, fetchAllGroupHolding, deleteUserById, fetchAllUserName, fetchAllCompaniesName, createUser, updateUserById, fetchAllLocationName } from '../api/Service';
import DeleteModal from '../component/DeleteModal';
import Snackbars from '../component/Snackbars';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
// Register module
ModuleRegistry.registerModules([AllCommunityModule]);


const dummuJsonData = [
  {
    "id": 1744096161424,
    "username": "rupa",
    "email": "jha@gmail.com",
    "role_name": "Admin",
    "status": "Active",
    "group_holding": "Tata",
    "company_name": 'xyz',
    "location": "Mumbai",
    "password": "password12",
    "access_modules": [
      "Admin",
      "Editor"
    ]
  },
  {
    "id": 1744096161425,
    "username": "rupa",
    "email": "jha@gmail.com",
    "role_name": "Admin",
    "status": "Inactive",
    "password": "password12",
    "group_holding": "Tata",
    "company_name": 'xyz',
    "location": "Mumbai",
    "access_modules": [
      "Admin",
      "Editor"
    ]
  },
  {
    "id": 1744096161426,
    "username": "rupa",
    "email": "jha@gmail.com",
    "role_name": "Admin",
    "status": "Active",
    "password": "password12",
    "group_holding": "Tata",
    "company_name": 'xyz',
    "location": "Mumbai",
    "access_modules": [
      "Admin",
      "Editor"
    ]
  },
  {
    "id": 1744096161427,
    "username": "rupa",
    "email": "jha@gmail.com",
    "role_name": "Admin",
    "status": "Inactive",
    "password": "password12",
    "group_holding": "Tata",
    "company_name": 'xyz',
    "location": "Mumbai",
    "access_modules": [
      "Admin",
      "Editor"
    ]
  },
  {
    "id": 1744096161428,
    "username": "rupa",
    "email": "jha@gmail.com",
    "role_name": "Admin",
    "status": "Active",
    "password": "password12",
    "group_holding": "Tata",
    "company_name": 'xyz',
    "location": "Mumbai",
    "access_modules": [
      "Admin",
      "Editor"
    ]
  },
  {
    "id": 1744096161429,
    "username": "rupa",
    "email": "jha@gmail.com",
    "role_name": "Admin",
    "status": "Inactive",
    "password": "password12",
    "group_holding": "Tata",
    "company_name": 'xyz',
    "location": "Mumbai",
    "access_modules": [
      "Admin",
      "Editor"
    ]
  },
]

const UserRolesPage = () => {
  // const [data, setData] = useState([]);
  // if you want to show dummy jason data 
  const [data, setData] = useState(dummuJsonData);
  const [current, setCurrent] = useState({ user_id: null, username: '', email: '', role_name: '', role_id: null, password: "", status: 'Active', desc: '', access_modules: [], group_holding_name: "", group_holding_id: null, company_name: "", company_id: null, location_name: "", location_id: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [groupHoldingName, setGroupHoldingName] = useState([])
  const [companyName, setCompanyName] = useState([])
  const [locationName, setLocationName] = useState([])
  const [rolesName, setRolesName] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
  // Handle role_name access change
  const handleRoleAccessChange = (newValue) => {
    setCurrent((prev) => ({ ...prev, access_modules: newValue }));
  };
  // Handle Add or Edit
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (isEditing) {
  //     const updatedData = data.map((item) =>
  //       item.id === current.id ? { ...item, username: current.username, email: current.email, role_name: current.role_name, password: current.password, group_holding: current.group_holding, company_name: current.company_name, location: current.location, status: current.status, desc: current.desc, access_modules: current.access_modules } : item
  //     );
  //     setData(updatedData);
  //   } else {
  //     const newData = { id: Date.now(), username: current.username, email: current.email, role_name: current.role_name, password: current.password, group_holding: current.group_holding, company_name: current.company_name, location: current.location, status: current.status, desc: current.desc, access_modules: current.access_modules };
  //     setData((prev) => [...prev, newData]);
  //   }
  //   setCurrent({ id: null, username: '', email: '', role_name: '', password: '', group_holding: '', company_name: '', location: '', status: '', desc: '', access_modules: [] });
  //   setIsEditing(false);
  //   setIsModalOpen(false);

  // };

  const handleSubmit = async (e) => {
    // e?.preventDefault();

    const payload = {
      "Name": "Rupa Jha",
      "Email": current?.email,
      "MobileNumber": "2345876543",
      "IsKarma": false,
      "Username": current?.username,
      "Password": current?.password,
      "IsActive": true,
      "CreatedBy": 1
    };

    try {
      let response;
      if (isEditing) {
        // Update existing company
        response = await updateUserById(userId, payload);
      } else {
        // Create new company
        response = await createUser(payload);
      }

      // ✅ Get the message from response
      const message = response?.message;
      console.log(message, 'message')
      setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'success' });

      // Refresh data
      const updatedData = await fetchAllUser();
      setData(updatedData);
    } catch (error) {
      console.error("Error saving user:", error);

      // Extract message from error response if available
      const errorMessage =
        error?.response?.data?.message || // for Axios
        error?.message ||                 // native JS error
        "Failed to save user";            // fallback message

      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: errorMessage,
        severityType: 'error'
      });
    }

    setIsEditing(false);
    setIsModalOpen(false);
  };

  // Handle Edit
  const handleEdit = (user_id) => {
    const item = data.find((item) => item.user_id === user_id);
    setCurrent(item);
    setIsEditing(true);
    setIsModalOpen(true);
    setUserId(user_id)

  };

  // Handle Delete
  // const handleDelete = (id) => {
  //   const filteredData = data.filter((item) => item.id !== id);
  //   setData(filteredData);
  //   setSelectedRows(selectedRows.filter((rowId) => rowId !== id)); // Remove deleted row from selected
  // };

  // Handle Delete
  const handleDelete = async (userId) => {
    try {
      const response = await deleteUserById(userId);
      const message = response?.message || "User deleted successfully";

      // Refresh data
      const updatedData = await fetchAllUser();
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
      console.error("Error deleting user:", error);

      // Extract error message safely
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete user";

      // Show error snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: errorMessage,
        severityType: 'error',
      });
    }
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
  const roleName = ['Admin', 'Super Admin', 'Client', 'Manager'];
  const userStatus = [{ id: 1, name: 'Active' }, { id: 2, name: 'Inactive' }];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, groupHolding, roleName, companyName, getLocationName] = await Promise.all([
          fetchAllUser(),
          fetchAllGroupHolding(),
          fetchAllUserName(),
          fetchAllCompaniesName(),
          fetchAllLocationName(),
        ]);
        setData(userData);
        setGroupHoldingName(groupHolding);
        setRolesName(roleName)
        setCompanyName(companyName)
        setLocationName(getLocationName)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const crudForm = () => {
    return (
      <div>
        {/* <form onSubmit={handleSubmit}> */}
        <div className='d-lg-flex d-md-flex justify-content-between  gap-3'>
          <MuiTextField label='Full Name' type='text' isRequired={true} fieldName='username' handleChange={handleChange} value={current.username} />
          <MuiTextField label='email' type='email' isRequired={true} fieldName='email' handleChange={handleChange} value={current.email} />
        </div>
        <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
          <SingleSelectTextField name="status" label="status" value={current.status} onChange={(e) => setCurrent((prev) => ({ ...prev, status: e.target.value }))} names={userStatus} />
          <PasswordInput name='password' label="Temporary Password" isRequired={true} handleChange={handleChange} value={current.password} />
          {/* <SingleSelectTextField name="role_name" label="role_name" value={current.role_name} onChange={(e) => setCurrent((prev) => ({ ...prev, role_name: e.target.value }))} names={roleName} /> */}
          <SingleSelectTextField
            name="role_name"
            label="Role"
            value={current.role_name}
            onChange={(e) => {
              const selectedName = e.target.value;
              const matchedRole = rolesName.find(
                (g) => g.name === selectedName
              );
              setCurrent((prev) => ({
                ...prev,
                role_name: selectedName,
                groups_holdings_id: matchedRole?.id || null,
              }));
            }}
            names={rolesName}
          />
        </div>
        <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
          {/* <SingleSelectTextField name="User" label="User" value={current.username} onChange={(e) => setCurrent((prev) => ({ ...prev, username: e.target.value }))} names={userStatus} /> */}

          {/* <MuiTextField label='User Type' type='text' isRequired={true} fieldName='username' handleChange={handleChange} value={current.username} /> */}
          {/* <MultipleSelectTextFields label='Role Access' value={current.access_modules} onChange={handleRoleAccessChange} names={names} /> */}

        </div>

        <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
          {/* <SingleSelectTextField name="Group Holding" label="Group Holding" value={current.group_holding} onChange={(e) => setCurrent((prev) => ({ ...prev, group_holding: e.target.value }))} names={userStatus} /> */}
          <SingleSelectTextField
            name="group_holding_name"
            label="Group Holding"
            value={current.group_holding_name}
            onChange={(e) => {
              const selectedName = e.target.value;
              const matchedGroup = groupHoldingName.find(
                (g) => g.name === selectedName
              );
              setCurrent((prev) => ({
                ...prev,
                group_holding_name: selectedName,
                groups_holdings_id: matchedGroup?.id || null,
              }));
            }}
            names={groupHoldingName}
          />
          {/* <SingleSelectTextField name="Company" label="Company" value={current.company_name} onChange={(e) => setCurrent((prev) => ({ ...prev, company_name: e.target.value }))} names={userStatus} /> */}
          <SingleSelectTextField name="company_name" label="Company Name" value={current?.company_name}
            onChange={(e) => {
              const selectedName = e.target.value;
              const matchedCompany = companyName.find(
                (g) => g.name === selectedName
              );
              setCurrent((prev) => ({
                ...prev,
                company_name: selectedName,
                company_id: matchedCompany?.id || null,
              }));
            }}
            names={companyName}
            isdisable={isEditing ? true : false}

          />
          <SingleSelectTextField name="location_name" label="Location" value={current?.location_name}
            onChange={(e) => {
              const selectedName = e.target.value;
              const matchedLocation = locationName.find(
                (g) => g.name === selectedName
              );
              setCurrent((prev) => ({
                ...prev,
                location_name: selectedName,
                location_id: matchedLocation?.id || null,
              }));
            }}
            names={locationName}
            isdisable={isEditing ? true : false}

          />
          {/* <SingleSelectTextField name="Location" label="Location" value={current.location} onChange={(e) => setCurrent((prev) => ({ ...prev, location: e.target.value }))} names={roleName} /> */}

        </div>

        <div className="row row-gap-2">
          <div className='col col-12 col-md-6'>
            <button type="button" className="btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
          </div>
          <div className='col col-12 col-md-6 d-flex justify-content-end'>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{isEditing ? <span className='button-style'>Save Changes</span> : <span className='button-style'>Create User</span>}</button>
          </div>
        </div>
        {/* </form> */}
      </div>

    )

  }
  const crudTitle = "Add New User Form"
  const editCrudTitle = "Edit User"

  const deleteModal = () => {
    return (
      <div>
        <div className='delete_message p-4'>
          Are you sure you want to delete <DeleteIcon className='action_icon' /> this user?
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


  // "id": 1744096161424,
  //     "username": "rupa",
  //     "email": "jha@gmail.com",
  //     "role_name": "Admin",
  //     "status": "Active",
  //     "group_holding": "Tata",
  //     "company_name": 'xyz',
  //     "location": "Mumbai",
  //     "password": "password12",
  //     "access_modules": [
  //       "Admin",
  //       "Editor"
  //     ]
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
      field: 'role_name', headerName: 'Role Name', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true,
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
    { field: 'username', headerName: 'User Name', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
    {
            field: 'status',
            headerName: 'Status',
            editable: false,
            filter: true,
            headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
            cellRenderer: (params) => {
              const value = params.value;
              const iconUrl = value === 'Active'
                ? "https://www.ag-grid.com/example-assets/icons/tick-in-circle.png"
                : "https://www.ag-grid.com/example-assets/icons/cross-in-circle.png";
          
              return (
                <div >
                  <img src={iconUrl} alt={value} />
                </div>
              );
            }
          },
           {
      field: 'email',
      headerName: 'Email',
      editable: false,
      filter: true,
      headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
    },
    {
      field: 'password',
      headerName: 'Password',
      editable: false,
      filter: true,
      headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
    },


    { field: 'location', headerName: 'Location', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
    { field: 'group_holding', headerName: 'Group Holding', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
    { field: 'company_name', headerName: 'Company Name', editable: true, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },


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
      <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />

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
          name="email"
          value={current.email}
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
            {/* <MultipleSelectFields placeholder='Filter By Role' roleName={roleName} /> */}
          </div>


          <div className='d-lg-flex d-md-flex  justify-content-end mb-3'>
            <div className='pe-2'>
              <button className='crud_btn' onClick={openModal}>
                <span><AddIcon /></span> <span className='button-style'>Add New User</span>
              </button>
            </div>
            <DeleteModal deleteForm={deleteModal} deleteTitle='Delete User' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />
            <Modal crudForm={crudForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
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

        {/* <table className='table_tag'>
            <thead className='table_head_tag'>
              <tr >
                <th className='table_th_tag action_column ps-2 pe-2'>Actions</th>

                <th className='table_th_tag  ps-2 pe-2'><span>User Name</span>
                  <span className='ms-4'>
                    <ExpandCircleDownIcon className='table_th_icon' />

                  </span>
                </th>

                <th className='table_th_tag  ps-2 pe-2'><span>Email Id</span>
                  <span className='ms-4'>
                    <ExpandCircleDownIcon className='table_th_icon' />

                  </span>
                </th>
                <th className='table_th_tag  ps-2 pe-2'><span>Role</span>
                  <span className='ms-4'>
                    <ExpandCircleDownIcon className='table_th_icon' />
                  </span>
                </th>
                <th className='table_th_tag  ps-2 pe-2'><span>Status</span>
                  <span className='ms-4'>
                    <ExpandCircleDownIcon className='table_th_icon' />
                  </span>
                </th>
                <th className='table_th_tag  ps-2 pe-2'><span>Password</span>
                  <span className='ms-4'>
                    <ExpandCircleDownIcon className='table_th_icon' />
                  </span>
                </th>
                <th className="table_th_tag  ps-2 pe-2"><span>Group Holding</span><span className='ms-4'><ExpandCircleDownIcon className='table_th_icon' /></span></th>
                <th className="table_th_tag  ps-2 pe-2"><span>Company</span><span className='ms-4'><ExpandCircleDownIcon className='table_th_icon' /></span></th>
                <th className="table_th_tag  ps-2 pe-2"><span>Location</span><span className='ms-4'><ExpandCircleDownIcon className='table_th_icon' /></span></th>

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
                        <button className='btn  mt-1 btn-sm' onClick={() => handleEdit(item.user_id)}><EditIcon className='action_icon' /></button>
                      </div>
                      <div>
                        <button className='btn  mt-1 btn-sm' onClick={() => {
                          setUserId(item.user_id);
                          setIsDeleteModalOpen(true);
                        }}><DeleteIcon className='action_icon' /></button>
                      </div>
                    </td>
                    <td className=' table_td_font ps-2 pe-2'>{item.username}</td>
                    <td className=' table_td_font ps-2 pe-2'>{item.email}</td>
                    <td className=' table_td_font ps-2 pe-2'>{item.role_name ? item.role_name : '-'}</td>
                    <td className=' table_td_font ps-2 pe-2'><Toggle />
                    </td>
                    <td className=' table_td_font ps-2 pe-2'>{item.password}</td>
                    <td className="table_td_font ps-2 pe-2">{item.group_holding ? item.group_holding : "-"}</td>
                    <td className="table_td_font ps-2 pe-2">{item.company_name ? item.company_name : '-'}</td>
                    <td className="table_td_font ps-2 pe-2">{item.location ? item.location_name : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table> */}

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
      </div>
    </div>
  );
};

export default UserRolesPage;
