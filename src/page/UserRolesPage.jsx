import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../style/useRole.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '../component/Modal';
import MuiTextAreaField from '../component/MuiInputs/MuiTextAreaField';
import MuiTextField from '../component/MuiInputs/MuiTextField';
import AddIcon from '@mui/icons-material/Add';
import PasswordInput from '../component/MuiInputs/PasswordInput';
import Toggle from '../component/Toggle';
import { fetchAllUser, deleteUserById, createUser, updateUserById, updateUserStatusId, bulkApproveAllPageData, updateUserApprovalStatusById } from '../api/service';
import DeleteModal from '../component/DeleteModal';
import Snackbars from '../component/Snackbars';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AnimatedSearchBar } from '../component/AnimatedSearchBar';
// Register module
ModuleRegistry.registerModules([AllCommunityModule]);

const UserRolesPage = () => {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState({ user_id: null, full_name: '', username: '', email: '', role_name: '', role_id: null, password: "", status: 'Active', user_description: '', access_modules: [], group_holding_name: "", group_holding_id: null, company_name: "", company_id: null, location_name: "", location_id: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const crudTitle = "Add New User Form"
  const editCrudTitle = "Edit User"
  
  const [errors, setErrors] = useState({});
  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
    severityType: '',
  });
  
  const validate = () => {
    let tempErrors = {};
    if (!current?.full_name) tempErrors.full_name = "Full name is required";
    if (!current?.email) tempErrors.email = "Email is required";
    if (!current?.username) tempErrors.username = "Username is required";
    if (!current?.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return; // Don't proceed if validation fails
    const CommonAttributes = {
      [isEditing ? "Updated_By" : "Created_By"]: localStorage.getItem("user_id") || "",
    };
    const payload = {
      "FullName": current?.full_name,
      "Email": current.email,
      UserDescription: current?.user_description,
      "Username": current?.username,
      "Password": current?.password,
      "UserType": null,
      "CommonAttributes": CommonAttributes,
      "UserAccessLevel": null
    }
    try {
      let response;
      if (isEditing) {
        // Update existing company
        response = await updateUserById(userId, payload);
      } else {
        // Create new company
        response = await createUser(payload);
      }

      //  Get the message from response
      const message = response?.message;
      console.log(response, 'response')
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
    setCurrent({
      full_name: '',
      email: '',
      username: '',
      password: '',
      user_description: ''
    });
  };

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

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
    setCurrent({
      full_name: '',
      email: '',
      username: '',
      password: '',
      user_description: ''
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const [userData] = await Promise.allSettled([
        fetchAllUser(),
      ]);

      if (userData.status === 'fulfilled') {
        setData(userData.value);
      } else {
        console.warn("fetchAllCompanies failed:", userData.reason);
      }
    };

    fetchData();
  }, []);

  const crudForm = () => {
    return (
      <div>
        <div className='d-lg-flex d-md-flex justify-content-between  gap-3'>
          <MuiTextField
            label='Full Name'
            type='text'
            isRequired={true}
            fieldName='full_name'
            handleChange={handleChange}
            value={current.full_name}
            error={!!errors.full_name}
            helperText={errors.full_name}
          />
          <MuiTextField
            label='email'
            type='email'
            isRequired={true}
            fieldName='email'
            handleChange={handleChange}
            value={current.email}
            error={!!errors.email}
            helperText={errors.email}
          />
        </div>
        <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
          <PasswordInput
            name='password'
            label="Temporary Password"
            isRequired={true}
            handleChange={handleChange}
            value={current.password}
            error={!!errors.password}
            helperText={errors.password}
          />
          <MuiTextField
            label='UserName'
            type='text'
            isRequired={true}
            fieldName='username'
            handleChange={handleChange}
            value={current.username}
            error={!!errors.username}
            helperText={errors.username}
          />
        </div>
        <div className=''>
          <MuiTextAreaField
            value={current.user_description}
            handleChange={handleChange}
            name='user_description'
            label='Description'
          />
        </div>
        <div className="row row-gap-2">
          <div className='col-6'>
            <button type="button" className="btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
          </div>
          <div className='col-6 d-flex justify-content-end'>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{isEditing ? <span className='button-style'>Save Changes</span> : <span className='button-style'>Create User</span>}</button>
          </div>
        </div>
      </div>

    )

  }
  

  const handleApproveAll = async () => {
    try {
      const response = await bulkApproveAllPageData('user');
      const message = response?.message
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
    const updatedData = await fetchAllUser();
    setData(updatedData);
  };

  const handleToggleChange = async (e, params) => {
    const newIsActive = {
      "IsActive": e.target.checked
    };
    try {
      const response = await updateUserStatusId(params.data._id, newIsActive);
      const message = response?.message
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
    const updatedData = await fetchAllUser();
    setData(updatedData);
  };

  const deleteModal = () => {
    return (
      <div>
        <div className='delete_message p-4'>
          Are you sure you want to delete <DeleteIcon className='action_icon' /> this user?
        </div>

        <div className="row row-gap-2 mt-4">
          <div className='col-6'>
            <button type="button" className="btn-sm btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
          </div>
          <div className='col-6 d-flex justify-content-end'>
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

  const handleCheckboxClick = async (rowId) => {
    const response = await updateUserApprovalStatusById(rowId);
    const message = response?.message
    
    setIsSnackbarsOpen({
      ...issnackbarsOpen,
      open: true,
      message,
      severityType: 'success',
    });

    const updatedData = await fetchAllUser();
    setData(updatedData);
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
                setUserId(params.data._id); // OR .user_id based on your data
              }}
            >
              <EditIcon fontSize="small" className="action_icon" />
            </button>
            <button
              className="btn btn-sm"
              onClick={() => {
                setUserId(params.data._id);
                setIsDeleteModalOpen(true);
              }}
            >
              <DeleteIcon fontSize="small" className="action_icon" />
            </button>
          </div>
        );
      }
    },
    // { field: '_id', headerName: 'ID', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
    { field: 'full_name', headerName: 'Full Name', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
    {
      field: 'role_name', width: 300, headerName: 'Role Name', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true,
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
              // checked={true}
              // readOnly // ✅ prevent manual toggle unless you implement onChange
              checked={status === 1}
              readOnly={status === 1}
              style={{ cursor: 'default', width: 15, height: 15, accentColor: 'orange' }}
              onClick={status !== 1 ? () => handleCheckboxClick(params.data._id) : null}
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
    { field: 'user_description', headerName: ' Description', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
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
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    editable: true,
    headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
  };

  const onRowValueChanged = (event) => {
    // console.log('Row updated:', event.data);
  };
  
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      'quickFilterText',
      document.getElementById('filter-text-box').value
    );
  }, []);

  return (
    <div>
      <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
      <DeleteModal deleteForm={deleteModal} deleteTitle='Delete User' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />
      <Modal crudForm={crudForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} closeModal={closeModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <div className='service-tracker-inner-page-header d-lg-flex d-md-flex'>
        <div className="notification-page-title">
          <div>
            <h1>Create User</h1>
          </div>
        </div>
        <div className='d-lg-flex d-md-flex gap-2 mt-2'>
          <button className='crud_btn w-100 mb-2' onClick={openModal}>
            <span><AddIcon /></span> <span className='button-style'>Add New User</span>
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
      {/* Table to display data */}
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

export default UserRolesPage;
