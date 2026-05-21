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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SingleSelectTextField from '../component/MuiInputs/SingleSelectTextField';
import PasswordInput from '../component/MuiInputs/PasswordInput';
import MultipleSelectFields from '../component/MuiInputs/MultipleSelectFields';
import MuiSearchBar from '../component/MuiInputs/MuiSearchBar';
import Toggle from '../component/Toggle';
import { fetchAllUser, fetchAllGroupHolding, deleteUserById, fetchAllUserName, fetchAllCompaniesName, createUser, updateUserById, fetchAllLocationName } from '../api/service';
import DeleteModal from '../component/DeleteModal';
import Snackbars from '../component/Snackbars';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import AttachFileIcon from '@mui/icons-material/AttachFile';
// import AccountBoxIcon from '@mui/icons-material/CalendarMonth';
// import MenuPopup from './MenuPopup';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import MenuPopup from '../component/MenuPopup';
import MultiFileUpload from '../component/MultiFileUpload';
import RightDrawer from '../component/RightDrawer';
import ResponsiveDatePickers from '../component/DatePicker';
import { ReactPDFViewer } from '../component/ReactPDFViewer';
import SmallSizeModal from '../component/SmallSizeModal';
// Register module
ModuleRegistry.registerModules([AllCommunityModule]);
const dummuJsonData = [
    {
        "id": 1744096161424,
        "name": "rupa",
        "email": "jha@gmail.com",
        "role_name": "Admin",
        "status": 'Tagged',
        "group_holding_name": "Tata",
        "company_common_name": 'xyz',
        "location_name": "Mumbai",
        "password": "password12",
        "uploaded_file": [
            "File1",
            "File2"
        ],
        'uploaded_at': new Date(),
        'updated_at': new Date(),
    },
    {
        "id": 1744096161425,
        "name": "rupa",
        "email": "jha@gmail.com",
        "role_name": "Super Admin",
        "status": 'Tagged',
        "password": "password12",
        "group_holding_name": "Tata",
        "company_common_name": 'xyz',
        "location_name": "Mumbai",
        "uploaded_file": [
            "File1",
            "File2"
        ],
        'uploaded_at': new Date(),
        'updated_at': new Date(),
    },
    {
        "id": 1744096161426,
        "name": "rupa",
        "email": "jha@gmail.com",
        "role_name": "Client",
        "status": 'Tagged',
        "password": "password12",
        "group_holding_name": "Tata",
        "company_common_name": 'xyz',
        "location_name": "Mumbai",
        "uploaded_file": [
            "File1",
            "File2"
        ],
        'uploaded_at': new Date(),
        'updated_at': new Date(),
    },
    {
        "id": 1744096161427,
        "name": "rupa",
        "email": "jha@gmail.com",
        "role_name": "Admin",
        "status": 'Tagged',
        "password": "password12",
        "group_holding_name": "Tata",
        "company_common_name": 'xyz',
        "location_name": "Mumbai",
        "uploaded_file": [
            "File1",
            "File2"
        ],
        'uploaded_at': new Date(),
        'updated_at': new Date(),
    },
    {
        "id": 1744096161428,
        "name": "rupa",
        "email": "jha@gmail.com",
        "role_name": "Client",
        "status": 'Tagged',
        "password": "password12",
        "group_holding_name": "Tata",
        "company_common_name": 'xyz',
        "location_name": "Mumbai",
        "uploaded_file": [
            "File1",
            "File2"
        ],
        'uploaded_at': new Date(),
        'updated_at': new Date(),
    },
    {
        "id": 1744096161429,
        "name": "rupa",
        "email": "jha@gmail.com",
        "role_name": "Super Admin",
        "status": 'Tagged',
        "password": "password12",
        "group_holding_name": "Tata",
        "company_common_name": 'xyz',
        "location_name": "Mumbai",
        "uploaded_file": [
            "File1",
            "File2"
        ],
        'uploaded_at': new Date(),
        'updated_at': new Date(),
    },
    {
        "id": 1744996161429,
        "name": "rupa",
        "email": "jha@gmail.com",
        "role_name": "Admin",
        "status": 'Tagged',
        "password": "password12",
        "group_holding_name": "Tata",
        "company_common_name": 'xyz',
        "location_name": "Mumbai",
        "uploaded_file": [
            "File1",
            "File2"
        ],
        'uploaded_at': new Date(),
        'updated_at': new Date(),

    },
    {
        "id": 1244096161429,
        "name": "rupa",
        "email": "jha@gmail.com",
        "role_name": "Super Admin",
        "status": 'Tagged',
        "password": "password12",
        "group_holding_name": "Tata",
        "company_common_name": 'xyz',
        "location_name": "Mumbai",
        "uploaded_file": [
            "File1",
            "File2"
        ],
        'uploaded_at': new Date(),
        'updated_at': new Date(),

    },
    {
        "id": 1044096161429,
        "name": "rupa",
        "email": "jha@gmail.com",
        "role_name": "Client",
        "status": 'Tagged',
        "password": "password12",
        "group_holding_name": "Tata",
        "company_common_name": 'xyz',
        "location_name": "Mumbai",
        "uploaded_file": [
            "File1",
            "File2"
        ],
        'uploaded_at': new Date(),
        'updated_at': new Date(),

    },
    {
        "id": 1744096161419,
        "name": "rupa",
        "email": "jha@gmail.com",
        "role_name": "Admin",
        "status": 'Tagged',
        "password": "password12",
        "group_holding_name": "Tata",
        "company_common_name": 'xyz',
        "location_name": "Mumbai",
        "uploaded_file": [
            "File1",
            "File2"
        ],
        'uploaded_at': new Date(),
        'updated_at': new Date(),

    },
    {
        "id": 1744096191429,
        "name": "rupa",
        "email": "jha@gmail.com",
        "role_name": "Super Admin",
        "status": 'Tagged',
        "password": "password12",
        "group_holding_name": "Tata",
        "company_common_name": 'xyz',
        "location_name": "Mumbai",
        "uploaded_file": [
            "File1",
            "File2"
        ],
        'uploaded_at': new Date(),
        'updated_at': new Date(),

    },
]
const TaggedDocument = () => {
    const [data, setData] = useState(dummuJsonData);
    const [columnDefs, setColumnDefs] = useState([]);

    const [current, setCurrent] = useState({ user_id: null, role_name: '', email: '', role_name: '', role_id: null, password: "", status: 'Active', desc: '', uploaded_file: [], group_holding_name: "", group_holding_id: null, company_common_name: "", company_id: null, location_name: "", location_id: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [groupHoldingName, setGroupHoldingName] = useState([])
    const [companyName, setCompanyName] = useState([])
    const [locationName, setLocationName] = useState([])
    const [rolesName, setRolesName] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFileUploadModalOpen, setIsFileUploadModalModalOpen] = useState(false);
    const [fileName, setFileName] = useState(''); // State to store the file name

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
        setCurrent((prev) => ({ ...prev, uploaded_file: newValue }));
    };
    const handleSubmit = async (e) => {
        // e?.preventDefault();

        const payload = {
            "Name": "Rupa Jha",
            "Email": current?.email,
            "MobileNumber": "2345876543",
            "IsKarma": false,
            "Username": current?.role_name,
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
            
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: message, severityType: 'success' });

            // Refresh data
            const updatedData = await fetchAllUser();
            setData(updatedData);
        } catch (error) {

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
        setIsFileUploadModalModalOpen(true);
    };

    const closeModal = () => {
        setIsFileUploadModalModalOpen(false);
    };
    const uploadFile = () => {
        const reader = new FileReader();

        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Read second sheet (index 1)
            const sheetName = workbook.SheetNames[0];
            if (!sheetName) {
                alert('The workbook does not have a second sheet.');
                return;
            }

            const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            const headers = sheet[0] || [];
            const rows = sheet.slice(1).map(row =>
                Object.fromEntries(headers.map((h, i) => [h, row?.[i] ?? '']))
            );

            setColumnDefs(headers.map(h => ({ field: h, editable: true })));
            setData(rows);
        };
        setIsModalOpen(false);

        reader.readAsArrayBuffer(fileName);
    }
    const roleName = ['Admin', 'Super Admin', 'Client', 'Manager'];
    const userStatus = [{ id: 1, name: 'Active' }, { id: 2, name: 'Inactive' }];

    const accessLevel = [
        "Group",
        "Company",
        "Location",
        "Module",
        "Sub-Module",
        "Role",
        "Tracker",
        "Own/Self",
        "All",

    ];
    const accessControl = [
        "Upload/Add New",
        "Edit",
        "Delete",
        "Can Approve",
    ];
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
                // console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);


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
            flex: 1,
            pinned: "right",
            cellStyle: { 'background-color': 'rgb(252 229 205 / 64%)' },
            cellRenderer: (params) => {
                return (
                    <div className="d-flex justify-content-around align-items-center">

                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                // setCurrent(params.data);
                                setIsEditing(false);
                                setIsModalOpen(true);
                                setUserId(params.data.id); // OR .user_id based on your data
                            }}
                        >
                            <AttachFileIcon fontSize="small" className="action_icon" />
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
                                setCurrent(params.data);
                                setIsEditing(true);
                                setIsModalOpen(true);
                                setUserId(params.data.id); // OR .user_id based on your data
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

        { field: 'id', headerName: 'ID', flex: 1, editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'name', headerName: 'Uploaded By', flex: 1, editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },

        {
            field: 'role_name', headerName: 'Role Name', flex: 1, editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true,

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
        {
            field: 'uploaded_file', headerName: 'Uploaded File', flex: 1, editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true,
            //  cellRenderer: (params) => {return(
            //   <span style={{color:'gray'}}>{params?.value}</span>
            //  )}
        },

        {
            field: 'status',
            headerName: 'File Status',
            flex: 1,
            editable: false,
            filter: true,
            headerStyle: {
                backgroundColor: '#ffffe24d',
            },
            cellRenderer: (params) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {params.value}
                    </div>
                );
            },
        },
        { field: 'uploaded_at', headerName: 'Uploaded At', flex: 1, editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },
        { field: 'updated_at', headerName: 'Updated At', flex: 1, editable: false, headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' }, filter: true, },


    ];
    const gridRef = useRef();
    const defaultColDef = {
        sortable: true,
        filter: true,
        editable: true,
        headerStyle: { color: '#515151', backgroundColor: '#ffffe24d' },
    };
    const onRowValueChanged = (event) => {
        //  // console.log('Row updated:', event.data);
    };
    const fileUploadForm = () => {
        return (
            <div>
                <div className="mb-3 ps-3 pe-3 pb-3 mt-4">
                    <div className="button-wrap">
                        <MultiFileUpload />
                        {/* <label className="upload_button" htmlFor="upload">
            <span className="me-2 upload_file_icon"><CloudUploadIcon /></span>Upload File
          </label>
          <input
            className="upload_file_input"
            id="upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          /> */}
                    </div>

                    {/* {fileName ? (
          <div className="mt-4 uploaded_file_name">
            <span><FilePresentIcon /></span>
            <span>{fileName.name}</span>
          </div>
        ) : (
          <div className="mt-4 not_uploaded_file_text">
            <span><FilePresentIcon /></span>File is not uploaded
          </div>
        )} */}
                </div>

                <div className="row row-gap-2">
                    <div className="col-12 col-md-6">
                        <button type="button" className="btn btn-secondary w-100" onClick={closeModal}>Cancel</button>
                    </div>
                    <div className="col-12 col-md-6">
                        <button type="submit" className="btn btn-primary w-100" onClick={uploadFile}>Upload</button>
                    </div>
                </div>
            </div>

        )

    }
    const crudTitle = "Upload Your File"
    const editCrudTitle = "Edit Your Uploaded File"
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
                            onClick={() => handleDelete(userId)}>Yes, I'm sure</button>
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
                    <SingleSelectTextField name="company_common_name" label="Company Common Name" value={current.company_common_name} onChange={(e) => setCurrent((prev) => ({ ...prev, company_common_name: e.target.value }))} names={userStatus} />
                    <MuiTextField label='Company Name' type='text' isRequired={true} fieldName='username' handleChange={handleChange} value={current.username} />
                </div>
                <div className='d-lg-flex d-md-flex gap-3 mb-3'>
                    <SingleSelectTextField name="company_common_name" label="Module" value={current.company_common_name} onChange={(e) => setCurrent((prev) => ({ ...prev, company_common_name: e.target.value }))} names={userStatus} />
                    <SingleSelectTextField name="company_common_name" label="Module Type" value={current.company_common_name} onChange={(e) => setCurrent((prev) => ({ ...prev, company_common_name: e.target.value }))} names={userStatus} />
                </div>
                <div className='d-lg-flex d-md-flex gap-3 mb-3'>
                    <SingleSelectTextField name="company_common_name" label="Location" value={current.company_common_name} onChange={(e) => setCurrent((prev) => ({ ...prev, company_common_name: e.target.value }))} names={userStatus} />
                    <SingleSelectTextField name="company_common_name" label="Document Type" value={current.company_common_name} onChange={(e) => setCurrent((prev) => ({ ...prev, company_common_name: e.target.value }))} names={userStatus} />
                </div>
                <div className='d-lg-flex d-md-flex gap-3 mb-3'>
                    <SingleSelectTextField name="company_common_name" label="Stage" value={current.company_common_name} onChange={(e) => setCurrent((prev) => ({ ...prev, company_common_name: e.target.value }))} names={userStatus} />
                    {/* <SingleSelectTextField name="company_common_name" label="Upload Date" value={current.company_common_name} onChange={(e) => setCurrent((prev) => ({ ...prev, company_common_name: e.target.value }))} names={userStatus} /> */}
                    <ResponsiveDatePickers />
                </div>
                <div className='d-lg-flex d-md-flex d-flex justify-content-between'>

                    <div>
                        <button type='submit' className='btn-sm btn btn-primary'>Cancle</button>
                    </div>
                    <div>
                        <button type='submit' className='btn-sm btn btn-primary'>{isEditing ? 'Save Changes' : 'Save'}</button>
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
                {/* <div>
          <ReactPDFViewer />
        </div> */}

            </div>
        )
    }
    return (
        <div>
            <RightDrawer drawerHeader={drawerHeader} drawerBody={drawerBody} drawerFilePreviewHeader={drawerFilePreviewHeader} drawerFilePreviewBody={drawerFilePreviewBody} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            <h5>Tagged Document</h5>
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
                    <div className='d-flex h-100'>
                        <div className="search-bar-container h-25">
                            <MuiSearchBar label='Search...' type='text' />
                            <button className='search-icon'><SearchIcon /></button>
                        </div>
                        {/* <MultipleSelectFields placeholder='Filter By Role' roleName={roleName} /> */}
                    </div>


                    <div className='d-lg-flex d-md-flex  justify-content-end mb-3'>
                        <div className='pe-2 d-lg-flex d-md-flex gap-3'>
                            {/* <button className='crud_btn w-100' onClick={openModal}>
                                <span><AddIcon /></span> <span className='button-style'>Add New User Role</span>
                            </button> */}
                            <div>
                                {/* <button className="reject upload-wrapper upload-label" onClick={openModal}>
                  <span className="icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M5 20h14v-2H5v2zm7-18l-5.5 5.5h4v6h3v-6h4L12 2z" />
                    </svg>
                  </span>
                  <span className="text">Upload File</span>
                </button> */}
                            </div>
                            {/* <button className="button approve">
                                <span className="icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12 3.41 13.41 9 19 21 7 19.59 5.59z" />
                                    </svg>
                                </span>
                                <span className="text">Approve All</span>
                            </button> */}
                        </div>
                        <DeleteModal deleteForm={deleteModal} deleteTitle='Delete User' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />
                        <SmallSizeModal crudForm={fileUploadForm} crudTitle={crudTitle} isEditing={isEditing} editCrudTitle={editCrudTitle} isModalOpen={isFileUploadModalOpen} setIsModalOpen={setIsFileUploadModalModalOpen} />
                    </div>
                </div>

                <div className="ag-theme-quartz" style={{ height: '600px', width: '100%', marginTop: '1rem' }}>
                    <AgGridReact
                        theme="legacy"
                        ref={gridRef}
                        rowData={data}
                        columnDefs={colDefs}
                        // columnDefs={columnDefs}
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

export default TaggedDocument;
