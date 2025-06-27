
import React, { useEffect, useRef, useState } from 'react';
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
import { createCompany, deleteCompanyById, fetchAllCompanies, fetchAllGroupHolding, updateCompanyById, updateCompanyStatusById } from '../api/Service';
import DeleteModal from '../component/DeleteModal';
import Snackbars from '../component/Snackbars';

import VisibilityIcon from '@mui/icons-material/Visibility';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import Toggle from '../component/Toggle';
import MuiTextAreaField from '../component/MuiInputs/MuiTextAreaField';
// Register module
ModuleRegistry.registerModules([AllCommunityModule]);

const Company = () => {
  // if you want to show dummy jason data 
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState({ _id: null, company_name: '', company_description: '', group_name: '', group_holding_id: null, created_at: '', updated_at: '',company_common_name:'' });
  // console.log(current,'current')
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupHoldingName, setGroupHoldingName] = useState([])
  const [companyId, setCompanyId] = useState(null)
  const [userId, setUserId] = useState(null)
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
console.log(current,'current')

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };
  // Handle Add or Edit

  const handleSubmit = async (e) => {
    // e?.preventDefault();

    const payload = {
      "CompanyName": current?.company_name || '',
      "CompanyDescription": current?.company_description || '',
      "GroupHoldingsID": current?.group_holding_id || null,
      "CommonAttributes": {
        "Created_By": "507f1f77bcf86cd799439012",
      }
    };

    try {
      let response;
      if (isEditing) {
        // Update existing company
        response = await updateCompanyById(companyId, payload);
      } else {
        // Create new company
        response = await createCompany(payload);
      }

      // ✅ Get the message from response
      const message = response?.message;
      // Set snackbar with message
      // setSnackbarMessage(message); // You'll need this state
      setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'success' });

      // Refresh data
      const updatedData = await fetchAllCompanies();
      setData(updatedData);
    } catch (error) {
      console.error("Error saving company:", error);
      // setSnackbarMessage("Failed to save company");
      setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'error' });
    }

    // Reset form state
    setCurrent({
      _id: null,
      company_name: '',
      group_name: '',
      company_description: '',
      group_holding_id: null,
      created_at: '',
      updated_at: '',
    });

    setIsEditing(false);
    setIsModalOpen(false);
  };



  // Handle Edit
  const handleEdit = (company_id) => {
    const item = data.find((item) => item.company_id === company_id);
    setCompanyId(company_id)
    setCurrent(item);
    setIsEditing(true);
    setIsModalOpen(true);

  };


  // Handle Delete
  const handleDelete = async (companyId) => {
    try {
      const response = await deleteCompanyById(companyId);
      const message = response?.message || "Company deleted successfully";

      // Refresh data
      const updatedData = await fetchAllCompanies();
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


  // Pagination Logic: Slicing the data to display on the current page
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentData = data?.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination Button Handler
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Total number of pages
  // const totalPages = Math.ceil(data.length / itemsPerPage);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesData, groupHolding] = await Promise.all([
          fetchAllCompanies(),
          fetchAllGroupHolding(),
        ]);
        setData(companiesData);
        setGroupHoldingName(groupHolding);
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
        <SingleSelectTextField
            name="group_name"
            label="Group Holding"
            value={current.group_name}
            onChange={(e) => {
              const selectedName = e.target.value;
              const matchedGroup = groupHoldingName.find(
                (g) => g.name === selectedName
              );
              console.log(matchedGroup,'matchedGroup')
              setCurrent((prev) => ({
                ...prev,
                group_name: selectedName,
                group_holding_id: matchedGroup?._id || null,
              }));
            }}
            names={groupHoldingName}
          />
        <div className='d-lg-flex d-md-flex justify-content-between  gap-3'>
          
          <MuiTextField label='Company Name' type='text' isRequired={true} fieldName='company_name' handleChange={handleChange} value={current.company_name} />
          <MuiTextField label='Company Comman Name' type='text' isRequired={true} fieldName='company_common_name' handleChange={handleChange} value={current.company_common_name} />


        </div>
        <div>
          <MuiTextAreaField value={current.company_description} handleChange={handleChange} name='company_description' label='Company Description' />
        </div>
        <div className="row row-gap-2">
          <div className='col col-12 col-md-6'>
            <button type="button" className="btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
          </div>
          <div className='col col-12 col-md-6 d-flex justify-content-end'>
            <button type="submit" className="btn btn-primary" onClick={() => handleSubmit(companyId)}>{isEditing ? <span className='button-style'>Save Changes</span> : <span className='button-style'>Create company</span>}</button>
          </div>
        </div>
        {/* </form> */}
      </div>

    )

  }
  const crudTitle = "Add New company"
  const editCrudTitle = "Edit company"
  const deleteModal = () => {
    return (
      <div>
        <div className='delete_message p-4'>
          Are you sure you want to delete <DeleteIcon className='action_icon' /> this company?
        </div>

        <div className="row row-gap-2 mt-4">
          <div className='col col-12 col-md-6'>
            <button type="button" className="btn-sm btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
          </div>
          <div className='col col-12 col-md-6 d-flex justify-content-end'>
            <button type="submit"
              className="btn-sm btn btn-primary"
              onClick={() => handleDelete(companyId)}>Yes, I'm sure</button>
          </div>
        </div>
      </div>


    )

  }


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

  const handleToggleChange = async (e, params) => {
    const newIsActive = {
      "IsActive": e.target.checked
    };
    try {
      const response = await updateCompanyStatusById(params.data._id, newIsActive);
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
    const updatedData = await fetchAllCompanies();
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
                setCompanyId(params.data._id)

              }}
            >
              <EditIcon fontSize="small" className="action_icon" />
            </button>
            <button
              className="btn btn-sm"
              onClick={() => {
                setUserId(params.data._id);
                setCompanyId(params.data._id)
                setIsDeleteModalOpen(true);
              }}
            >
              <DeleteIcon fontSize="small" className="action_icon" />
            </button>
            {/* <button
              className="btn btn-sm"
              onClick={() => {
                setUserId(params.data._id);
                setIsDeleteModalOpen(true);
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
    { field: 'group_name', headerName: 'Group Holding', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
    { field: 'company_name', headerName: 'Company Name', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
    { field: 'company_description', headerName: 'Company Desc', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
    { field: 'common_attributes.created_at', headerName: 'Created At', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
    { field: 'common_attributes.updated_at', headerName: 'Updated At', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
    { field: 'common_attributes.updated_by', headerName: 'Updated By', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
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
    }, { field: 'common_attributes.approval_time', headerName: 'Status Approval Time', editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
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
  return (
    <div>
      <div className='mb-4'>
        <h5>Company</h5>
      </div>
      <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />

      {/* Table to display data */}
      <div className='table_div p-3'>
        <div className='d-lg-flex d-md-flex  justify-content-between'>
          <div className='d-flex h-100'>
            <div className="search-bar-container h-25">
              <MuiSearchBar label='Search...' type='text' />
              <button className='search-icon'><SearchIcon /></button>
            </div>
            {/* <MultipleSelectFields
              placeholder="Filter By Group Holding"
              roleName={groupHoldingName}
              onChange={(selectedIds) => {
              }}
            /> */}

          </div>


          <div className='d-lg-flex d-md-flex  justify-content-end mb-3'>
            <div className='pe-2'>
              <button className='crud_btn' onClick={openModal}>
                <span><AddIcon /></span> <span className='button-style'>Add New Company</span>
              </button>
            </div>
            <button className="button approve">
                  <span className="icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12 3.41 13.41 9 19 21 7 19.59 5.59z" />
                    </svg>
                  </span>
                  <span className="text">Approve All</span>
                </button>
            <DeleteModal deleteForm={deleteModal} deleteTitle='Delete Company' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />

            <SmallSizeModal crudForm={crudForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
          </div>
        </div>

        {/* <div className='table_div2'>
          <table className='table_tag'>
            <thead className='table_head_tag'>
              <tr >
                <th className='table_th_tag action_column ps-2 pe-2'>Actions</th>

                <th className='table_th_tag  ps-2 pe-2'><span>company Name</span>
                  <span className='ms-4'>
                    <ExpandCircleDownIcon className='table_th_icon' />

                  </span>
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
                  <tr key={item.company_id} className='table_tr'>
                    <td className='d-flex table_td  ps-2 pe-2 justify-content-between sticky_col'>
                      <div>
                        <button className='btn  mt-1 btn-sm' onClick={() => { handleEdit(item.company_id) }}><EditIcon className='action_icon' /></button>
                      </div>
                      <div>
                        <button className='btn  mt-1 btn-sm'
                          onClick={() => {
                            setCompanyId(item.company_id);
                            setIsDeleteModalOpen(true);
                          }}>
                          <DeleteIcon className='action_icon' /></button>
                      </div>
                    </td>
                    <td className='table_td_font  ps-2 pe-2'>{item.company_name ? item.company_name : '-'}</td>
                    <td className=' table_td_font ps-2 pe-2'>{item.group_name ? item.group_name : '-'}</td>
                    <td className=' table_td_font ps-2 pe-2'>{item.created_at ? item.created_at : '-'}</td>
                    <td className=' table_td_font ps-2 pe-2'>{item.updated_at ? item.updated_at : '-'}</td>
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

export default Company;
