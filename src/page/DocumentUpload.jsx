import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../style/useRole.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SingleSelectTextField from '../component/MuiInputs/SingleSelectTextField';
import Toggle from '../component/Toggle';
import { uploadFile, uploadFileGolang, fetchAllFiles, deleteFileById, updateFileById, bulkApproveAllPageData, fetchAllGroup, fetchCompaniesNameByGroupId, getLocationByCompanyId, fetchAllModulesNameByLocationId, fetchAllSubModuleNameByModuleId, fetchServiceTrackerBySubModuleId, fetchDocumentDropdownTypes, fetchDocumentDropdownStages, approveUserAccess } from '../api/service';
import DeleteModal from '../component/DeleteModal';
import Snackbars from '../component/Snackbars';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import AttachFileIcon from '@mui/icons-material/AttachFile';
// import AccountBoxIcon from '@mui/icons-material/CalendarMonth';
// import MenuPopup from './MenuPopup';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import MenuPopup from '../component/MenuPopup';
import MultiFileUpload from '../component/MultiFileUpload';
import RightDrawer from '../component/RightDrawer';
import { ReactPDFViewer } from '../component/ReactPDFViewer';
import SmallSizeModal from '../component/SmallSizeModal';
import { AnimatedSearchBar } from '../component/AnimatedSearchBar';
// Register module
ModuleRegistry.registerModules([AllCommunityModule]);

