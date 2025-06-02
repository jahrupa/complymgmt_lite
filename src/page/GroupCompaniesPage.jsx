// import React from 'react'

// export const GroupCompaniesPage = () => {
//   return (
//     <div>GroupCompaniesPage</div>
//   )
// }

import React, { useEffect, useState } from 'react';
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
import SmallSizeModal from '../component/SmallSizeModal';
import { createGroup, deleteGroupById, fetchAllGroup, updateGroupById } from '../api/Service';
import Snackbars from '../component/Snackbars';
import DeleteModal from '../component/DeleteModal';


const dummuJsonData = [
  {
    id: 1744096161424,
    group_holding_name: "Tata",
    group_holding_account_owner: "Rupa",
    created_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    temporary_password: "password12",
    access_modules: ["Admin", "Editor"]
  },
  {
    id: 1744096161425,
    group_holding_name: "Tata",
    group_holding_account_owner: "Rupa",
    created_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    temporary_password: "password12",
    access_modules: ["Admin", "Editor"]
  },
  {
    id: 1744096161426,
    group_holding_name: "Tata",
    group_holding_account_owner: "Rupa",
    created_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    temporary_password: "password12",
    access_modules: ["Admin", "Editor"]
  },
  {
    id: 1744096161427,
    group_holding_name: "Tata",
    group_holding_account_owner: "Rupa",
    created_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    temporary_password: "password12",
    access_modules: ["Admin", "Editor"]
  },
  {
    id: 1744096161428,
    group_holding_name: "Tata",
    group_holding_account_owner: "Rupa",
    created_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    temporary_password: "password12",
    access_modules: ["Admin", "Editor"]
  },
  {
    id: 1744096161429,
    group_holding_name: "Tata",
    group_holding_account_owner: "Rupa",
    created_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    temporary_password: "password12",
    access_modules: ["Admin", "Editor"]
  },
];

