import React, { useState } from 'react';
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


const dummuJsonData = [
  {
    "id": 1744096161424,
    "user_name": "rupa",
    "email_id": "jha@gmail.com",
    "role": "Admin",
    "status": "Active",
    "group_holding":"Tata",
    "company":'xyz',
    "location":"Mumbai",
    "temporary_password": "password12",
    "access_modules": [
      "Admin",
      "Editor"
    ]
  },
  {
    "id": 1744096161425,
    "user_name": "rupa",
    "email_id": "jha@gmail.com",
    "role": "Admin",
    "status": "Inactive",
    "temporary_password": "password12",
    "group_holding":"Tata",
    "company":'xyz',
    "location":"Mumbai",
    "access_modules": [
      "Admin",
      "Editor"
    ]
  },
  {
    "id": 1744096161426,
    "user_name": "rupa",
    "email_id": "jha@gmail.com",
    "role": "Admin",
    "status": "Active",
    "temporary_password": "password12",
    "group_holding":"Tata",
    "company":'xyz',
    "location":"Mumbai",
    "access_modules": [
      "Admin",
      "Editor"
    ]
  },
  {
    "id": 1744096161427,
    "user_name": "rupa",
    "email_id": "jha@gmail.com",
    "role": "Admin",
    "status": "Inactive",
    "temporary_password": "password12",
    "group_holding":"Tata",
    "company":'xyz',
    "location":"Mumbai",
    "access_modules": [
      "Admin",
      "Editor"
    ]
  },
  {
    "id": 1744096161428,
    "user_name": "rupa",
    "email_id": "jha@gmail.com",
    "role": "Admin",
    "status": "Active",
    "temporary_password": "password12",
    "group_holding":"Tata",
    "company":'xyz',
    "location":"Mumbai",
    "access_modules": [
      "Admin",
      "Editor"
    ]
  },
  {
    "id": 1744096161429,
    "user_name": "rupa",
    "email_id": "jha@gmail.com",
    "role": "Admin",
    "status": "Inactive",
    "temporary_password": "password12",
    "group_holding":"Tata",
    "company":'xyz',
    "location":"Mumbai",
    "access_modules": [
      "Admin",
      "Editor"
    ]
  },
]