const DocumentUpload = () => {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState(
    {
      group_name: "",
      group_holdings_id: null,
      company_name: "",
      company_id: null,
      location_name: "",
      location_id: null,
      module_name: '',
      module_id: null,
      sub_module_name: '',
      sub_module_id: null,
      service_tracker_name: '',
      service_tracker_id: null,
      document_type_name: '',
      document_type_id: null,
      stage: '',
      stage_id: null
    });
  console.log(current, 'current')
  const [isEditing, setIsEditing] = useState(false);
  const [isPdfView, setIsPdfView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileUploadModalOpen, setIsFileUploadModalModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [documentId, setDocumentId] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
    severityType: '',
  });
  const [isAutoUpload, setIsAutoUpload] = useState(true);
  const [errors, setErrors] = useState({});
  const [groupHoldingName, setGroupHoldingName] = useState([])
  const [companyName, setCompanyName] = useState([])
  const [locationName, setLocationName] = useState([])
  const [moduleName, setModuleName] = useState([])
  const [subModuleName, setSubModuleName] = useState([]);
  const [serviceTrackerName, setServiceTrackerName] = useState([]);
  const [documentDropdownTypes, setDocumentDropdownTypes] = useState([]);
  const [documentDropdownStages, setDocumentDropdownStages] = useState([]);
  const validate = () => {
    let tempErrors = {};
    if (!current?.group_name) tempErrors.group_name = "Group Holding is required";
    if (!current?.company_name) tempErrors.company_name = "Company is required";
    if (!current?.location_name) tempErrors.location_name = "Location is required";
    if (!current?.module_name) tempErrors.module_name = "Module is required";
    if (!current?.sub_module_name) tempErrors.sub_module_name = "Sub Module is required";
    if (!current?.service_tracker_name) tempErrors.service_tracker_name = "Service Tracker is required";
    if (!current?.document_type_name) tempErrors.document_type_name = "Document Type is required";
    if (!current?.stage_name) tempErrors.stage_name = "Stage is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const crudTitle = "Upload Your File"
  const editCrudTitle = "Edit Your Uploaded File"
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return; // Don't proceed if validation fails
    const payload = current

    try {
      let response;
      // Update existing company
      response = await updateFileById(documentId, payload);
      // ✅ Get the message from response
      const message = response?.message;
      setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'success' });

      // Refresh data
      const updatedData = await fetchAllFiles();
      setData(updatedData);
    } catch (error) {
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: error?.response?.data?.message,
        severityType: 'error'
      });
    }
    setIsEditing(false);
    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDelete = async (documentId) => {
    try {
      const response = await deleteFileById(documentId);
      const message = response?.message;

      // Refresh data
      const updatedData = await fetchAllFiles();
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
    setIsFileUploadModalModalOpen(true);
  };

  const closeModal = () => {
    setIsFileUploadModalModalOpen(false);
    setIsDeleteModalOpen(false);

  };
  const toggleDrawer = (newOpen) => () => {
    setIsModalOpen(newOpen);
  };

  //  =============================   auto file upload logic   =================================================
  //  const handleFileUpload = async () => {
  //   if (!uploadedFiles?.length) {
  //     alert("Please select at least one file.");
  //     return;
  //   }

  //   try {
  //     const firstApiResponse = await uploadFile(uploadedFiles);
  //     const secondApiResponse = await uploadFileGolang({
  //       files: uploadedFiles,
  //       previousResponse: firstApiResponse,
  //     });

  //     setIsFileUploadModalModalOpen(false);
  //     const message = secondApiResponse?.message || "Status updated successfully";
  //     setIsSnackbarsOpen({
  //       ...issnackbarsOpen,
  //       open: true,
  //       message,
  //       severityType: 'success',
  //     });
  //     const updatedData = await fetchAllFiles();
  //     setData(updatedData);
  //   } catch (error) {
  //     setIsSnackbarsOpen({
  //       ...issnackbarsOpen,
  //       open: true,
  //       message: error?.response?.data?.message || "Upload failed. Please try again.",
  //       severityType: 'error',
  //     });
  //   }
  // };


  const handleFileUpload = async () => {
    if (!uploadedFiles?.length) {
      alert("Please select at least one file.");
      return;
    }

    try {
      // const result = await uploadFile(uploadedFiles);
      const result = await uploadFileGolang(uploadedFiles)
      //  console.log("Files uploaded successfully:", result);
      setIsFileUploadModalModalOpen(false);
      const message = result?.message || "Status update successfully"
      // Show success snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message,
        severityType: 'success',
      });
      // const { Data } = result;

      // if (Data && Data.length > 0) {
      //   const summary = Data.map((file, index) => {
      //     return `${index + 1}. 📄 ${file.filename}\n   🏷️ Doc Type: ${file.doc_type}\n   📊 Confidence: ${file.confidence}%`;
      //   }).join("\n\n");

      //   alert(`✅ Files uploaded successfully 🎉\n\n${summary}`);
      // } else {
      //   alert("Files uploaded, but no metadata returned.");
      // }
      const updatedData = await fetchAllFiles();
      setData(updatedData);
    } catch (error) {
      // console.error("Upload failed:", error);
      // alert("❌ Upload failed. Please try again.");
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: error?.response?.data?.message,
        severityType: 'error',
      });
    }

  };

  const handleToggleChange = async (e, params) => {
    const newIsActive = {
      "module_id": params.data.module_id,
      "submodule_id": params.data.submodule_id,
      "company_name": params.data.company_name,
      "company_location": params.data.company_location,
      "document_type_name": params.data.document_type_name,
      "stage": params.data.stage,
      "is_active": e.target.checked,
      "approval_status": params.data.approval_status
    };
    try {
      const response = await updateFileById(params.data.document_id, newIsActive);
      const message = response?.message || "Status update successfully"
      // Show success snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message,
        severityType: 'success',
      });
      const updatedData = await fetchAllFiles();
      setData(updatedData);
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
  const handleApproveAll = async () => {
    try {
      const response = await bulkApproveAllPageData('document_repository');
      const message = response?.message || "Status update successfully"
      // Show success snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message,
        severityType: 'success',
      });
      // Refresh data
      const updatedData = await fetchAllFiles();
      setData(updatedData);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          fetchAllFiles(),
          fetchAllGroup(),
          //  fetchAllModulesName(),
        ]);
        if (results[0].status === 'fulfilled') setData(results[0].value);
        if (results[1].status === 'fulfilled') setGroupHoldingName(results[1].value);
        // if (results[2].status === 'fulfilled') setModuleName(results[2].value);
        results.forEach((result, idx) => {
          if (result.status === 'rejected') {
            console.error(`Error fetching data at index ${idx}:`, result.reason);
          }
        });
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await fetchCompaniesNameByGroupId(current?.group_holdings_id);
        if (data) {
          setCompanyName(data);
        }
      } catch (error) {
        console.error("Failed to fetch company:", error);
      }
    };

    if (current?.group_holdings_id) {
      fetchCompany();
    }
  }, [current?.group_holdings_id]);

  useEffect(() => {
    const fetchLocationByCompanyId = async () => {
      try {
        const data = await getLocationByCompanyId(current?.company_id);
        if (data) {
          setLocationName(data);
        }
      } catch (error) {
        console.error("Failed to fetch location by company_id:", error);
      }
    };

    if (current?.company_id) {
      fetchLocationByCompanyId();
    }
  }, [current?.company_id]);

  useEffect(() => {
    const fetchModuleByLocationId = async () => {
      try {
        const data = await fetchAllModulesNameByLocationId(current?.location_id);
        if (data) {
          setModuleName(data);
        }
      } catch (error) {
        console.error("Failed to fetch module by location_id:", error);
      }
    };

    if (current?.location_id) {
      fetchModuleByLocationId();
    }
  }, [current?.location_id]);

  // sub-module by module id
  useEffect(() => {
    const fetchSubModuleByModuleId = async () => {
      try {
        const data = await fetchAllSubModuleNameByModuleId(current?.module_id);
        if (data) {
          setSubModuleName(data);
        }
      } catch (error) {
        console.error("Failed to fetch sub-module by module_id:", error);
      }
    };

    if (current?.module_id) {
      fetchSubModuleByModuleId();
    }
  }, [current?.module_id]);
  // Fetch service tracker by sub-module ID
  useEffect(() => {
    const getServiceTrackerBySubModuleId = async (id) => {
      try {
        const data = await fetchServiceTrackerBySubModuleId(id);
        if (data) {
          setServiceTrackerName(data);
        }
      } catch (error) {
        console.error("Failed to fetch service tracker by sub module ID:", error);
      }
    };

    if (current?.sub_module_id) {
      getServiceTrackerBySubModuleId(current?.sub_module_id);
    }
  }, [current?.sub_module_id]);

  useEffect(() => {
    const getDocumentDropdownTypes = async (service_tracker_name) => {
      try {
        const data = await fetchDocumentDropdownTypes(service_tracker_name);
        if (data) {
          setDocumentDropdownTypes(data);
        }
      } catch (error) {
        console.error("Failed to fetch document dropdown types:", error);
      }
    };

    if (current?.service_tracker_name) {
      getDocumentDropdownTypes(current?.service_tracker_name);
    }
  }, [current?.service_tracker_name]);


  useEffect(() => {
    const getDocumentDropdownStages = async (service_tracker_name) => {
      try {
        const data = await fetchDocumentDropdownStages(service_tracker_name);
        if (data) {
          setDocumentDropdownStages(data);
        }
      } catch (error) {
        console.error("Failed to fetch document dropdown stages:", error);
      }
    };

    if (current?.service_tracker_name) {
      getDocumentDropdownStages(current?.service_tracker_name);
    }
  }, [current?.service_tracker_name]);

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
      case 0:
        return { color: '#FFC107' }; // amber
      case 1:
        return { color: '#4CAF50' }; // green
      default:
        return { color: '#41464b' }; // gray
    }
  };
  const handleCheckboxClick = async (id) => {
    try {
      const response = await approveUserAccess(id);
      const message = response?.message
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
    const updatedData = await fetchAllFiles();
    setData(updatedData);
  };
  const colDefs = [
    {
      headerName: 'Actions',
      field: 'actions',
      filter: false,
      editable: false,
      width: 130,
      flex: 1,
      pinned: "right",
      editable: 'false',
      cellStyle: { 'background-color': 'rgb(252 229 205 / 64%)' },
      cellRenderer: (params) => {
        return (
          <div className="d-flex justify-content-around align-items-center">
            <button
              className="btn btn-sm"
              onClick={() => {
                // setIsEditing(false);
                setIsPdfView(true);
                setIsModalOpen(true);
                setDocumentId(params.data.document_id); // OR .user_id based on your data
              }}
            >
              <AttachFileIcon fontSize="small" className="action_icon" />
            </button>
            <button
              className="btn btn-sm"
              onClick={() => {
                setDocumentId(params.data.document_id);
                setIsDeleteModalOpen(true);
              }}
            >
              <DeleteIcon fontSize="small" className="action_icon" />
            </button>
            <button
              className="btn btn-sm"
              onClick={() => {
                setCurrent(params.data);
                setIsEditing(true);
                setIsModalOpen(true);
                setIsPdfView(false);

                setDocumentId(params.data.document_id); // OR .user_id based on your data
              }}
            >
              <EditIcon fontSize="small" className="action_icon" />
            </button>
            {/* <VisibilityIcon/> */}
          </div>
        );
      }
    }
    ,
    { field: "file_name", headerName: "File Name", editable: 'false', },
    { field: "document_type_name", headerName: "Document Type", editable: 'false', },
    {
      field: "file_path",
      headerName: "File Path",
      editable: 'false',
      cellRenderer: (params) => {
        const path = params.value;
        return path ? (
          <a href={`/${path}`} target="_blank" rel="noopener noreferrer" style={{ background: 'cadetblue', color: 'white', padding: '4px', borderRadius: '5px', textDecoration: 'none', fontSize: '12px' }}>
            Download
          </a>
        ) : (
          "No File"
        );
      }
    },
    {
      editable: 'false',
      field: "is_active", headerName: "Status", valueGetter: (params) => params.data?.is_active,
      cellRenderer: (params) => (
        <Toggle
          checked={!!params.value}
          onChange={(e) => handleToggleChange(e, params)}
        />
      )
    },
    {
      field: "approval_status",
      headerName: "Approval Status",
      editable: false,
      width: 150,
      valueGetter: (params) => params.data?.approval_status, // safer access
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
              checked={status}
              // readOnly={status === 1}
              style={{ cursor: 'default', width: 15, height: 15, accentColor: 'orange' }}
            // onChange={status !== 1 ? () => handleCheckboxClick(params.data._id) : null}
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
    { field: "approved_at", headerName: "Approved At", editable: 'false', },
    { field: "approved_by", headerName: "Approved By", editable: 'false', },
    { field: "company_location", headerName: "Company Location", editable: 'false', },
    { field: "company_name", headerName: "Company Name", editable: 'false', },
    { field: "created_at", headerName: "Created At", editable: 'false', },
    { field: "created_by", headerName: "Created By", editable: 'false', },
    { field: "deleted_at", headerName: "Deleted At", editable: 'false', },
    { field: "deleted_by", headerName: "Deleted By", editable: 'false', },
    { field: "stage", headerName: "Stage", editable: 'false', },
    { field: "updated_at", headerName: "Updated At", editable: 'false', },
    { field: "updated_by", headerName: "Updated By", editable: 'false', }

  ];
  const gridRef = useRef();
  const defaultColDef = {
    sortable: true,
    filter: true,
    editable: true,
    headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
  };
  const onRowValueChanged = (event) => {
    //  console.log('Row updated:', event.data);
  };
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      'quickFilterText',
      document.getElementById('filter-text-box').value
    );
  }, []);
  const fileUploadForm = () => {
    return (
      <div>
        <div className='d-flex align-items-center'>
          <span>
            <Toggle
              checked={isAutoUpload}
              onChange={() => setIsAutoUpload(!isAutoUpload)}
            />
          </span>
          <span className='fs-12 ms-2 mt-1'>Auto Upload</span>
        </div>

        <div className="mb-3 ps-3 pe-3 pb-3 mt-4">
          <div className="button-wrap">
            <MultiFileUpload setUploadedFiles={setUploadedFiles} uploadedFiles={uploadedFiles} />
          </div>
        </div>

        <div className="row row-gap-2">
          <div className="col-12 col-md-6">
            <button type="button" className="btn btn-secondary w-100" onClick={closeModal}>Cancel</button>
          </div>
          <div className="col-12 col-md-6">
            <button type="submit" className="btn btn-primary w-100" onClick={handleFileUpload}>Upload</button>
          </div>
        </div>
      </div>

    )

  }

  const deleteModal = () => {
    return (
      <div>
        <div className='delete_message p-4'>
          Are you sure you want to delete <DeleteIcon className='action_icon' /> this user role?
        </div>

        <div className="row row-gap-2 mt-4">
          <div className='col-6'>
            <button type="button" className="btn-sm btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
          </div>
          <div className='col-6 d-flex justify-content-end'>
            <button type="submit"
              className="btn-sm btn btn-primary"
              onClick={() => handleDelete(documentId)}>Yes, I'm sure</button>
          </div>
        </div>
      </div>


    )

  }

  const drawerHeader = () => {
    return (
      <div className='p-3 fs-14 fw-600'><AttachFileIcon style={{ color: 'green' }} />Tag Document</div>
    )
  }
  const drawerFilePreviewHeader = () => {
    return (
      <div className='p-3 fs-14 fw-600'><FilePresentIcon style={{ color: 'deepskyblue' }} />Document Preview</div>
    )
  }
  const drawerBody = () => {
    return (
      <div className='p-3'>
        <div className='d-lg-flex d-md-flex gap-3 mb-3'>
          <SingleSelectTextField
            name="group_name"
            label="Group Holding"
            value={current.group_name}
            onChange={(e) => {
              const selectedName = e.target.value;
              const matchedGroup = groupHoldingName.find(
                (g) => g.group_name === selectedName
              );
              setCurrent((prev) => ({
                ...prev,
                group_name: selectedName,
                group_holdings_id: matchedGroup?._id || null,
                company_name: '',
                location_name: '',
              }));
              setErrors(prevErrors => ({ ...prevErrors, group_name: '' }));

            }}
            names={groupHoldingName.map((item) => ({
              _id: item._id,
              name: item.group_name,
            }))}
            error={!!errors.group_name}
            helperText={errors.group_name}
          />
          <SingleSelectTextField name="company_name" label="Company Name" value={current?.company_name}
            onChange={(e) => {
              const selectedName = e.target.value;
              const matchedCompany = companyName.find(
                (g) => g.company_name === selectedName
              );
              setCurrent((prev) => ({
                ...prev,
                company_name: selectedName,
                company_id: matchedCompany?._id || null,
              }));
              setErrors(prevErrors => ({ ...prevErrors, company_name: '' }));

            }}
            names={companyName.map((item) => ({
              _id: item._id,
              name: item.company_name,
              optionalValue: item?.company_common_name
            }))}
            error={!!errors.company_name}
            helperText={errors.company_name}
          />
        </div>
        <div className='d-lg-flex d-md-flex gap-3 mb-3'>
          <SingleSelectTextField name="location_name" label="Location" value={current?.location_name}
            onChange={(e) => {
              const selectedName = e.target.value;
              const matchedLocation = locationName.find(
                (g) => g.location_name === selectedName
              );
              setCurrent((prev) => ({
                ...prev,
                location_name: selectedName,
                location_id: matchedLocation?._id || null,
              }));
              setErrors(prevErrors => ({ ...prevErrors, location_name: '' }));

            }}
            names={locationName.map((item) => ({
              _id: item._id,
              name: item.location_name,
            }))}
            // isdisable={isEditing ? true : false}
            error={!!errors.location_name}
            helperText={errors.location_name}

          />
          <SingleSelectTextField name="module_name" label="Module" value={current?.module_name}
            onChange={(e) => {
              const selectedName = e.target.value;
              const matchedLocation = moduleName.find(
                (g) => g.name === selectedName
              );
              setCurrent((prev) => ({
                ...prev,
                module_name: selectedName,
                module_id: matchedLocation?._id || null,
              }));
              setErrors(prevErrors => ({ ...prevErrors, module_name: '' }));

            }}
            names={moduleName}
            // isdisable={isEditing ? true : false}
            error={!!errors.module_name}
            helperText={errors.module_name}

          />
        </div>
        <div className='d-lg-flex d-md-flex gap-3 mb-3'>
          <SingleSelectTextField name="sub_module_name" label="Sub-Module" value={current?.sub_module_name}
            onChange={(e) => {
              const selectedName = e.target.value;
              const matchedLocation = subModuleName.find(
                (g) => g.sub_module_name === selectedName
              );
              setCurrent((prev) => ({
                ...prev,
                sub_module_name: selectedName,
                sub_module_id: matchedLocation?._id || null,
              }));
              setErrors(prevErrors => ({ ...prevErrors, sub_module_name: '' }));

            }}
            names={subModuleName?.map((item) => ({
              _id: item._id,
              name: item.sub_module_name,
            }))}
            // isdisable={isEditing ? true : false}
            error={!!errors.sub_module_name}
            helperText={errors.sub_module_name}

          />

          {/* <SingleSelectTextField name="company_common_name" label="Sub-Module" value={current.company_common_name} onChange={(e) => setCurrent((prev) => ({ ...prev, company_common_name: e.target.value }))} names={userStatus} /> */}
          <SingleSelectTextField name="service_tracker_name" label="Service Tracker" value={current?.service_tracker_name}
            onChange={(e) => {
              const selectedName = e.target.value;
              const matchedLocation = serviceTrackerName.find(
                (g) => g.name === selectedName
              );
              setCurrent((prev) => ({
                ...prev,
                service_tracker_name: selectedName,
                service_tracker_id: matchedLocation?._id || null,
              }));
              setErrors(prevErrors => ({ ...prevErrors, service_tracker_name: '' }));

            }}
            names={serviceTrackerName?.map((item) => ({
              _id: item._id,
              name: item.service_tracker_name,
            }))}
            // isdisable={isEditing ? true : false}
            error={!!errors.service_tracker_name}
            helperText={errors.service_tracker_name}
          />
        </div>
        <div className='d-lg-flex d-md-flex gap-3 mb-3'>
          <SingleSelectTextField name="document_type_name" label="Document Type" value={current?.document_type_name}
            onChange={(e) => {
              const selectedName = e.target.value;
              const matchedLocation = documentDropdownTypes.find(
                (g) => g.value === selectedName
              );
              setCurrent((prev) => ({
                ...prev,
                document_type_name: selectedName,
                document_type_id: matchedLocation?._id || null,
              }));
              setErrors(prevErrors => ({ ...prevErrors, document_type_name: '' }));

            }}
            names={documentDropdownTypes?.map((item) => ({
              _id: item._id,
              name: item.value,
            }))}
            // isdisable={isEditing ? true : false}
            error={!!errors.document_type_name}
            helperText={errors.document_type_name}
          />
          <SingleSelectTextField name="stage" label="Stage" value={current?.stage_name}
            onChange={(e) => {
              const selectedName = e.target.value;
              const matchedLocation = documentDropdownStages.find(
                (g) => g.value === selectedName
              );
              setCurrent((prev) => ({
                ...prev,
                stage_name: selectedName,
                stage_id: matchedLocation?._id || null,
              }));
              setErrors(prevErrors => ({ ...prevErrors, stage_name: '' }));

            }}
            names={documentDropdownStages?.map((item) => ({
              _id: item._id,
              name: item.value,
            }))}
            // isdisable={isEditing ? true : false}
            error={!!errors.stage}
            helperText={errors.stage}
          />
        </div>
        <div className='d-lg-flex d-md-flex d-flex justify-content-between'>
          <div>
            <button type='submit' className='btn btn-secondary' onClick={toggleDrawer(false)}>Cancel</button>
          </div>
          <div>
            <button type='submit' className='btn btn btn-primary' onClick={handleSubmit}>{isEditing ? 'Save Changes' : 'Save'}</button>
          </div>
        </div>

      </div>
    )
  }
  const drawerFilePreviewBody = () => {
    return (
      <div className='p-3'>
        <div className='row mb-4'>
          <div className='col col-4'>
            <div className='pdf-tab'>
              <div className='fs-12'>
                Document2
              </div>
              <div className='fs-12'>
                <span style={{ color: 'gray' }}>Uploaded By :</span> Rupa
              </div>
            </div>
          </div>
          <div className='col col-4'>
            <div className='pdf-tab'>
              <div className='fs-12'>
                Document2
              </div>
              <div className='fs-12'>
                <span style={{ color: 'gray' }}>Uploaded By :</span> Rupa
              </div>
            </div>

          </div>
          <div className='col col-4'>
            <div className='pdf-tab'>
              <div className='fs-12'>
                Document2
              </div>
              <div className='fs-12'>
                <span style={{ color: 'gray' }}>Uploaded By :</span> Rupa
              </div>
            </div>
          </div>
        </div>
        {/* history */}
        <div className='mb-2 card_div p-3 w-auto card-border-blue'>
          <div className="row align-items-center">
            <div className="col-3 col-md-2">
              <div className="p-2 rounded" style={{ background: '#FEEED2', color: '#F68E3F', textAlign: 'center' }}>
                v1
              </div>
            </div>

            <div className="col-9 col-md-10">
              <div className="mb-1">
                <span className="fs-14" style={{ color: 'gray' }}>Tagged by - </span>
                <span className="fs-14 fw-semibold">Mayank</span>
              </div>

              <div className="d-flex align-items-center gap-1 fs-14 text-muted">
                <CalendarMonthIcon fontSize="small" />
                <span>12/06/2025</span>
              </div>
            </div>
          </div>

        </div>

        <div className='mb-2 card_div p-3 w-auto card-border-blue'>
          <div className="row align-items-center">
            <div className="col-3 col-md-2">
              <div className="p-2 rounded" style={{ background: '#FEEED2', color: '#F68E3F', textAlign: 'center' }}>
                v2
              </div>
            </div>

            <div className="col-9 col-md-10">
              <div className="mb-1">
                <span className="fs-14" style={{ color: 'gray' }}>Re-Uploaded by - </span>
                <span className="fs-14 fw-semibold">Harsh Rana</span>
              </div>

              <div className="d-flex align-items-center gap-1 fs-14 text-muted">
                <CalendarMonthIcon fontSize="small" />
                <span>12/06/2025</span>
              </div>
            </div>
          </div>
        </div>

        <div className='mb-2 card_div p-3 w-auto card-border-blue'>
          <div className="row align-items-center">
            <div className="col-3 col-md-2">
              <div className="p-2 rounded" style={{ background: '#FEEED2', color: '#F68E3F', textAlign: 'center' }}>
                v3
              </div>
            </div>

            <div className="col-9 col-md-10">
              <div className="mb-1">
                <span className="fs-14" style={{ color: 'gray' }}>Uploaded by - </span>
                <span className="fs-14 fw-semibold">Rahul Singh</span>
              </div>

              <div className="d-flex align-items-center gap-1 fs-14 text-muted">
                <CalendarMonthIcon fontSize="small" />
                <span>12/06/2025</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    )
  }

  const pdfFile = () => {
    return (
      <div className='p-3 w-100'>
        <ReactPDFViewer />
      </div>
    );
  };
  return (
    <div>
      <RightDrawer isPdfView={isPdfView} toggleDrawer={toggleDrawer} drawerHeader={drawerHeader} drawerBody={drawerBody} drawerFilePreviewHeader={drawerFilePreviewHeader} drawerFilePreviewBody={drawerFilePreviewBody} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} pdfFile={pdfFile} />
      <h5>Upload Document</h5>
      <div className='row  mb-4 mt-4'>
        <div className='col col-12 col-lg-4 mb-3 col-md-4'>
          <div className='card_div p-3 w-auto card-border-blue'>
            <div><AccountBoxIcon style={{ width: 20, height: 20, color: 'gray' }} /></div>
            <div className='mt-1 fs-12'>Total Clients</div>
            <div className='d-flex justify-content-between align-items-center'><div className='fs-14 fw-600 icon-color'>120</div><div><div><MenuPopup /></div></div></div>
          </div>
        </div>
        <div className='col col-12 col-lg-4 mb-3 col-md-4'>
          <div className='card_div p-3 w-auto card-border-green'>
            <div><AccountBoxIcon style={{ width: 20, height: 20, color: 'gray' }} /></div>
            <div className='mt-1 fs-12'>Total Active Clients</div>
            <div className='d-flex justify-content-between align-items-center'>
              <div className='fs-14 fw-600 active-color'>100</div>
              <div><MenuPopup /></div>
            </div>
          </div>
        </div>
        <div className='col col-12 col-lg-4 mb-3 col-md-4'>
          <div className='card_div p-3 w-auto card-border-red'>
            <div><AccountBoxIcon style={{ width: 20, height: 20, color: 'gray' }} /></div>
            <div className='mt-1 fs-12'>Total Inactive Clients</div>
            <div className='d-flex justify-content-between align-items-center'><div className='fs-14 fw-600 inactive-color'>20</div><div><div><MenuPopup /></div></div></div>
          </div>
        </div>
      </div>
      <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
      <div className='table_div p-3'>
        <div className='d-lg-flex d-md-flex  justify-content-between'>
          <AnimatedSearchBar placeholder="Search..." type="text" id="filter-text-box" onInput={onFilterTextBoxChanged} />
          <div className='d-lg-flex d-md-flex  justify-content-end mb-3'>
            <div className='pe-2 d-lg-flex d-md-flex gap-3'>
              <div>
                <button className="reject upload-wrapper upload-label" onClick={openModal}>
                  <span className="icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M5 20h14v-2H5v2zm7-18l-5.5 5.5h4v6h3v-6h4L12 2z" />
                    </svg>
                  </span>
                  <span className="text">Upload File</span>
                </button>
              </div>
              {/* <MonthYearCalander /> */}
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
            <DeleteModal deleteForm={deleteModal} deleteTitle='Delete User' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />
            <SmallSizeModal crudForm={fileUploadForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isFileUploadModalOpen} setIsModalOpen={setIsFileUploadModalModalOpen} closeModal={closeModal} />
          </div>
        </div>

        <div className="ag-theme-quartz" style={{ height: '600px', width: '100%', marginTop: '1rem' }}>
          <AgGridReact
            theme="legacy"
            ref={gridRef}
            rowData={data || []}
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

export default DocumentUpload;
