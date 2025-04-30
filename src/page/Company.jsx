
import React, { useState } from 'react';
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


const dummuJsonData = [
  {
    id: 1744096161424,
    company_name: "Tata",
    group_holding: "XYZ",
    role: new Date().toISOString(),
    status: new Date().toISOString(),
    temporary_password: "password12",
    access_modules: ["Admin", "Editor"]
  },
  {
    id: 1744096161425,
    company_name: "Tata",
    group_holding: "XYZ",
    role: new Date().toISOString(),
    status: new Date().toISOString(),
    temporary_password: "password12",
    access_modules: ["Admin", "Editor"]
  },
  {
    id: 1744096161426,
    company_name: "Tata",
    group_holding: "XYZ",
    role: new Date().toISOString(),
    status: new Date().toISOString(),
    temporary_password: "password12",
    access_modules: ["Admin", "Editor"]
  },
  {
    id: 1744096161427,
    company_name: "Tata",
    group_holding: "XYZ",
    role: new Date().toISOString(),
    status: new Date().toISOString(),
    temporary_password: "password12",
    access_modules: ["Admin", "Editor"]
  },
  {
    id: 1744096161428,
    company_name: "Tata",
    group_holding: "XYZ",
    role: new Date().toISOString(),
    status:new Date().toISOString(),
    temporary_password: "password12",
    access_modules: ["Admin", "Editor"]
  },
  {
    id: 1744096161429,
    company_name: "Tata",
    group_holding: "XYZ",
    role: new Date().toISOString(),
    status: new Date().toISOString(),
    temporary_password: "password12",
    access_modules: ["Admin", "Editor"]
  },
];

const Company = () => {
  // const [data, setData] = useState([]);
  // if you want to show dummy jason data 
  const [data, setData] = useState(dummuJsonData);
  const [current, setCurrent] = useState({ id: null, company_name: '', group_holding: '', role: '', temporary_password: "", status: '', desc: '', access_modules: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        item.id === current.id ? { ...item, company_name: current.company_name, group_holding: current.group_holding, role: current.role, temporary_password: current.temporary_password, status: current.status, desc: current.desc, access_modules: current.access_modules } : item
      );
      setData(updatedData);
    } else {
      const newData = { id: Date.now(), company_name: current.company_name, group_holding: current.group_holding, role: current.role, temporary_password: current.temporary_password, status: current.status, desc: current.desc, access_modules: current.access_modules };
      setData((prev) => [...prev, newData]);
    }
    setCurrent({ id: null, company_name: '', group_holding: '', role: '', temporary_password: '', status: '', desc: '', access_modules: [] });
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
        <div className='d-lg-flex d-md-flex justify-content-between  gap-3'>
          <MuiTextField label='Company Name' type='text' isRequired={true} fieldName='company_name' handleChange={handleChange} value={current.company_name} />
          <SingleSelectTextField name="group_holding" label="Group Holding" value={current.group_holding} onChange={(e) => setCurrent((prev) => ({ ...prev, group_holding: e.target.value }))} names={groupHolding} />

        </div>

        <div className="row row-gap-2">
          <div className='col col-12 col-md-6'>
            <button type="button" className="btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
          </div>
          <div className='col col-12 col-md-6 d-flex justify-content-end'>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{isEditing ? <span className='button-style'>Save Changes</span> : <span className='button-style'>Create company</span>}</button>
          </div>
        </div>
        {/* </form> */}
      </div>

    )

  }
  const crudTitle = "Add New company"
  const editCrudTitle = "Edit company"

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
          name="group_holding"
          value={current.group_holding}
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
              <MuiSearchBar label='Search...' type='text'/>
              <button className='search-icon'><SearchIcon /></button>
            </div>
              <MultipleSelectFields placeholder='Filter By Group Holding'roleName={groupHolding} />
          </div>


          <div className='d-lg-flex d-md-flex  justify-content-end mb-3'>
            <div className='pe-2'>
              <button className='crud_btn' onClick={openModal}>
                <span><AddIcon /></span> <span className='button-style'>Add New company</span>
              </button>
            </div>
            <div>
              <button className='crud_btn' onClick={handleDeleteAll} disabled={selectedRows.length === 0}>
                <span className='button-style'> Delete All</span>
              </button>
            </div>

            <SmallSizeModal crudForm={crudForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
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

                <th className='table_th_tag  ps-2 pe-2'><span>company Name</span>
                  <span className='ms-4'>
                    <ExpandCircleDownIcon className='table_th_icon' />

                  </span>

                  {/* <div class="dropdown-menu table_th_icon_menu" aria-labelledby="dropdownMenu2">
    <button class="dropdown-item" type="button">Action</button>
    <button class="dropdown-item" type="button">Another action</button>
    <button class="dropdown-item" type="button">Something else here</button>
  </div> */}
                </th>

                <th className='table_th_tag  ps-2 pe-2'><span>Group Holding</span>
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
                    <td className='  ps-2 pe-2'>{item.company_name}</td>
                    <td className='  ps-2 pe-2'>{item.group_holding}</td>
                    <td className='  ps-2 pe-2'>{item.role}</td>
                    <td className='  ps-2 pe-2'>{item.status}</td>
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

export default Company;
