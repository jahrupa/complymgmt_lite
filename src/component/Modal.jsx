// Modal Component
const Modal = ({ crudForm, crudTitle, isModalOpen, setIsModalOpen }) => {
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {isModalOpen && (
        <div className="modal fade show modal-lg" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="d-flex justify-content-between modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">{crudTitle}</h5>
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

export default Modal;
