import React, { useState } from 'react';
import { 
  Bell, 
  Save, 
  X, 
  Bold, 
  Italic, 
  Type, 
  Palette,
  Eye,
  Settings,
  ChevronDown
} from 'lucide-react';
import '../style/createNotification.css';

function CreateNotification() {
  const [notification, setNotification] = useState({
    type: 'info',
    priority: 'medium',
    header: 'Sample Notification',
    content: 'Your notification content goes here...',
    isActive: true,
    textStyle: {
      bold: false,
      italic: false,
      fontSize: '16',
      color: '#374151',
      backgroundColor: '#ffffff'
    }
  });

  const [showPreview, setShowPreview] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const notificationTypes = [
    { value: 'info', label: 'Information', color: 'linear-gradient(135deg, #3b82f6, #2563eb)', icon: '💡' },
    { value: 'success', label: 'Success', color: 'linear-gradient(135deg, #10b981, #059669)', icon: '✅' },
    { value: 'warning', label: 'Warning', color: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: '⚠️' },
    { value: 'error', label: 'Error', color: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '❌' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', color: '#6b7280' },
    { value: 'medium', label: 'Medium Priority', color: '#2563eb' },
    { value: 'high', label: 'High Priority', color: '#ea580c' },
    { value: 'urgent', label: 'Urgent', color: '#dc2626' }
  ];

  const fontSizes = [
    { value: '12', label: 'Small' },
    { value: '16', label: 'Medium' },
    { value: '20', label: 'Large' },
    { value: '24', label: 'Extra Large' }
  ];

  const colors = [
    '#374151', '#1f2937', '#dc2626', '#ea580c', 
    '#d97706', '#65a30d', '#059669', '#0891b2',
    '#0284c7', '#2563eb', '#7c3aed', '#c026d3'
  ];

  const backgroundColors = [
    '#ffffff', '#f9fafb', '#fef2f2', '#fff7ed',
    '#fffbeb', '#f7fee7', '#ecfdf5', '#f0fdfa',
    '#f0f9ff', '#eff6ff', '#f5f3ff', '#fdf4ff'
  ];

  const updateTextStyle = (key, value) => {
    setNotification(prev => ({
      ...prev,
      textStyle: {
        ...prev.textStyle,
        [key]: value
      }
    }));
  };

  const getNotificationTypeData = (type) => {
    return notificationTypes.find(t => t.value === type) || notificationTypes[0];
  };

  const handleSave = () => {
    const saveBtn = document.getElementById('save-btn');
    saveBtn?.classList.add('pulse-animation');
    setTimeout(() => {
      saveBtn?.classList.remove('pulse-animation');
    }, 1000);
    
    console.log('Notification saved:', notification);
  };

  const handleDiscard = () => {
    setNotification({
      type: 'info',
      priority: 'medium',
      header: 'Sample Notification',
      content: 'Your notification content goes here...',
      isActive: true,
      textStyle: {
        bold: false,
        italic: false,
        fontSize: '16',
        color: '#374151',
        backgroundColor: '#ffffff'
      }
    });
    setIsEditing(false);
  };

  const currentTypeData = getNotificationTypeData(notification.type);

    // === ✨ Format content with specific word styling ===
//   const formatNotificationContent = (text) => {
//     const boldPhrase = "Your notification content";
//     const redWord = "notification";
//     const parts = [];
//     let i = 0;
//     let key = 0;

//     while (i < text.length) {
//       if (text.slice(i, i + boldPhrase.length) === boldPhrase) {
//         parts.push(<strong key={key++}>{boldPhrase}</strong>);
//         i += boldPhrase.length;
//       } else if (text.slice(i, i + redWord.length) === redWord) {
//         parts.push(<span key={key++} style={{ color: 'red' }}>{redWord}</span>);
//         i += redWord.length;
//       } else {
//         parts.push(<span key={key++}>{text[i]}</span>);
//         i++;
//       }
//     }
//     return parts;
//   };

  return (
    <div className="">
      <div className="max-width-container">
        {/* Header */}
        <div className="header-section">
          <div className="header-icon-title">
            <div className="header-icon">
              <Bell size={32} />
            </div>
            <h1 className="main-title">
              Create Notification
            </h1>
          </div>
        </div>

        <div className="main-grid">
          {/* Form Panel */}
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
                <label className="form-label">Notification Type</label>
                <div className="select-wrapper">
                  <select
                    value={notification.type}
                    onChange={(e) => setNotification(prev => ({ ...prev, type: e.target.value }))}
                    className="form-select"
                  >
                    {notificationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="select-icon" size={20} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Priority Level</label>
                <div className="select-wrapper">
                  <select
                    value={notification.priority}
                    onChange={(e) => setNotification(prev => ({ ...prev, priority: e.target.value }))}
                    className="form-select"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="select-icon" size={20} />
                </div>
              </div>
            </div>

            {/* Header Input */}
            <div className="form-group">
              <label className="form-label">Notification Header</label>
              <input
                type="text"
                value={notification.header}
                onChange={(e) => setNotification(prev => ({ ...prev, header: e.target.value }))}
                className="form-input"
                placeholder="Enter notification header..."
              />
            </div>

            {/* Text Formatting Controls */}
            <div className="form-group">
              <label className="form-label">Text Formatting</label>
              
              {/* Style Controls */}
              <div className="formatting-controls">
                <button
                  onClick={() => updateTextStyle('bold', !notification.textStyle.bold)}
                  className={`format-btn ${notification.textStyle.bold ? 'format-btn-active' : ''}`}
                >
                  <Bold size={16} />
                  Bold
                </button>
                
                <button
                  onClick={() => updateTextStyle('italic', !notification.textStyle.italic)}
                  className={`format-btn ${notification.textStyle.italic ? 'format-btn-active' : ''}`}
                >
                  <Italic size={16} />
                  Italic
                </button>

                <div className="font-size-control">
                  <Type size={16} />
                  <select
                    value={notification.textStyle.fontSize}
                    onChange={(e) => updateTextStyle('fontSize', e.target.value)}
                    className="font-size-select"
                  >
                    {fontSizes.map(size => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color Pickers */}
              <div className="color-picker-grid">
                <div className="color-picker-section">
                  <label className="color-label">Text Color</label>
                  <div className="color-palette">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => updateTextStyle('color', color)}
                        className={`color-btn ${notification.textStyle.color === color ? 'color-btn-selected' : ''}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="color-picker-section">
                  <label className="color-label">Background Color</label>
                  <div className="color-palette">
                    {backgroundColors.map(color => (
                      <button
                        key={color}
                        onClick={() => updateTextStyle('backgroundColor', color)}
                        className={`color-btn ${notification.textStyle.backgroundColor === color ? 'color-btn-selected' : ''}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Textarea */}
            <div className="form-group">
              <label className="form-label">Notification Content</label>
              <textarea
                value={notification.content}
                onChange={(e) => setNotification(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="form-textarea"
                placeholder="Write your notification message here..."
              />
            </div>

            {/* Active/Inactive Toggle */}
            <div className="toggle-section">
              <div className="toggle-info">
                <h3 className="toggle-title">Notification Status</h3>
                <p className="toggle-description">Enable or disable this notification</p>
              </div>
              <button
                onClick={() => setNotification(prev => ({ ...prev, isActive: !prev.isActive }))}
                className={`toggle-switch ${notification.isActive ? 'toggle-active' : ''}`}
              >
                <div className="toggle-slider" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                id="save-btn"
                onClick={handleSave}
                className="save-btn"
              >
                <Save size={20} />
                Save Notification
              </button>
              
              <button
                onClick={handleDiscard}
                className="discard-btn"
              >
                <X size={20} />
                Discard Changes
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="preview-panel">
              <h2 className="panel-title">
                <Eye size={24} />
                Live Preview
              </h2>
              
              <div className="preview-content">
                {/* Preview Notification */}
                <div className={`notification-preview ${notification.type} ${notification.isActive ? 'active' : 'inactive'}`}>
                  <div className="notification-content">
                    <div className="notification-header">
                      <div className="notification-icon" style={{ background: currentTypeData.color }}>
                        <Bell size={20} />
                      </div>
                      <div className="notification-text">
                        <div className="notification-title-row">
                          <h3 className="notification-title">{notification.header}</h3>
                          <span 
                            className="priority-badge"
                            style={{ color: priorities.find(p => p.value === notification.priority)?.color }}
                          >
                            {priorities.find(p => p.value === notification.priority)?.label}
                          </span>
                        </div>
                        <div
                          className="notification-message"
                          style={{
                            fontWeight: notification.textStyle.bold ? 'bold' : 'normal',
                            fontStyle: notification.textStyle.italic ? 'italic' : 'normal',
                            fontSize: `${notification.textStyle.fontSize}px`,
                            color: notification.textStyle.color,
                            backgroundColor: notification.textStyle.backgroundColor,
                            padding: notification.textStyle.backgroundColor !== '#ffffff' ? '8px 12px' : '0',
                            borderRadius: notification.textStyle.backgroundColor !== '#ffffff' ? '6px' : '0'
                          }}
                        >
                          {notification.content}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated border effect */}
                  <div 
                    className="notification-border" 
                    style={{ background: currentTypeData.color }}
                  />
                </div>

                {/* Status Indicator */}
                <div className="status-indicator">
                  <span className="status-label">Status:</span>
                  <div className={`status-badge ${notification.isActive ? 'status-active' : 'status-inactive'}`}>
                    <div className="status-dot" />
                    {notification.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateNotification;