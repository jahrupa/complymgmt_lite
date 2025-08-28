import React, { useState } from 'react'
import '../style/dashboard.css'
import Modal from '../component/Modal'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import StatsCards from '../component/StatsCards';
import Donut from '../component/charts/Donut';
import StackedBar from '../component/charts/StackedBar';
import NotificationPage from '../component/notification/NotificationPage';
import ComplianceMasterDashboard from './ComplianceMasterDashboard';
import ComplianceCockpit from '../component/ComplianceCockpitDashboard/ComplianceCockpit';

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
          <div className='col-6'>
            <button type="button" className="btn btn-secondary w-100" onClick={closeModal}>Cancle</button>
          </div>
          <div className='col-6'>
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
      <div className='mb-4 d-flex'>
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
      <div>
        <ComplianceMasterDashboard/>
      </div>
       <div>
        <ComplianceCockpit/>
      </div>
    </div>
  )
}

export default DashboardPage