const AddUser = () => {
  // const [data, setData] = useState([]);
  // if you want to show dummy jason data 
  const [data, setData] = useState(dummuJsonData);
  const [current, setCurrent] = useState({ id: null, user_name: '', email_id: '', role: '', temporary_password: "", status: '', desc: '', access_modules: [],group_holding:"" ,company:"",location:""});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  // Handle role access change
  const handleRoleAccessChange = (newValue) => {
    setCurrent((prev) => ({ ...prev, access_modules: newValue }));
  };
  // Handle Add or Edit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedData = data.map((item) =>
        item.id === current.id ? { ...item, user_name: current.user_name, email_id: current.email_id, role: current.role, temporary_password: current.temporary_password,group_holding:current.group_holding,company:current.company,location:current.location, status: current.status, desc: current.desc, access_modules: current.access_modules } : item
      );
      setData(updatedData);
    } else {
      const newData = { id: Date.now(), user_name: current.user_name, email_id: current.email_id, role: current.role, temporary_password: current.temporary_password,group_holding:current.group_holding,company:current.company ,location:current.location,status: current.status, desc: current.desc, access_modules: current.access_modules };
      setData((prev) => [...prev, newData]);
    }
    setCurrent({ id: null, user_name: '', email_id: '', role: '', temporary_password: '', group_holding:'',company:'',location:'',status: '', desc: '', access_modules: [] });
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
  const roleName = ['Admin', 'Super Admin', 'Client', 'Manager'];
  const userStatus = ['Active', 'Inactive'];


  const crudForm = () => {
    return (
      <div>
        {/* <form onSubmit={handleSubmit}> */}
        <div className='d-lg-flex d-md-flex justify-content-between  gap-3'>
          <MuiTextField label='Full Name' type='text' isRequired={true} fieldName='user_name' handleChange={handleChange} value={current.user_name} />
          <MuiTextField label='email' type='email' isRequired={true} fieldName='email_id' handleChange={handleChange} value={current.email_id} />
        </div>
        <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
          <SingleSelectTextField name="status" label="status" value={current.status} onChange={(e) => setCurrent((prev) => ({ ...prev, status: e.target.value }))} names={userStatus} />
          <PasswordInput name='temporary_password' label="Temporary Password" isRequired={true} handleChange={handleChange} value={current.temporary_password} />
          <SingleSelectTextField name="role" label="role" value={current.role} onChange={(e) => setCurrent((prev) => ({ ...prev, role: e.target.value }))} names={roleName} />

        </div>
        <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
          {/* <SingleSelectTextField name="User" label="User" value={current.user_name} onChange={(e) => setCurrent((prev) => ({ ...prev, user_name: e.target.value }))} names={userStatus} /> */}

          {/* <MuiTextField label='User Type' type='text' isRequired={true} fieldName='user_name' handleChange={handleChange} value={current.user_name} /> */}
          {/* <MultipleSelectTextFields label='Role Access' value={current.access_modules} onChange={handleRoleAccessChange} names={names} /> */}

        </div>

        <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
          <SingleSelectTextField name="Group Holding" label="Group Holding" value={current.group_holding} onChange={(e) => setCurrent((prev) => ({ ...prev, group_holding: e.target.value }))} names={userStatus} />
          <SingleSelectTextField name="Company" label="Company" value={current.company} onChange={(e) => setCurrent((prev) => ({ ...prev, company: e.target.value }))} names={userStatus} />
          <SingleSelectTextField name="Location" label="Location" value={current.location} onChange={(e) => setCurrent((prev) => ({ ...prev, location: e.target.value }))} names={roleName} />

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
          name="email_id"
          value={current.email_id}
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
            <MultipleSelectFields placeholder='Filter By Role' roleName={roleName} />
          </div>


          <div className='d-lg-flex d-md-flex  justify-content-end mb-3'>
            <div className='pe-2'>
              <button className='crud_btn' onClick={openModal}>
                <span><AddIcon /></span> <span className='button-style'>Add New User</span>
              </button>
            </div>
            <div>
              <button className='crud_btn' onClick={handleDeleteAll} disabled={selectedRows.length === 0}>
                <span className='button-style'> Delete All</span>
              </button>
            </div>

            <Modal crudForm={crudForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
          </div>
        </div>

        <div className='table_div2'>
          <table className='table_tag'>
            <thead className='table_head_tag'>
              <tr >
                <th className='table_th_tag ps-2 pe-2 check_box_column'>
                  {/* Select All checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className='table_th_tag action_column ps-2 pe-2'>Actions</th>

                <th className='table_th_tag  ps-2 pe-2'><span>User Name</span>
                  <span className='ms-4'>
                    <ExpandCircleDownIcon className='table_th_icon' />

                  </span>

                  {/* <div class="dropdown-menu table_th_icon_menu" aria-labelledby="dropdownMenu2">
    <button class="dropdown-item" type="button">Action</button>
    <button class="dropdown-item" type="button">Another action</button>
    <button class="dropdown-item" type="button">Something else here</button>
  </div> */}
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
                {/* <th className="table_th_tag ps-2 pe-2"><span>Access Modules</span><span className='ms-4'><ExpandCircleDownIcon className='table_th_icon' /></span></th> */}
                {/* <th className='table_th_tag  ps-2 pe-2'><span>Description</span><span className='ms-4'><ExpandCircleDownIcon className='table_th_icon' /></span></th> */}
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
                    <td className='  ps-2 pe-2 table_td sticky_col'>
                      {/* Individual row checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={(e) => handleCheckboxChange(e, item.id)}
                      />
                    </td>
                    <td className='d-flex table_td  ps-2 pe-2 justify-content-between sticky_col'>
                      <div>
                        <button className='btn  mt-1 btn-sm' onClick={() => handleEdit(item.id)}><EditIcon className='action_icon' /></button>
                      </div>
                      <div>
                        <button className='btn  mt-1 btn-sm' onClick={() => handleDelete(item.id)}><DeleteIcon className='action_icon' /></button>
                      </div>
                    </td>
                    <td className='  ps-2 pe-2'>{item.user_name}</td>
                    <td className='  ps-2 pe-2'>{item.email_id}</td>
                    <td className='  ps-2 pe-2'>{item.role}</td>
                    <td className='  ps-2 pe-2'><span className={`${item.status === 'Active' ? 'active_status_badge' : 'inactive_status_badge'}`}>{item.status}</span></td>
                    <td className='  ps-2 pe-2'>{item.temporary_password}</td>
                    {/* <td className=" ps-2 pe-2">{item.access_modules.join(', ')}</td> */}
                    <td className=" ps-2 pe-2">{item.group_holding}</td>
                    <td className=" ps-2 pe-2">{item.company}</td>
                    <td className=" ps-2 pe-2">{item.location}</td>
                    {/* <td className='  ps-2 pe-2'>{item.desc}</td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="justify-content-between pagination mt-3">
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
        </div>
      </div>
    </div>
  );
};

export default AddUser;
