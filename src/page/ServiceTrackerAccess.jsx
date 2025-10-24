import { useEffect, useState } from 'react'
import '../style/servicetrackeraccess.css'
import { createServiceTrackerSpecifics, fetchAllServiceTrackerFields, fetchAllServiceTrackerName } from '../api/service'
import Snackbars from '../component/Snackbars'

function ServiceTrackerAccess() {
    const [selectedCategory, setSelectedCategory] = useState('')
    //  console.log(selectedCategory, 'selectedCategory')
    const [checkedItems, setCheckedItems] = useState({})
    const [trackerName, setTrackerName] = useState([])
    const [serviceTrackerFields, setServiceTrackerFields] = useState([])
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message: '',
        severityType: '',
    });
    //  console.log(serviceTrackerFields.data, 'serviceTrackerFields')
    //  console.log(trackerName, 'trackerName')
    //  console.log(checkedItems, 'checkedItems')
    const formattedTrackerName = selectedCategory?.toLowerCase().replace(/\s+/g, '_');

    useEffect(() => {
        // Fetch tracker names from API or define them here
        const fetchTrackerNames = async () => {
            const data = await fetchAllServiceTrackerName()
            setTrackerName(data)
        }
        fetchTrackerNames()
    }, [])
    useEffect(() => {
        const fetchServiceTrackerFields = async () => {
            const response = await fetchAllServiceTrackerFields(formattedTrackerName)
            // Map the array of field names to objects with id and name
            const data = {
                ...response,
                data: response.data.map(field => ({
                    id: field,
                    name: field.replace(/_/g, ' ').replace(/\(y_n\)/g, '').replace(/\s+/g, ' ').trim()
                }))
            }
            setServiceTrackerFields(data)
        }
        if (formattedTrackerName) {
            fetchServiceTrackerFields()
        }
    }, [formattedTrackerName])

    const handleRadioChange = (selectedTrackerName) => {
        setSelectedCategory(selectedTrackerName)
        setCheckedItems({})

    }

    const handleCheckboxChange = (itemId) => {
        setCheckedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }))
    }

    // const handleSaveTrackerAccess = async () => {
    //     const selectedFields = Object.keys(checkedItems).filter(itemId => checkedItems[itemId]);
    //     const selectedCategoryId = trackerName.find(category => category.name === selectedCategory)?._id;
    //     // Call the API to save the selected fields
    //     const payload = {
    //         service_tracker_id: selectedCategoryId,
    //         external_access: selectedFields
    //     };



    //     const result = await createServiceTrackerSpecifics(payload);
    //     setIsSnackbarsOpen({
    //         ...issnackbarsOpen,
    //         open: true,
    //         message: result?.message,
    //         severityType: 'success',
    //     });
    //      console.log("Selected fields to save:", selectedFields);
    // }

    const handleSaveTrackerAccess = async () => {
        const selectedFields = Object.keys(checkedItems).filter(itemId => checkedItems[itemId]);
        const selectedCategoryId = trackerName.find(category => category.name === selectedCategory)?._id;
        // Call the API to save the selected fields
        const payload = {
            service_tracker_id: selectedCategoryId,
            external_access: selectedFields
        };
        try {
            const result = await createServiceTrackerSpecifics(payload);
             console.log(result,'result')
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: result?.message,
                severityType: 'success',
            });

        } catch (error) {
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: error?.response?.data?.message, severityType: 'error' });
        }
    };
    return (
        <div>
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
            <div className="notification-page-title service-tracker-access-page-header">
                <div>
                    <h1>Service Tracker Access For User</h1>
                    <p className='d-flex justify-content-center'>Choose a tracker name to see available columns options</p>
                </div>
                <div>
                </div>
            </div>
            <div className="service-tracker-access-main-div">
                <div className="service-tracker-access-page-container">
                    <div className='d-flex justify-content-end'>
                        <button className='crud_btn' onClick={() => { handleSaveTrackerAccess() }}>
                            <span className='button-style'>Save Tracker Access</span>
                        </button>
                    </div>

                    <div className="content">
                        <div className="categories-section">
                            <h2>Trackers Name</h2>
                            <div className="category-list">
                                {trackerName.map(category => (
                                    <div key={category._id} className="category-item">
                                        <input
                                            type="radio"
                                            id={category._id}
                                            name="category"
                                            value={category.name}
                                            checked={selectedCategory === category.name}
                                            onChange={() => handleRadioChange(category.name)}
                                            className="radio-input"
                                        />
                                        <label htmlFor={category._id} className="radio-label">
                                            <span className="radio-custom"></span>
                                            {category.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {serviceTrackerFields.data && (
                            <div className="items-section">
                                <h2>Select from {selectedCategory}</h2>
                                <div className="items-list">
                                    {Array.isArray(serviceTrackerFields.data) && serviceTrackerFields.data.map(item => (
                                        <div key={item.id} className="item-container">

                                            <div className="checkbox-item">
                                                <input
                                                    type="checkbox"
                                                    id={item.id}
                                                    checked={checkedItems[item.id] || false}
                                                    onChange={() => handleCheckboxChange(item.id)}
                                                    className="checkbox-input"
                                                />
                                                <label htmlFor={item.id} className="checkbox-label">
                                                    <span className="checkbox-custom"></span>
                                                    {item.name}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="selection-summary">
                                    <h3>Your Selections:</h3>
                                    <div className="summary-content">
                                        {Object.entries(checkedItems)
                                            .filter(([_, checked]) => checked)
                                            .map(([itemId, _]) => {

                                                const item = Array.isArray(serviceTrackerFields.data)
                                                    ? serviceTrackerFields.data.find(i => i.id === itemId)
                                                    : null;
                                                return item ? (
                                                    <span key={itemId} className="selected-item checkbox-selected">
                                                        {item.name}
                                                    </span>
                                                ) : null;
                                            })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ServiceTrackerAccess