const GroupCompaniesPage = () => {
  // const [data, setData] = useState([]);
  // if you want to show dummy jason data 
  const [data, setData] = useState(dummuJsonData);
  const [current, setCurrent] = useState({ id: null, group_holding_name: '', groups_holdings_id: null, group_holding_account_owner: 'Rupa', created_at: '', temporary_password: "", created_at: '', desc: '', access_modules: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
    severityType: '',
  });
  const [groupId, setgroupId] = useState(null)
  console.log(current, 'current')
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
  // Handle created_at access change
  const handleRoleAccessChange = (newValue) => {
    setCurrent((prev) => ({ ...prev, access_modules: newValue }));
  };
  // Handle Add or Edit

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (isEditing) {
  //     const updatedData = data.map((item) =>
  //       item.id === current.id ? { ...item, group_holding_name: current.group_holding_name, group_holding_account_owner: current.group_holding_account_owner, created_at: current.created_at, temporary_password: current.temporary_password, created_at: current.created_at, desc: current.desc, access_modules: current.access_modules } : item
  //     );
  //     setData(updatedData);
  //   } else {
  //     const newData = { id: Date.now(), group_holding_name: current.group_holding_name, group_holding_account_owner: current.group_holding_account_owner, created_at: current.created_at, temporary_password: current.temporary_password, created_at: current.created_at, desc: current.desc, access_modules: current.access_modules };
  //     setData((prev) => [...prev, newData]);
  //   }
  //   setCurrent({ id: null, group_holding_name: '', group_holding_account_owner: '', created_at: '', temporary_password: '', created_at: '', desc: '', access_modules: [] });
  //   setIsEditing(false);
  //   setIsModalOpen(false);

  // };


  const handleSubmit = async (e) => {
    // e?.preventDefault();

    const payload = {
      "group_holding_name": current?.group_holding_name,
      "group_holding_description": "Cloudnine Healthcare Group Holdings",
      "group_holding_type": "Healthcare",
      "group_holding_account_owner": "Cloudnine Admin",
      "group_holding_spoc": "Dr. R Kishore Kumar",
      "group_holding_email": "group.spoc@cloudninecare.com",
      "group_holding_phone": "+918012345678",
      "isActive": true,
      "group_holding_code": "CLOUD9",
      "approved_by": 2,
      "created_by": 1
    };

    try {
      let response;
      if (isEditing) {
        // Update existing company
        response = await updateGroupById(current?.groups_holdings_id, payload);
      } else {
        // Create new company
        response = await createGroup(payload);
      }

      // ✅ Get the message from response
      const message = response?.message;
      // Set snackbar with message
      // setSnackbarMessage(message); // You'll need this state
      setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'success' });

      // Refresh data
      const updatedData = await fetchAllGroup();
      setData(updatedData);
    } catch (error) {
      console.error("Error saving company:", error);
      // setSnackbarMessage("Failed to save company");
      setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'error' });
    }

    // Reset form state
    setCurrent({ id: null, group_holding_name: '', group_holding_account_owner: '', created_at: '', temporary_password: '', created_at: '', desc: '', access_modules: [] });

    setIsEditing(false);
    setIsModalOpen(false);
  };



  // Handle Edit
  const handleEdit = (id) => {
    const item = data.find((item) => item.groups_holdings_id === id);
    setCurrent(item);
    setIsEditing(true);
    setIsModalOpen(true);

  };

  // Handle Delete
  const handleDelete = async (groupId) => {
    try {
      const response = await deleteGroupById(groupId);
      const message = response?.message || "Company deleted successfully";

      // Refresh data
      const updatedData = await fetchAllGroup();
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
  // const handleDelete = (id) => {
  // const filteredData = data.filter((item) => item.id !== id);
  // setData(filteredData);
  //   setSelectedRows(selectedRows.filter((rowId) => rowId !== id)); // Remove deleted row from selected
  // };

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
  const roleName = [
    "Tata",
    "Groupon",
    "Influitive",
    "Spinfluence",
    "Intellivision",
    "Omnilert",
    "Technologent",
    "Securiteam"
  ];

  const userStatus = ['Active', 'Inactive'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [GroupData] = await Promise.all([
          fetchAllGroup(),
          // fetchAllGroupHolding(),
          // fetchAllCompaniesName(),
        ]);
        setData(GroupData);

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
          <MuiTextField label='Group Holding Name' type='text' isRequired={true} fieldName='group_holding_name' handleChange={handleChange} value={current?.group_holding_name} />
          {/* <MuiTextField label='Create By' type='text' isRequired={true} fieldName='group_holding_account_owner' handleChange={handleChange} value={current.group_holding_account_owner} isdisabled={true}/> */}

        </div>

        <div className="row row-gap-2">
          <div className='col col-12 col-md-6'>
            <button type="button" className="btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
          </div>
          <div className='col col-12 col-md-6 d-flex justify-content-end'>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{isEditing ? <span className='button-style'>Save Changes</span> : <span className='button-style'>Create Group Holding</span>}</button>
          </div>
        </div>
        {/* </form> */}
      </div>

    )

  }
  const crudTitle = "Add New Group Holding"
  const editCrudTitle = "Edit Group Holding"
  const deleteModal = () => {
    return (
      <div>
        <div className='delete_message p-4'>
          Are you sure you want to delete <DeleteIcon className='action_icon' /> this Company Holding?
        </div>

        <div className="row row-gap-2 mt-4">
          <div className='col col-12 col-md-6'>
            <button type="button" className="btn-sm btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
          </div>
          <div className='col col-12 col-md-6 d-flex justify-content-end'>
            <button type="submit"
              className="btn-sm btn btn-primary"
              onClick={() => handleDelete(groupId)}>Yes, I'm sure</button>
          </div>
        </div>
      </div>


    )

  }
  return (
    <div>
      <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
      {/* Button to Delete All Selected Rows */}


      {/* Table to display data */}
      <div className='table_div p-3'>
        <div className='d-lg-flex d-md-flex  justify-content-between'>
          <div className='d-flex h-100'>
            <div className="search-bar-container h-25">
              {/* <input type="text" placeholder="Search..." name="search" className='search-bar-input p-1 w-100' /> */}
              <MuiSearchBar label='Search...' type='text' />
              <button className='search-icon'><SearchIcon /></button>
            </div>
            <MultipleSelectFields placeholder='Filter By Group Holding' roleName={roleName} />
          </div>


          <div className='d-lg-flex d-md-flex  justify-content-end mb-3'>
            <div className='pe-2'>
              <button className='crud_btn' onClick={openModal}>
                <span><AddIcon /></span> <span className='button-style'>Add New Group Holding</span>
              </button>
            </div>
            {/* <div>
              <button className='crud_btn' onClick={handleDeleteAll} disabled={selectedRows.length === 0}>
                <span className='button-style'> Delete All</span>
              </button>
            </div> */}
            <DeleteModal deleteForm={deleteModal} deleteTitle='Delete Company Holding' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />

            <SmallSizeModal crudForm={crudForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
          </div>
        </div>

        <div className='table_div2'>
          <table className='table_tag'>
            <thead className='table_head_tag'>
              <tr >
                {/* <th className='table_th_tag ps-2 pe-2 check_box_column'>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                  />
                </th> */}
                <th className='table_th_tag action_column ps-2 pe-2'>Actions</th>

                <th className='table_th_tag  ps-2 pe-2'><span>Group Holding Name</span>
                  <span className='ms-4'>
                    <ExpandCircleDownIcon className='table_th_icon' />

                  </span>

                  {/* <div className="dropdown-menu table_th_icon_menu" aria-labelledby="dropdownMenu2">
    <button className="dropdown-item" type="button">Action</button>
    <button className="dropdown-item" type="button">Another action</button>
    <button className="dropdown-item" type="button">Something else here</button>
  </div> */}
                </th>

                <th className='table_th_tag  ps-2 pe-2'><span>Group Holding Account Owner</span>
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
                    {/* <td className='  ps-2 pe-2 table_td sticky_col'>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={(e) => handleCheckboxChange(e, item.id)}
                      />
                    </td> */}
                    <td className='d-flex table_td  ps-2 pe-2 justify-content-between sticky_col'>
                      <div>
                        <button className='btn  mt-1 btn-sm' onClick={() => handleEdit(item.groups_holdings_id)}><EditIcon className='action_icon' /></button>
                      </div>
                      <div>
                        <button className='btn  mt-1 btn-sm' onClick={() => {
                            setgroupId(item.groups_holdings_id);
                            setIsDeleteModalOpen(true);
                          }}><DeleteIcon className='action_icon' /></button>
                      </div>
                    </td>
                    <td className=' table_td_font ps-2 pe-2'>{item.group_holding_name ? item.group_holding_name : '-'}</td>
                    <td className=' table_td_font ps-2 pe-2'>{item.group_holding_account_owner ? item.group_holding_account_owner : '-'}</td>
                    <td className=' table_td_font ps-2 pe-2'>{item.created_at ? item.created_at : '-'}</td>
                    <td className=' table_td_font ps-2 pe-2'>{item.updated_at ? item.updated_at : '-'}</td>
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

export default GroupCompaniesPage;
