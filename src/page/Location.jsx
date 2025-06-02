
import React, { useEffect, useState } from 'react';
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
import { createLocation, deleteLocationById, fetchAllCompaniesName, fetchAllGroupHolding, fetchAllLocation, getCompanyByGroupId, updateLocationById } from '../api/Service';
import DeleteModal from '../component/DeleteModal';
import Snackbars from '../component/Snackbars';


const Location = () => {
    // const [data, setData] = useState([]);
    // if you want to show dummy jason data 
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState(
        {
            id: null, company_name: '',
            company_id: null,
            group_holding_name: '',
            created_at: '',
            location_name: "",
            // location_id: null,
            updated_at: '',
        });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupHoldingData, setGroupHoldinData] = useState([])
    const [companyNameData, setCompanyNameData] = useState([])
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // const [issnackbarsOpen, setIsSnackbarsOpen] = useState(false);
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const [locationId, setLocationId] = useState(null);
    const [companyNameByGroupHoldingId, setCompanyNameByGroupHoldingId] = useState([])
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // You can adjust the number of items per page


    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrent((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        // e?.preventDefault();

        const payload = {
            location_name: current?.location_name || '',
            location_company_id: current?.company_id || '',
            isActive: true,
            approved_by: 3,
            created_by: 2
        };
        const EditPayload = {
            location_name: current?.location_name || '',
            location_company_id: current?.location_company_id || '',
            //   groups_holdings_id: current?.groups_holdings_id || null
        };

        try {
            if (isEditing) {
                // Update existing company
                await updateLocationById(current.location_id, EditPayload);
            } else {
                // Create new company
                await createLocation(payload);
            }
            // Refresh data
            const updatedData = await fetchAllLocation();
            setData(updatedData);
        } catch (error) {
            console.error("Error saving company:", error);
        }

        // Reset form state
        setCurrent({
            company_id: null,
            company_name: '',
            group_holding_name: '',
            groups_holdings_id: null,
            created_at: '',
            updated_at: '',
        });

        setIsEditing(false);
        setIsModalOpen(false);
    };

    // Handle Edit
    const handleEdit = (location_id) => {
        // setCurrent({ company_id: company_id })
        const item = data.find((item) => item.location_id === location_id);
        setCurrent(item);
        setIsEditing(true);
        setIsModalOpen(true);

    };

    // Handle Delete
    // const handleDelete =async (location_id) => {
    //     const item = data.find((item) => item.location_id === location_id);
    //     setCurrent(item);
    //      try {
    //           await deleteLocationById(location_id); // wait for the delete to complete
    //           // Optionally refresh data after delete
    //           const updatedData = await fetchAllLocation();
    //           setData(updatedData);
    //           setIsDeleteModalOpen(false); // close modal after deletion
    //           setIsSnackbarsOpen({ ...issnackbarsOpen, open: true });

    //         //   setIsSnackbarsOpen(true)
    //         } catch (error) {
    //         //   setIsSnackbarsOpen(true)
    //           setIsSnackbarsOpen({ ...issnackbarsOpen, open: true });
    //         }
    // };


    const handleDelete = async (locationId) => {
        try {
            const response = await deleteLocationById(locationId);
            const message = response?.message || "Company deleted successfully";

            // Refresh data
            const updatedData = await fetchAllLocation();
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
  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locationData, groupHolding, companyName] = await Promise.all([
                    fetchAllLocation(),
                    fetchAllGroupHolding(),
                    // fetchAllCompaniesName(),
                ]);
                setData(locationData);
                setGroupHoldinData(groupHolding);
                setCompanyNameData(companyName);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await getCompanyByGroupId(current?.groups_holdings_id);
                const company = data?.companies?.[0];

                if (company) {
                    // Set company name list for dropdown (even though it's disabled)
                    setCompanyNameByGroupHoldingId([{ id: company.id, name: company.name }]);

                    // Set selected company name in state
                    setCurrent((prev) => ({
                        ...prev,
                        company_name: company.name,
                        company_id: company.id,

                    }));
                }
            } catch (error) {
                console.error("Failed to fetch company:", error);
            }
        };

        if (current?.groups_holdings_id) {
            fetchCompany();
        }
    }, [current?.groups_holdings_id]);


    const crudForm = () => {
        return (
            <div>
                {/* <form onSubmit={handleSubmit}> */}

                <div>
                    {/* <SingleSelectTextField
                        name="group_holding_name"
                        label="Group Holding"
                        value={current?.group_holding_name}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const matchedGroup = groupHoldingData.find(
                                (g) => g.name === selectedName
                            );
                            setCurrent((prev) => ({
                                ...prev,
                                group_holding_name: selectedName,
                                groups_holdings_id: matchedGroup?.id || null,
                            }));
                        }}
                        names={groupHoldingData}
                        isdisable={isEditing ? true : false}
                    /> */}

                    <SingleSelectTextField
                        name="group_holding_name"
                        label="Group Holding"
                        value={current?.group_holding_name}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const matchedGroup = groupHoldingData.find(
                                (g) => g.name === selectedName
                            );
                            setCurrent((prev) => ({
                                ...prev,
                                group_holding_name: selectedName,
                                groups_holdings_id: matchedGroup?.id || null,
                                company_name: '', // reset when group changes
                            }));
                        }}
                        names={groupHoldingData}
                        isdisable={isEditing}
                    />

                </div>
                <div className=''>
                    <SingleSelectTextField
                        name="company_name"
                        label="Company Name"
                        value={current?.company_name}
                        names={companyNameByGroupHoldingId}
                        isdisable={true}
                    />
                </div>
                <div>
                    <MuiTextField label='Location' type='text' isRequired={true} fieldName='location_name' handleChange={handleChange} value={current?.location_name} />
                </div>

                <div className="row row-gap-2">
                    <div className='col col-12 col-md-6'>
                        <button type="button" className="btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col col-12 col-md-6 d-flex justify-content-end'>
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{isEditing ? <span className='button-style'>Save Changes</span> : <span className='button-style'>Create Location</span>}</button>
                    </div>
                </div>
                {/* </form> */}
            </div>

        )

    }
    const crudTitle = "Add company Location"
    const editCrudTitle = "Edit Location"
    const deleteModal = () => {
        return (
            <div>
                <div className='delete_message p-4'>
                    Are you sure you want to delete <DeleteIcon className='action_icon' /> this company Location?
                </div>

                <div className="row row-gap-2 mt-4">
                    <div className='col col-12 col-md-6'>
                        <button type="button" className="btn-sm btn btn-secondary" onClick={closeModal}><span className='button-style'>Cancel</span></button>
                    </div>
                    <div className='col col-12 col-md-6 d-flex justify-content-end'>
                        <button type="submit"
                            className="btn-sm btn btn-primary"
                            onClick={() => handleDelete(locationId)}>Yes, I'm sure</button>
                    </div>
                </div>
            </div>


        )

    }
    return (
        <div>
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
            {/* Table to display data */}
            <div className='table_div p-3'>
                <div className='d-lg-flex d-md-flex  justify-content-between'>
                    <div className='d-flex h-100'>
                        <div className="search-bar-container h-25">
                            {/* <input type="text" placeholder="Search..." name="search" className='search-bar-input p-1 w-100' /> */}
                            <MuiSearchBar label='Search...' type='text' />
                            <button className='search-icon'><SearchIcon /></button>
                        </div>
                        <MultipleSelectFields
                            placeholder="Filter By Group Holding"
                            roleName={groupHoldingData}
                            onChange={(selectedIds) => {
                                // use selectedIds in your filters or elsewhere
                            }}
                        />
                    </div>


                    <div className='d-lg-flex d-md-flex  justify-content-end mb-3'>
                        <div className='pe-2'>
                            <button className='crud_btn' onClick={openModal}>
                                <span><AddIcon /></span> <span className='button-style'>Add company Location</span>
                            </button>
                        </div>
                        <DeleteModal deleteForm={deleteModal} deleteTitle='Delete Location' isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen} />

                        {/* <div>
                            <button className='crud_btn' onClick={handleDeleteAll} disabled={selectedRows.length === 0}>
                                <span className='button-style'> Delete All</span>
                            </button>
                        </div> */}

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
                                <th className='table_th_tag  ps-2 pe-2'><span>Location</span>
                                    <span className='ms-4'>
                                        <ExpandCircleDownIcon className='table_th_icon' />

                                    </span>
                                </th>
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
                                                <button className='btn  mt-1 btn-sm' onClick={() => handleEdit(item.location_id)}><EditIcon className='action_icon' /></button>
                                            </div>
                                            <div>
                                                <button className='btn  mt-1 btn-sm' onClick={() => {
                                                    setLocationId(item.location_id);
                                                    setIsDeleteModalOpen(true);
                                                }}><DeleteIcon className='action_icon' /></button>
                                            </div>
                                        </td>
                                        <td className=' table_td_font ps-2 pe-2'>{item.location_name ? item.location_name : '-'}</td>

                                        <td className=' table_td_font ps-2 pe-2'>{item.company_name ? item.company_name : '-'}</td>
                                        <td className=' table_td_font ps-2 pe-2'>{item.group_holding_name ? item.group_holding_name : '-'}</td>
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

export default Location;
