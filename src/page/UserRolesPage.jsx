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


const dummuJsonData = [
  {
    "id": 1744096161424,
    "name": "rupa",
    "age": "",
    "desc": "NA",
    "roleAccess": [
      "Admin",
      "Editor"
    ]
  },
  {
    "id": 1744096172140,
    "name": "RUAP JHA",
    "age": "",
    "desc": "NA",
    "roleAccess": [
      "Editor"
    ]
  },
  {
    "id": 1744096188895,
    "name": "SHIVAM",
    "age": "",
    "desc": "NA",
    "roleAccess": [
      "Viewer",
      "Manager"
    ]
  },
  {
    "id": 1744096201341,
    "name": "YASH",
    "age": "",
    "desc": "NA",
    "roleAccess": [
      "Admin"
    ]
  },
  {
    "id": 1744096214025,
    "name": "NEHA",
    "age": "",
    "desc": "NA",
    "roleAccess": [
      "Editor",
      "Viewer"
    ]
  },
  {
    "id": 1744096228460,
    "name": "CHARCOL",
    "age": "",
    "desc": "NA",
    "roleAccess": [
      "Viewer"
    ]
  },
  {
    "id": 1744096251027,
    "name": "MINAL",
    "age": "",
    "desc": "NA",
    "roleAccess": [
      "Manager"
    ]
  },
  {
    "id": 1744096267626,
    "name": "RATHI",
    "age": "",
    "desc": "NA",
    "roleAccess": [
      "Developer"
    ]
  },
  {
    "id": 1744096267626,
    "name": "RATHI",
    "age": "",
    "desc": "NA",
    "roleAccess": [
      "Developer"
    ]
  },
  {
    "id": 1744096267626,
    "name": "RATHI",
    "age": "",
    "desc": "NA",
    "roleAccess": [
      "Developer"
    ]
  },
  {
    "id": 1744096267626,
    "name": "RATHI",
    "age": "",
    "desc": "NA",
    "roleAccess": [
      "Developer"
    ]
  },
  {
    "id": 1744096267626,
    "name": "RATHI",
    "age": "",
    "desc": "NA",
    "roleAccess": [
      "Developer"
    ]
  },
  {
    "id": 1744096267626,
    "name": "RATHI",
    "age": "",
    "desc": "NA",
    "roleAccess": [
      "Developer"
    ]
  }

]

const UserRolesPage = () => {
  // const [data, setData] = useState([]);
  // if you want to show dummy jason data 
  const [data, setData] = useState(dummuJsonData);
  const [current, setCurrent] = useState({ id: null, name: '', age: '', desc: '', roleAccess: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust the number of items per page
  // Role wise access
  const names = [
    'Admin',
    'Editor',
    'Viewer',
    'Manager',
    'Developer',
  ];
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };
  // Handle role access change
  const handleRoleAccessChange = (newValue) => {
    setCurrent((prev) => ({ ...prev, roleAccess: newValue }));
  };
  // Handle Add or Edit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedData = data.map((item) =>
        item.id === current.id ? { ...item, name: current.name, age: current.age, desc: current.desc, roleAccess: current.roleAccess } : item
      );
      setData(updatedData);
    } else {
      const newData = { id: Date.now(), name: current.name, age: current.age, desc: current.desc, roleAccess: current.roleAccess };
      setData((prev) => [...prev, newData]);
    }
    setCurrent({ id: null, name: '', age: '', desc: '', roleAccess: [] });
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
  const crudForm = () => {
    return (
      <div>
        {/* <form onSubmit={handleSubmit}> */}
        <div className='d-lg-flex d-md-flex justify-content-between  gap-3'>
            <MuiTextField label='Full Name' type='text' isRequired={true} fieldName='name' handleChange={handleChange} value={current.name} />
            <MuiTextField label='email' type='email' isRequired={true} fieldName='name' handleChange={handleChange} value={current.name} />
        </div>
        <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
            <MuiTextField label='Contact No' type='number' isRequired={true} fieldName='name' handleChange={handleChange} value={current.name} />
            <MuiTextField label='Designation' type='text' isRequired={true} fieldName='name' handleChange={handleChange} value={current.name} />
        </div>
        <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
            <MuiTextField label='User Type' type='text' isRequired={true} fieldName='name' handleChange={handleChange} value={current.name} />
            <MuiTextField label='Status' type='text' isRequired={true} fieldName='name' handleChange={handleChange} value={current.name} />
        </div>
        <div className='mb-3'>
          <MultipleSelectTextFields label='Role Access' value={current.roleAccess} onChange={handleRoleAccessChange} names={names} />
        </div>
        <div className='d-flex justify-content-between mt-2 mb-3'>
          <MuiTextAreaField value={current.desc} handleChange={handleChange} name='desc' label='Description' />
        </div>

        <div className="row row-gap-2">
          <div className='col col-12 col-md-6'>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
          </div>
          <div className='col col-12 col-md-6'>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{isEditing ? 'Update' : 'Add'}</button>
          </div>
        </div>
        {/* </form> */}
      </div>

    )

  }
  const crudTitle = "Create User & Add Role"
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
          name="age"
          value={current.age}
          onChange={handleChange}
          placeholder="Age"
          required
        />
        <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
      </form> */}

      {/* Button to Delete All Selected Rows */}


      {/* Table to display data */}
      <div className='table_div p-3'>
        <div className='d-flex justify-content-end mb-3'>
          {/* <div class="search_container">
            <div class="search">
              <input type="text" placeholder="Search..." />
              <button type="submit"><SearchIcon /></button>
            </div>
          </div> */}

          <div className='pe-2'>
            <button className='crud_btn' onClick={openModal}>
              <span><AddIcon /></span> <span>Add Record</span>
            </button>
          </div>
          <div>
            <button className='crud_btn' onClick={handleDeleteAll} disabled={selectedRows.length === 0}>
              Delete All
            </button>
          </div>

          <Modal crudForm={crudForm} crudTitle={crudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
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

                <th className='table_th_tag  ps-2 pe-2'><span>Name</span>
                  <span className='ms-4'>
                    <ExpandCircleDownIcon className='table_th_icon' />

                  </span>
                  {/* <div class="dropdown-menu table_th_icon_menu" aria-labelledby="dropdownMenu2">
    <button class="dropdown-item" type="button">Action</button>
    <button class="dropdown-item" type="button">Another action</button>
    <button class="dropdown-item" type="button">Something else here</button>
  </div> */}
                </th>
                <th className="table_th_tag ps-2 pe-2"><span>Role Access</span><span className='ms-4'><ExpandCircleDownIcon className='table_th_icon' /></span></th>
                <th className='table_th_tag  ps-2 pe-2'><span>Description</span><span className='ms-4'><ExpandCircleDownIcon className='table_th_icon' /></span></th>
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
                    <td className='  ps-2 pe-2'>{item.name}</td>
                    <td className=" ps-2 pe-2">{item.roleAccess.join(', ')}</td>
                    <td className='  ps-2 pe-2'>{item.desc}</td>
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

export default UserRolesPage;
