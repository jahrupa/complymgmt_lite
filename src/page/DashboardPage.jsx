import React, { useState } from 'react'
import '../style/dashboard.css'
import Modal from '../component/Modal'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import StatsCards from '../component/StatsCards';
import Donut from '../component/charts/Donut';
import StackedBar from '../component/charts/StackedBar';
import NotificationPage from '../component/notification/NotificationPage';

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  //  const [showNotifications, setShowNotifications] = useState(false);
  //    if (showNotifications) {
  //   return <NotificationPage onBack={() => setShowNotifications(false)} />;
  // }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [fileName, setFileName] = useState(''); // State to store the file name

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      setFileName(file.name); // Set the file name in the state
    } else {
      setFileName('No file selected');
    }
  };
  const crudForm = () => {
    return (
      <div>
        <div className=" mb-3 ps-3 pe-3 pb-3 mt-4">
          <div className="button-wrap">
            <label className="upload_button" htmlFor="upload"><span className='me-2 upload_file_icon'><CloudUploadIcon /></span>Upload File</label>
            <input
              className="upload_file_input"
              id="upload"
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange} // Handle file change event
            />
          </div>
          {fileName ? <div className='mt-4 uploaded_file_name'><span ><FilePresentIcon /></span><span>{fileName}</span> </div> : <div className='mt-4  not_uploaded_file_text'><span><FilePresentIcon /></span>File is not uploaded </div>}


        </div>
        <div className="row row-gap-2">
          <div className='col col-12 col-md-6'>
            <button type="button" className="btn btn-secondary w-100" onClick={closeModal}>Cancle</button>
          </div>
          <div className='col col-12 col-md-6'>
            <button type="submit" className="btn btn-primary w-100" >Upload</button>
          </div>
        </div>
      </div>

    )

  }
  const crudTitle = "Upload File"
  return (
    <div>
      <Modal crudForm={crudForm} crudTitle={crudTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} closeModal={closeModal} />
      {/* <div className=' d-flex justify-content-end'>
        <button className='w-auto upload_btn' onClick={openModal}>Upload File</button>
      </div> */}
      <div className='mb-4 d-flex'>
        {/* <span className='v-line me-1 mt-1'></span>
        <span className='v-line me-1 mt-1'></span>
        <span className='v-line me-1 mt-1'></span> */}
        <span className='dashboard-heading ms-2'>Dashboard</span>
      </div>
      <div>
        <StatsCards />
      </div>
      <div className=' stats-grid'>
        <div className='stat-card '>
          <Donut />
        </div>
        <div className='stat-card '>
          <StackedBar />
        </div>
      </div>
      {/* <div className='row'>
        <div className='col-4 col-md-4'>
          <div className='white-card mb-3'>
            <div className='p-3'>
              <div className='dashboard-card-header-text'>Billing & Margin</div>
              <div className='dashboard-card-sub-header-text'>Total Billed</div>
              <div className='dashboard-card-header-text'><span>₹</span>&nbsp;<span>2,950,000</span></div>
              <div className='dashboard-card-sub-header-text'>Margin</div>
              <div className='dashboard-card-header-text'>630,000</div>

            </div>

          </div>
          <div className='white-card mb-3'>
            <div className='p-3'>

              <div className='dashboard-card-header-text'>Outstanding Ageing Summary</div>
              <div className='dashboard-card-sub-header-text d-lg-flex d-md-flex justify-content-between'><span className='progress-text1'>Good</span>
                <span className="progress w-50 mt-1">
                  <div className="progress-bar" role="progressbar" style={{ width: '25%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </span><span className='progress-text'>22,000</span>
              </div>

              <div className='dashboard-card-header-text'><span>₹</span>&nbsp;<span>2,950,000</span></div>
              <div className='dashboard-card-sub-header-text'>Margin</div>
              <div className='dashboard-card-header-text'>630,000</div>
            </div>

          </div>
          <div className='white-card mb-3'>
          </div>
        </div>

        <div className='col-4 col-md-4'>
          <div className='white-card mb-3'>
          </div>
          <div className='white-card mb-3'>
          </div>
          <div className='white-card mb-3'>
          </div>
        </div>

        <div className='col-4 col-md-4'>
          <div className='white-card mb-3'>
          </div>
          <div className='white-card mb-3'>
          </div>
          <div className='white-card mb-3'>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default DashboardPage