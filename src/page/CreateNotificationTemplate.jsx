import React, { useState } from 'react';
import {
    Bell,
    Save,
    X,
    Eye,
    Settings,
    ChevronDown
} from 'lucide-react';
import '../style/createNotification.css';
import { createNotificationTemplate } from '../api/service';
import Snackbars from '../component/Snackbars';

function CreateNotificationTemplate() {
    const [notification, setNotification] = useState({
        template_name: '',
        type: '',
        priority: '',
        header: '',
        content: '',
        isActive: true,
        in_app: true,
        email: false,
        textStyle: {
            bold: false,
            italic: false,
            fontSize: '16',
            color: '#374151',
            backgroundColor: '#ffffff'
        }
    });
    const [errors, setErrors] = useState({});
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message: '',
        severityType: '',
    });

    const [showPreview, setShowPreview] = useState(true);

    const notificationTypes = [
        { value: 'info', label: 'Information', color: 'linear-gradient(135deg, #3b82f6, #2563eb)', icon: '💡' },
        { value: 'success', label: 'Success', color: 'linear-gradient(135deg, #10b981, #059669)', icon: '✅' },
        { value: 'warning', label: 'Warning', color: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: '⚠️' },
        { value: 'error', label: 'Error', color: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '❌' },
        { value: 'reminder', label: 'Reminder', color: 'linear-gradient(135deg, #6366f1, #4338ca)', icon: '⏰' }, // Clock icon
        { value: 'notify', label: 'NOTIFY', color: 'linear-gradient(135deg, #f87171, #dc2626)', icon: '🚨' }, // Siren icon
        { value: 'other', label: 'Other', color: 'linear-gradient(135deg, #6b7280, #374151)', icon: '📌' } // Pin icon
    ];


    const priorities = [
        { value: 'low', label: 'Low Priority', color: '#6b7280' },
        { value: 'medium', label: 'Medium Priority', color: '#2563eb' },
        { value: 'high', label: 'High Priority', color: '#dc2626' }
    ];

    const validateFields = () => {
        let newErrors = {};

        if (!notification.type) newErrors.type = "Template Type is required.";
        if (!notification.priority) newErrors.priority = "Template Priority is required.";
        if (!notification.template_name.trim()) newErrors.template_name = "Template Name is required.";
        if (!notification.header.trim()) newErrors.header = "Notification Header is required.";
        if (!notification.content.trim()) newErrors.content = "Notification Content is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSave = async () => {
        if (!validateFields()) {
            return; // ❌ Stop saving if validation fails
        }
        // find selected priority & type objects
        const selectedPriority = priorities.find(p => p.value === notification.priority);
        const selectedType = notificationTypes.find(t => t.value === notification.type);
        const notificationPayload = {
            template_name: notification.template_name,
            template_body: notification.content,
            template_subject: notification.header,
            template_priority: notification.priority.toUpperCase(),
            template_type: notification.type.toUpperCase(),
            in_app: notification.in_app,
            email: notification.email,
            template_priority_color: selectedPriority ? selectedPriority.color : '',
            template_type_color: selectedType ? selectedType.color : '',
            delivery_type: [
                ...(notification.email ? ['EMAIL'] : []),
                ...(notification.in_app ? ['IN_APP'] : [])
            ]
        };
        try {
            const response = await createNotificationTemplate(notificationPayload);
            const message = response?.message || "Notification template created successfully";
            const saveBtn = document.getElementById('save-btn');
            saveBtn?.classList.add('pulse-animation');
            setTimeout(() => {
                saveBtn?.classList.remove('pulse-animation');
            }, 1000);

            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message,
                severityType: 'success',
            });
            // ✅ Form reset karo (reload nahi)
            setNotification({
                template_name: '',
                type: '',
                priority: '',
                header: '',
                content: '',
                isActive: true,
                in_app: true,
                email: false,
                textStyle: {
                    bold: false,
                    italic: false,
                    fontSize: '16',
                    color: '#374151',
                    backgroundColor: '#ffffff'
                }
            });
        } catch (error) {
            setIsSnackbarsOpen({
                ...issnackbarsOpen,
                open: true,
                message: error?.response?.data?.message,
                severityType: 'error',
            });
        }

    };


    const handleDiscard = () => {
        setNotification({
            template_name: '',
            type: '',
            priority: '',
            header: '',
            content: '',
            isActive: true,
            textStyle: {
                bold: false,
                italic: false,
                fontSize: '16',
                color: '#374151',
                backgroundColor: '#ffffff'
            }
        });
        setErrors({});
    };

    const getNotificationTypeData = (type) => {
        return notificationTypes.find(t => t.value === type) || notificationTypes[0];
    };

    const currentTypeData = getNotificationTypeData(notification.type);
    const toggleInApp = () => {
        setNotification(prev => {
            // if turning off and email is false → keep in_app true
            if (prev.in_app && !prev.email) return { ...prev, in_app: true };
            return { ...prev, in_app: !prev.in_app };
        });
    };

    const toggleEmail = () => {
        setNotification(prev => {
            // if turning off and in_app is false → keep email true
            if (prev.email && !prev.in_app) return { ...prev, email: true };
            return { ...prev, email: !prev.email };
        });
    };

    return (
        <div className="">
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />

            <div className="max-width-container">
                <div className="header-section">
                    <div className="header-icon-title">
                        <div className="header-icon">
                            <Bell size={32} />
                        </div>
                        <h1 className="main-title">Create Notification Template</h1>
                    </div>
                </div>

                <div className="main-grid">
                    <div className="form-panel">
                        <div className="panel-header">
                            <h2 className="panel-title">
                                <Settings size={24} />
                                Configuration
                            </h2>
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="preview-toggle-btn"
                            >
                                <Eye size={16} />
                                {showPreview ? 'Hide' : 'Show'} Preview
                            </button>
                        </div>

                        {/* Dropdowns */}
                        <div className="dropdown-grid">
                            <div className="form-group">
                                <label className="form-label">Template Type</label>
                                <div className="select-wrapper">
                                    <select
                                        value={notification.type}
                                        onChange={(e) => setNotification(prev => ({ ...prev, type: e.target.value }))}
                                        className={`form-select ${errors.type ? 'error-input' : ''}`}
                                    >
                                        <option value="">Select Type</option>
                                        {notificationTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.icon} {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="select-icon" size={20} />
                                </div>
                                {errors.type && <p className="error-text inactive-color fs-14">{errors.type}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Template Priority</label>
                                <div className="select-wrapper">
                                    <select
                                        value={notification.priority}
                                        onChange={(e) => setNotification(prev => ({ ...prev, priority: e.target.value }))}
                                        className={`form-select ${errors.priority ? 'error-input' : ''}`}
                                    >
                                        <option value="">Select Priority</option>
                                        {priorities.map(priority => (
                                            <option key={priority.value} value={priority.value}>
                                                {priority.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="select-icon" size={20} />
                                </div>
                                {errors.priority && <p className="error-text inactive-color fs-14">{errors.priority}</p>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Template Name</label>
                            <input
                                type="text"
                                value={notification.template_name}
                                onChange={(e) => setNotification(prev => ({ ...prev, template_name: e.target.value }))}
                                className={`form-input ${errors.template_name ? 'error-input' : ''}`}
                                placeholder="Enter template name..."
                            />
                            {errors.template_name && <p className="error-text inactive-color fs-14">{errors.template_name}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Subject</label>
                            <input
                                type="text"
                                value={notification.header}
                                onChange={(e) => setNotification(prev => ({ ...prev, header: e.target.value }))}
                                className={`form-input ${errors.header ? 'error-input' : ''}`}
                                placeholder="Enter notification header..."
                            />
                            {errors.header && <p className="error-text inactive-color fs-14">{errors.header}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Notification Body</label>
                            <textarea
                                value={notification.content}
                                onChange={(e) => setNotification(prev => ({ ...prev, content: e.target.value }))}
                                rows={4}
                                className={`form-textarea ${errors.content ? 'error-input' : ''}`}
                                placeholder="Write your notification message here..."
                            />
                            {errors.content && <p className="error-text inactive-color fs-14">{errors.content}</p>}
                        </div>

                        {/* Active/Inactive Toggle */}
                        <div className="toggle-section">
                            <div className="toggle-info">
                                <h3 className="toggle-title">Delivery Methods</h3>
                                <p className="toggle-description">Choose at least one delivery method</p>
                            </div>
                            <div className="row align-items-center">
                                <div className='col-6'>
                                    <div className='mb-2'>In App</div>
                                    <button
                                        onClick={toggleInApp}
                                        className={`toggle-switch ${notification.in_app ? 'toggle-active' : ''}`}
                                    >
                                        <div className="toggle-slider" />
                                    </button>
                                </div>

                                <div className='col-6'>
                                    <div className='mb-2'>Email</div>
                                    <button
                                        onClick={toggleEmail}
                                        className={`toggle-switch ${notification.email ? 'toggle-active' : ''}`}
                                    >
                                        <div className="toggle-slider" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button
                                id="save-btn"
                                onClick={() => {

                                    handleSave();
                                }}
                                className="save-btn"
                            >
                                <Save size={20} />
                                Save Notification
                            </button>
                            <button onClick={handleDiscard} className="discard-btn">
                                <X size={20} />
                                Discard Changes
                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    {showPreview && (
                        <div className="preview-panel">
                            <h2 className="panel-title">
                                <Eye size={24} />
                                Notification Preview
                            </h2>

                            <div className="notification-text">
                                <p className="fs-14 text-gray-500 mt-2">
                                    Delivery:{" "}
                                    {notification.in_app && notification.email
                                        ? "In-App & Email"
                                        : notification.in_app
                                            ? "In-App"
                                            : notification.email
                                                ? "Email"
                                                : "None"}
                                </p>
                            </div>
                            <div className="preview-content">
                                <div className={`notification-preview ${notification.type} ${notification.isActive ? 'active' : 'inactive'}`}>
                                    <div className="notification-content">
                                        <div className="">
                                            <div className="notification-icon" style={{ background: currentTypeData.color }}>
                                                <Bell size={20} />
                                            </div>
                                            <div className="notification-text">
                                                <div className="notification-title-row justify-content-between">
                                                    <div className="notification-title-row">
                                                        <h3 className="notification-title">{notification.header ? notification.header : 'Notification Header'}</h3>
                                                        <span
                                                            className="priority-badge"
                                                            style={{ color: priorities.find(p => p.value === notification.priority)?.color }}
                                                        >
                                                            {priorities.find(p => p.value === notification.priority)?.label ? priorities.find(p => p.value === notification.priority)?.label : 'No Priority'}
                                                        </span>
                                                    </div>
                                                    <div className="">
                                                        <div className={`status-badge ${notification.isActive ? 'status-active' : 'status-inactive'}`}>
                                                            <div className="status-dot" />
                                                            {notification.isActive ? 'Active' : 'Inactive'}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                        <div
                                            className="notification-message p-2"
                                            style={{
                                                fontSize: '14px',
                                                color: notification.textStyle.color,
                                                backgroundColor: notification.textStyle.backgroundColor,
                                                padding: notification.textStyle.backgroundColor !== '#ffffff' ? '8px 12px' : '0',
                                                borderRadius: '5px'
                                            }}
                                        >
                                            {notification.content ? notification.content : 'Notification content goes here...'}
                                        </div>
                                    </div>
                                    <div className="notification-border" style={{ background: currentTypeData.color }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreateNotificationTemplate;
