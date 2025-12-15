import { useEffect } from 'react';
import '../../style/widgetMappingForm.css';

function WidgetMappingForm({ mapping, onSave, onCancel ,formData,setFormData}) {

  useEffect(() => {
    if (mapping) {
      setFormData({
        widget_mapping_id: mapping.widget_mapping_id,
        user_id: mapping.user_id,
        widgets: [...mapping.widgets]
      });
    }
  }, [mapping]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const removeWidget = (index) => {
    setFormData(prev => ({
      ...prev,
      widgets: prev.widgets.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="dashboard-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Widget Mapping</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>

        <div className="mapping-form">
          <div className="form-group">
            <label>Widget Mapping ID</label>
            <input
              type="text"
              name="widget_mapping_id"
              value={formData.widget_mapping_id}
              disabled
            />
          </div>

          <div className="form-group">
            <label>User ID *</label>
            <input
              type="text"
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
              disabled

            />
          </div>

          <div className="widgets-section">
            <h3>Widgets</h3>
            <div className="widgets-list">
              {formData.widgets?.map((widget, index) => (
                <div key={index} className="widget-item">
                  <div className="widget-info">
                    <span className="widget-id">{widget.widget_id}</span>
                    <span className="widget-name">{widget.widget_name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeWidget(index)}
                    className="remove-widget-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" onClick={() => onSave(formData)}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WidgetMappingForm;
