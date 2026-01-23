import { useState, useEffect } from 'react';
import WidgetMappingForm from './WidgetMappingForm';
import '../../style/widgetMappings.css';
import Snackbars from '../../component/Snackbars';
import { createOrUpdateWidgetMapping, deleteWidgetMappingById, fetchAllWidgetMappings } from '../../api/service';
import { decryptData } from '../../page/utils/encrypt';

function WidgetMappings() {
  const [mappings, setMappings] = useState([]);
  const [filteredMappings, setFilteredMappings] = useState([]);

  const [editingMapping, setEditingMapping] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    widget_mapping_id: '',
    user_id: '',
    widgets: []
  });
  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    severityType: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const userId = decryptData(localStorage.getItem("user_id"));


  // ------------------------
  // LOAD DATA
  // ------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllWidgetMappings(userId);
        setMappings(data);
        setFilteredMappings(data);
      } catch (error) {
        console.error("Error fetching widget mappings:", error);
      }
    };
    fetchData();
  }, []);

  // ------------------------
  // SEARCH LOGIC
  // ------------------------
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMappings(mappings);
      setCurrentPage(1);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = mappings.filter(m => {
      const mapId = m.widget_mapping_id?.toLowerCase() || '';
      const userId = m.user_id?.toLowerCase() || '';

      const widgetMatch = m.widgets.some(w =>
        w.widget_id.toLowerCase().includes(term) ||
        w.widget_name.toLowerCase().includes(term)
      );

      return mapId.includes(term) || userId.includes(term) || widgetMatch;
    });

    setFilteredMappings(filtered);
    setCurrentPage(1);
  }, [searchTerm, mappings]);

  // ------------------------
  // EDIT SAVE
  // ------------------------
  const handleSubmit = async (updatedFormData) => {
    if (!updatedFormData) return;

    const payload = {
      user_id: updatedFormData.user_id,
      widget_ids: (updatedFormData.widgets || []).map(w => w.widget_id)
    };
    // console.log(payload, 'payload')
    try {
      const response = await createOrUpdateWidgetMapping(payload);
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: response?.message || "Mapping updated successfully",
        severityType: 'success'
      });

      // Refresh the mappings after update
      const updatedData = await fetchAllWidgetMappings();
      setMappings(updatedData);
      setFilteredMappings(updatedData);

      setShowModal(false);
      setEditingMapping(null);

    } catch (error) {
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: error?.response?.data?.message || "Error updating mapping",
        severityType: 'error'
      });
    }
  };


  // DELETE

  const deleteMapping = async () => {
    if (!deleteConfirm) return;
    try {
      // Call delete API
      const response = await deleteWidgetMappingById(userId,deleteConfirm);
      const message = response?.message || "Mapping deleted successfully";

      // Refresh list
      const updatedData = await fetchAllWidgetMappings(userId);
      setMappings(updatedData);
      setFilteredMappings(updatedData);

      // Success Snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: message,
        severityType: "success",
      });

    } catch (error) {
      // Error Snackbar
      setIsSnackbarsOpen({
        ...issnackbarsOpen,
        open: true,
        message: error?.response?.data?.message || "Error deleting mapping",
        severityType: "error",
      });
    } finally {
      // Always close delete confirmation modal
      setDeleteConfirm(null);
    }
  };



  // PAGINATION

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredMappings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMappings.length / itemsPerPage);

  return (
    <div className="widget-mappings-container">
      <Snackbars
        issnackbarsOpen={issnackbarsOpen}
        setIsSnackbarsOpen={setIsSnackbarsOpen}
      />

      <div className='service-tracker-inner-page-header d-lg-flex d-md-flex align-items-center'>
        <div className="notification-page-title">
          <h1>Widget Mappings</h1>
        </div>
        <div className='d-lg-flex d-md-flex gap-2 mt-2'>
          <input
            type="text"
            placeholder="Search mapping ID, user ID, widget ID or widget name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dashboard-widget-search-input"
          />
        </div>
      </div>

      <div className="dashboard-widget-search-section">
        <div className='d-lg-flex d-md-flex justify-content-between align-items-center'>
          <div className="results-count">
            Showing {currentItems.length} of {filteredMappings.length}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </button>
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {currentItems?.length !== 0 ? (
        <div className="mappings-list">
          {currentItems?.map((mapping) => (
            <div key={mapping.widget_mapping_id} className="mapping-card">
              <div className="mapping-header">
                <div className="mapping-ids">
                  <h3>{mapping?.widget_mapping_id}</h3>
                  <span className="user-id">User: {mapping?.user_id}</span>
                </div>

                <div className="mapping-actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingMapping(mapping);
                      setFormData({
                        widget_mapping_id: mapping?.widget_mapping_id,
                        user_id: mapping?.user_id,
                        widgets: [...mapping.widgets],
                      });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => setDeleteConfirm(mapping.user_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="widgets-grid">
                <h4>Widgets ({mapping.widgets.length})</h4>
                <div className="widget-tags">
                  {mapping.widgets.map((widget, i) => (
                    <div key={i} className="widget-tag">
                      <span className="tag-id">{widget.dashboard_name}</span>
                      <span className="tag-name">{widget.widget_name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mapping-footer">
                <span className="timestamp">Created: {mapping.created_at}</span>
                <span className="timestamp">Updated: {mapping.updated_at}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No widget mappings available.</p>
        </div>
      )}



      {showModal && (
        <WidgetMappingForm
          mapping={editingMapping}
          onSave={handleSubmit}
          onCancel={() => setShowModal(false)}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="delete-confirm" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this widget mapping?</p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="confirm-delete-btn" onClick={deleteMapping}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WidgetMappings;
