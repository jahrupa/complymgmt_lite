import { useRef } from "react";

// Modal Component
const SmallSizeModal = ({ crudForm, crudTitle, isModalOpen, editCrudTitle, isEditing, closeModal }) => {
  const modalRef = useRef();

  const handleBackdropClick = (e) => {
    // Only close modal if click is on backdrop (outside modal-content)
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };
  return (
    <div>
      {isModalOpen && (
        <div className="modal fade show"
          id="exampleModalCenter"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true" style={{
            display: 'block',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: '1050 !important', // Ensure it appears above other content
          }}
          onMouseDown={handleBackdropClick} >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content"
              ref={modalRef}
              onMouseDown={(e) => e.stopPropagation()} // Prevents closing when clicking inside moda
            >
              <div className="d-flex justify-content-between modal-header pt-1 pb-0">
                <div className="modal-title" id="exampleModalLongTitle">{isEditing ? editCrudTitle : crudTitle}</div>
                <button type="button" className="close btn w-auto" onClick={closeModal} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {crudForm()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmallSizeModal;
