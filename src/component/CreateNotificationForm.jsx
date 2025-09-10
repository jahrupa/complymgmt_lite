import React, { useEffect, useState } from 'react'
import SingleSelectTextField from './MuiInputs/SingleSelectTextField';
import { fetchAllGroupHolding, fetchAllNotificationTemplates, fetchAllUser, fetchCompaniesNameByGroupId, getLocationByCompanyId } from '../api/service';
import MultipleSelectTextFields from './MuiInputs/MultipleSelectTextFields';
import ResponsiveDatePickers from './DatePicker';
import MuiTextField from './MuiInputs/MuiTextField';

const CreateNotificationForm = ({ setEditForm, editForm }) => {
    const [groupHoldingName, setGroupHoldingName] = useState([])
    const [companyName, setCompanyName] = useState([])
    const [locationName, setLocationName] = useState([])
    const [templateName, setTemplateName] = useState([]);
    const [userName, setUserName] = useState([]);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!editForm.group_name) newErrors.group_name = 'Group Holding is required';
        if (!editForm.company_name) newErrors.company_name = 'Company Name is required';
        if (!editForm.location_name) newErrors.location_name = 'Location Name is required';
        if (!editForm.template_name) newErrors.template_name = 'Template Name is required';
        if (!editForm.template_priority) newErrors.template_priority = 'Template Priority is required';
        if (!editForm.send_to || editForm.send_to.length === 0) newErrors.send_to = 'At least one recipient is required';
        if (!editForm.cc_user || editForm.cc_user.length === 0) newErrors.cc_user = 'At least one CC user is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const priorities = [
        { value: 'LOW', label: 'Low Priority', color: '#6b7280' },
        { value: 'MEDIUM', label: 'Medium Priority', color: '#2563eb' },
        { value: 'HIGH', label: 'High Priority', color: '#dc2626' }
    ];
    // Fetch group holdings on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.allSettled([fetchAllGroupHolding(), fetchAllUser()]);
                if (results[0].status === "fulfilled") {
                    setGroupHoldingName(results[0].value);
                }

                if (results[1].status === "fulfilled") {
                    setUserName(results[1].value);
                }

                results.forEach((result, idx) => {
                    if (result.status === "rejected") {
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
                const data = await fetchCompaniesNameByGroupId(editForm?.group_holdings_id);
                if (data) {
                    setCompanyName(data);
                }
            } catch (error) {
                console.error("Failed to fetch company:", error);
            }
        };

        if (editForm?.group_holdings_id) {
            fetchCompany();
        }
    }, [editForm?.group_holdings_id]);

    useEffect(() => {
        const fetchLocationByCompanyId = async () => {
            try {
                const data = await getLocationByCompanyId(editForm?.company_id);
                if (data) {
                    setLocationName(data);
                }
            } catch (error) {
                console.error("Failed to fetch location by company_id:", error);
            }
        };

        if (editForm?.company_id) {
            fetchLocationByCompanyId();
        }
    }, [editForm?.company_id]);

    useEffect(() => {
        const fetchTemplateNames = async () => {
            try {
                const data = await fetchAllNotificationTemplates();
                if (data) {
                    setTemplateName(data);
                }
            } catch (error) {
                console.error("Failed to fetch template names:", error);
            }
        };
        fetchTemplateNames();
    }, []);

    return (
        <div>
            <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
                <SingleSelectTextField
                    name="group_name"
                    label="Group Holding"
                    value={editForm.group_name}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        const matchedGroup = groupHoldingName.find(
                            (g) => g.name === selectedName
                        );
                        setEditForm((prev) => ({
                            ...prev,
                            group_name: selectedName,
                            group_holdings_id: matchedGroup?._id || null,
                            company_name: '',
                            location_name: '',
                        }));
                    }}
                    names={groupHoldingName}
                // error={!!errors.group_name}
                // helperText={errors.group_name}
                />
                <SingleSelectTextField name="company_name" label="Company Name" value={editForm?.company_name}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        const matchedCompany = companyName.find(
                            (g) => g.company_name === selectedName
                        );
                        setEditForm((prev) => ({
                            ...prev,
                            company_name: selectedName,
                            company_id: matchedCompany?._id || null,
                        }));
                    }}
                    names={companyName.map((item) => ({
                        _id: item._id,
                        name: item.company_name,
                    }))}
                // error={!!errors.company_name}
                // helperText={errors.company_name}
                // isdisable={isEditing ? true : false}

                />
                <SingleSelectTextField name="location_name" label="Location" value={editForm?.location_name}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        const matchedLocation = locationName.find(
                            (g) => g.location_name === selectedName
                        );
                        setEditForm((prev) => ({
                            ...prev,
                            location_name: selectedName,
                            location_id: matchedLocation?._id || null,
                        }));
                    }}
                    names={locationName.map((item) => ({
                        _id: item._id,
                        name: item.location_name,
                    }))}
                // isdisable={isEditing ? true : false}
                // error={!!errors.location_name}
                // helperText={errors.location_name}

                />
            </div>
            <div className='d-lg-flex d-md-flex justify-content-between gap-3'>
                <MuiTextField
                    name="template_name"
                    label="Template Name"
                    value={editForm?.template_name}
                    isdisabled={true}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        const matchedTemplate = templateName.find(
                            (g) => g.name === selectedName
                        );
                        setEditForm((prev) => ({
                            ...prev,
                            template_name: selectedName,
                            template_id: matchedTemplate?._id || null,
                        }));
                    }}
                    error={!!errors.template_name}
                    helperText={errors.template_name}
                />
                {/* <SingleSelectTextField name="template_name" label="Template" value={editForm?.template_name}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        const matchedTemplate = templateName.find(
                            (g) => g.name === selectedName
                        );
                        setEditForm((prev) => ({
                            ...prev,
                            template_name: selectedName,
                            template_id: matchedTemplate?._id || null,
                        }));
                    }}
                    names={templateName.map((item) => ({
                        _id: item._id,
                        name: item.template_name,
                    }))}
                /> */}
                <SingleSelectTextField name="template_priority" label="Template Status" value={editForm?.template_priority}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        setEditForm((prev) => ({
                            ...prev,
                            template_priority: selectedName,
                        }));
                    }}
                    names={priorities.map((item) => ({
                        _id: item.label,
                        name: item.value,
                    }))}
                // isdisable={isEditing ? true : false}
                // error={!!errors.template_status}
                // helperText={errors.template_status}

                />
            </div>

            <MultipleSelectTextFields
                label="Send To"
                value={editForm?.send_to || []}   // always an array
                onChange={(selectedValues) => {
                    setEditForm((prev) => ({
                        ...prev,
                        send_to: selectedValues, // store emails
                    }));
                }}

                names={userName.map((item) => ({
                    _id: item._id,
                    name: item.email,
                    optionalValue: item.full_name
                }))}
            // isdisable={isEditing ? true : false}
            // error={!!errors.template_name}
            // helperText={errors.template_name}

            />
            <MultipleSelectTextFields
                label="cc"
                value={editForm.cc_user || []}   // always an array
                onChange={(selectedValues) => {
                    setEditForm((prev) => ({
                        ...prev,
                        cc_user: selectedValues, // store emails
                    }));
                }}
                names={userName.map((item) => ({
                    _id: item._id,
                    name: item.email,         // used for selection
                    optionalValue: item.full_name, // extra info if needed later
                }))}


            // error={!!errors.access}
            // helperText={errors.access}
            // isRequired={true}
            />
            <ResponsiveDatePickers />
        </div>

    )
}

export default CreateNotificationForm