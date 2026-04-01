
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import '../style/useRole.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiTextField from '../component/MuiInputs/MuiTextField';
import AddIcon from '@mui/icons-material/Add';
import SmallSizeModal from '../component/SmallSizeModal';
import { bulkApproveAllPageData, createGroup, deleteGroupById, fetchAllGroup, updateGroupById, updateGroupStatusById, updateGroupApprovalStatusById } from '../api/service';
import Snackbars from '../component/Snackbars';
import DeleteModal from '../component/DeleteModal';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import Toggle from '../component/Toggle';
import { AnimatedSearchBar } from '../component/AnimatedSearchBar';
import { decryptData } from './utils/encrypt';
import MultiSelectFilter from './dashboardDrawerGridDetailPage/MultiSelectFilter';
import { flattenObject } from '../../Utils/tableColUtils';
// Register module
ModuleRegistry.registerModules([AllCommunityModule]);

const GroupCompaniesPage = () => {
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const [current, setCurrent] = useState(
    {
      _id: null,
      group_name: '',
      groups_holdings_id: null,
      group_holding_account_owner: '',
      created_at: '',
      group_description: '',
    });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
    severityType: '',
  });

  const [filters, setFilters] = useState({});
  const handleFilterApply = (newFilters,) => {
    setFilters(newFilters);
  };
  const filteredRowData = useMemo(() => {
    if (Object.keys(filters).length === 0) return data;

    return data.filter((row) => {
      return Object.entries(filters).every(([column, values]) => {
        return values.includes(row[column]);
      });
    });
  }, [data, filters]);

  const [groupId, setgroupId] = useState(null)
  const SystemUserId = decryptData(localStorage.getItem("user_id"));
  const validate = () => {
    let tempErrors = {};
    if (!current?.group_name) tempErrors.group_name = "Group Holding Name is required";
    // if (!current?.group_description) tempErrors.group_description = "Description is required";
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
      const response = await bulkApproveAllPageData('group');
      const message = response?.message || "Status update successfully"
      // Show success snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message,
        severityType: 'success',
      });
    } catch (error) {
      // Show error snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: error?.response?.data?.message,
        severityType: 'error',
      });
    }
    const updatedData = await fetchAllGroup();
    setData(updatedData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default submit behavior

    if (!validate()) return; // Don't proceed if validation fails
    const CommonAttributes = {
      [isEditing ? "Updated_By" : "Created_By"]: SystemUserId || "",
    };
    const payload = {
      "GroupDescription": current?.group_description,
      "GroupName": current?.group_name,
      "CommonAttributes": CommonAttributes
    };

    try {
      let response;
      if (isEditing) {
        response = await updateGroupById(current?._id, payload);
      } else {
        response = await createGroup(payload);
      }
      const message = response?.message;
      setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message, severityType: 'success' });
      const updatedData = await fetchAllGroup();
      setData(updatedData);
    } catch (error) {
      setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: error?.response?.data?.message, severityType: 'error' });
    }
    // Reset form state
    setCurrent({
      _id: null,
      group_name: '',
      group_holding_account_owner: '',
      created_at: '',
      group_description: '',
    });
    setIsEditing(false);
    setIsModalOpen(false);
    setErrors({}); // ✅ Reset errors after submission
  };

  // Handle Delete
  const handleDelete = async (groupId) => {
    try {
      const response = await deleteGroupById(groupId);
      const message = response?.message || "Group holding  successfully";

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
      // Show error snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: error?.response?.data?.message,
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
    setCurrent({})
  };
  // Active/InActive status
  const handleToggleChange = async (e, params) => {
    const newIsActive = {
      "IsActive": e.target.checked
    };
    try {
      const response = await updateGroupStatusById(params.data._id, newIsActive);
      const message = response?.message || "Status update successfully"
      // Show success snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message,
        severityType: 'success',
      });
    } catch (error) {
      // Show error snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: error?.response?.data?.message,
        severityType: 'error',
      });
    }
    const updatedData = await fetchAllGroup();
    setData(updatedData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [GroupData] = await Promise.all([
          fetchAllGroup(),
        ]);
        setData(GroupData);
        console.log("Total Records:", GroupData.length);
        console.log("Group Names:", GroupData.map(r => r.group_name));
      } catch {
        // Handle error silently
      }
    };
    fetchData();
  }, []);


  const crudForm = () => {
    return (
      <div>
        <div className='fs-12 info mb-2'> Group name must be at least 3 non-whitespace characters and must not be a duplicate.</div>
        <MuiTextField
          label='Group Holding Name'
          type='text'
          isRequired={true}
          fieldName='group_name'
          handleChange={handleChange}
          value={current?.group_name}
          error={!!errors.group_name}
          helperText={errors.group_name}
        />
        <MuiTextField
          label='Description'
          type='text'
          isRequired={true}
          fieldName='group_description'
          handleChange={handleChange}
          value={current?.group_description}
        />

        <div className="row row-gap-2">
          <div className='col-6'>
            <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}><span className='button-style'>Cancel</span></button>
          </div>
          <div className='col-6 d-flex justify-content-end'>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              {isEditing ? <span className='button-style'>Save Changes</span> : <span className='button-style'>Create Group Holding</span>}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const crudTitle = "Add New Group Holding"
  const editCrudTitle = "Edit Group Holding"

  const deleteModal = () => {
    return (
      <div>
        <div className='delete_message p-4'>
          Are you sure you want to delete <DeleteIcon className='action_icon' /> this Company Holding?
        </div>

        <div className="row row-gap-2 mt-4">
          <div className='col-6'>
            <button type="button" className="btn-sm btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}><span className='button-style'>Cancel</span></button>
          </div>
          <div className='col-6 d-flex justify-content-end'>
            <button type="submit"
              className="btn-sm btn btn-primary"
              onClick={() => handleDelete(groupId)}>Yes, I'm sure</button>
          </div>
        </div>
      </div>
    )
  }

  const handleCheckboxClick = async (rowId) => {
    const response = await updateGroupApprovalStatusById(rowId);
    const message = response?.message

    setIsSnackbarsOpen({
      ...issnackbarsOpen,
      open: true,
      message,
      severityType: 'success',
    });

    const updatedData = await fetchAllGroup();
    setData(updatedData);
  };

  const generateDynamicColDefs = (data) => {
    if (!data || data.length === 0) return [];

    const sample = flattenObject(data[0]);

    return Object.keys(sample)
      .map((key) => {
        // Skip unwanted fields
        if (
          key === "_id" ||
          key === "common_attributes.is_active" ||
          key === "common_attributes.is_deleted" ||
          key === "common_attributes.deleted_by" ||
          key === "common_attributes.deleted_at"
        )
          return null;

        // ✅ Special case for approval_status
        if (key === "common_attributes.approval_status") {
          return {
            field: key,
            headerName: "Approval Status",
            filter: true,
            editable: false,
            valueGetter: (params) =>
              params.data?.common_attributes?.approval_status,
            cellRenderer: (params) => {
              const status = params.value ?? 0;

              const handleChange = async (e) => {
                const checked = e.target.checked;

                // UI Update Immediately (Optimistic Update)
                params.node.setDataValue(
                  "common_attributes.approval_status",
                  checked ? 1 : 0,
                );

                // Optional: API Call
                try {
                  await handleCheckboxClick(params.data._id, checked ? 1 : 0);
                } catch {
                  // Revert if API fails
                  params.node.setDataValue(
                    "common_attributes.approval_status",
                    status,
                  );
                }
              };

              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={status === 1}
                    disabled={status === 1} // Approved hone ke baad disable
                    onChange={handleChange}
                    style={{
                      width: 15,
                      height: 15,
                      accentColor: "orange",
                      cursor: status === 1 ? "not-allowed" : "pointer",
                    }}
                  />
                  <span
                    style={{
                      color: status === 1 ? "green" : "orange",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                    }}
                  >
                    {status === 1 ? "Approved" : "Pending"}
                  </span>
                </div>
              );
            },
          };
        }

        // ✅ Default column definition
        return {
          field: key,
          headerName: key
            .split(".")
            .pop()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),

          filter: true,
          editable: false,
          headerStyle: {
            color: "#515151",
            backgroundColor: "#ffffe24d",
          },

          valueGetter: (params) => {
            return key
              .split(".")
              .reduce((acc, part) => acc?.[part], params.data);
          },
        };
      })
      .filter(Boolean);
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
            <button className="btn btn-sm" onClick={() => {
              setCurrent(params.data);
              setIsEditing(true);
              setIsModalOpen(true);
            }}>
              <EditIcon fontSize="small" className="action_icon" />
            </button>
            <button className="btn btn-sm" onClick={() => {
              setgroupId(params.data._id);
              setIsDeleteModalOpen(true);
            }}>
              <DeleteIcon fontSize="small" className="action_icon" />
            </button>

          </div>
        );
      },
    },

    ...generateDynamicColDefs(data),

    {
      headerName: 'Is Active',
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

  const onRowValueChanged = () => {
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
            <h1>{data?.length > 1 ? "Group Holdings" : "Group Holding"}</h1>
          </div>
        </div>
        <div className='d-lg-flex d-md-flex gap-2 mt-2'>
          <button className='crud_btn w-100 mb-2' onClick={openModal}>
            <span><AddIcon /></span> <span className='button-style'>Add New Group Holding</span>
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
      <DeleteModal deleteForm={deleteModal} deleteTitle='Delete Company Holding' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />
      <SmallSizeModal crudForm={crudForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} closeModal={closeModal} />

      <div className='table_div p-3'>
        <div className='d-flex align-items-center gap-2'>
          <AnimatedSearchBar placeholder="Search..." type="text" id="filter-text-box" onInput={onFilterTextBoxChanged} />
          <MultiSelectFilter
            rowData={data}
            filterColumns={data.length > 0 ? Object.keys(data[0]) : []}
            onFilterApply={handleFilterApply}
          />
        </div>
        <div className="ag-theme-quartz" style={{ height: '600px', width: '100%', marginTop: '1rem' }}>
          <AgGridReact
            theme="legacy"
            ref={gridRef}
            rowData={filteredRowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            editType="fullRow"
            rowSelection="single"
            pagination={true}
            onRowValueChanged={onRowValueChanged}

          />
        </div>


      </div>
    </div >
  );
};

export default GroupCompaniesPage;
