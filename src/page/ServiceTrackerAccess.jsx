import { useEffect, useState } from 'react'
import '../style/servicetrackeraccess.css'
import { createServiceTrackerSpecifics, fetchAllServiceTrackerFields, fetchAllServiceTrackerName } from '../api/service'
import Snackbars from '../component/Snackbars'

function ServiceTrackerAccess() {
    const [selectedCategory, setSelectedCategory] = useState('')
    const [checkedItems, setCheckedItems] = useState({})
    const [checkedTrackerKeys, setCheckedTrackerKeys] = useState('')
    // console.log(checkedTrackerKeys, 'checkedTrackerKeys')
    const [trackerName, setTrackerName] = useState([])
    const [serviceTrackerFields, setServiceTrackerFields] = useState([])
    // console.log(serviceTrackerFields, 'serviceTrackerFields')
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message: '',
        severityType: '',
    });
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
            const response = await fetchAllServiceTrackerFields(formattedTrackerName);

            const data = Object.keys(response.tracker_keys).map(trackerKey => ({
                trackerKey, // helpdesk_pf_esi_general
                fields: response.tracker_keys[trackerKey].map(field => ({
                    id: field,
                    name: field
                        .replace(/_/g, ' ')
                        .replace(/\(y_n\)|\?/g, '')
                        .replace(/\s+/g, ' ')
                        .trim()
                }))
            }));

            setServiceTrackerFields(data);
        };

        if (formattedTrackerName) {
            fetchServiceTrackerFields();
        }
    }, [formattedTrackerName]);


    const handleRadioChange = (selectedTrackerName) => {
        setSelectedCategory(selectedTrackerName)
        setCheckedItems({})
        setCheckedTrackerKeys('')

    }

    const handleCheckboxChange = (itemId) => {
        setCheckedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }))
    }
    const handleTrackerKeyChange = (itemId) => {
        setCheckedTrackerKeys(itemId)
        setCheckedItems({});
    }
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
            // console.log(result, 'result')
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
            <div className='service-tracker-inner-page-header d-lg-flex d-md-flex'>
                <div className="notification-page-title">
                    <div>
                        <h1>Service Tracker Access For User</h1>
                        <p className=''>Choose a tracker name to see available columns options</p>
                    </div>
                </div>
                <div className='d-lg-flex d-md-flex gap-2 mt-2'>
                    <div className='d-flex justify-content-end'>
                        <button className='crud_btn' onClick={() => { handleSaveTrackerAccess() }}>
                            <span className='button-style'>Save Tracker Access</span>
                        </button>
                    </div>

                </div>
            </div>
            <div className="service-tracker-access-main-div">
                <div className="service-tracker-access-page-container">
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
                        {serviceTrackerFields?.length > 0 ? (
                            <div className="items-section">
                                <h2>Select from - {selectedCategory}</h2>
                                <div className="items-list">
                                    {Array.isArray(serviceTrackerFields) && serviceTrackerFields.map(item => (
                                        <div key={item.trackerKey}>
                                            <div className="radio-item">
                                                <input
                                                    type="radio"
                                                    id={item.trackerKey}
                                                    checked={checkedTrackerKeys === item.trackerKey || checkedTrackerKeys[item.trackerKey] || false}
                                                    onChange={() => handleTrackerKeyChange(item.trackerKey)}
                                                    className="radio-input"
                                                />
                                                <label htmlFor={item.trackerKey} className="radio-label">
                                                    <span className="radio-custom"></span>
                                                    {item.trackerKey.replace(/_/g, ' ')
                                                        .replace(/\(y_n\)|\?/g, '')
                                                        .replace(/\s+/g, ' ')
                                                        .trim()}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="">
                                    {checkedTrackerKeys && (
                                        <div className="item-container">
                                            {serviceTrackerFields
                                                .find(item => item.trackerKey === checkedTrackerKeys)
                                                ?.fields.map(field => (
                                                    <div key={field.id} className="checkbox-item">
                                                        <input
                                                            type="checkbox"
                                                            id={field.id}
                                                            checked={checkedItems[field.id] || false}
                                                            onChange={() => handleCheckboxChange(field.id)}
                                                            className="checkbox-input"
                                                        />
                                                        <label htmlFor={field.id} className="checkbox-label">
                                                            <span className="checkbox-custom"></span>
                                                            {field.name}
                                                        </label>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                                <div>

                                </div>
                                {/* <div className="selection-summary">
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
                                </div> */}
                            </div>
                        ) : (<div className="items-section">
                            <h2>Select from - {selectedCategory}</h2>
                            <p>No fields available for the selected tracker.</p>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ServiceTrackerAccess