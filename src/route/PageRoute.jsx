import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageLayout from '../layout/pageLayout';
import DashboardPage from '../page/DashboardPage';
import UserRolesPage from '../page/UserRolesPage';
import Login from '../page/Login';
import Company from '../page/Company';
import GroupCompaniesPage from '../page/GroupCompaniesPage';
import UserManagementPage from '../page/UserManagementPage';
import NotFoundPage from '../page/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import Location from '../page/Location';
import Module from '../page/Module';
import SubModule from '../page/SubModule';
import AddUser from '../page/AddUser';
import AccessControl from '../page/AccessControl';
import Onbarding from '../page/Onbarding';
import OnbardingComplianceScope from '../component/OnbardingComplianceScope.jsx';
import OnbardingPayrollCompliance from '../component/OnbardingPayrollCompliance.jsx';
import ServiceTrackers from '../component/ServiceTrackers.jsx';
import RoleManager from '../component/RoleManager.jsx';
import OutsourcingScope from '../component/OutsourcingScope.jsx';
import Reimbursements from '../component/Reimbursements.jsx';
import PayrollManagement from '../component/PayrollManagement.jsx';
import DocumentUpload from '../page/DocumentUpload.jsx';
import DocumentRepository from '../page/DocumentRepository.jsx';
import ApprovedDocument from '../page/ApprovedDocument.jsx';
import TaggedDocument from '../page/TaggedDocument.jsx';
import UntaggedDocument from '../page/UntaggedDocument.jsx';
import PendingDocument from '../page/PendingDocument.jsx';
import Snackbars from '../component/Snackbars.jsx';
import UserProfilePage from '../page/UserProfilePage.jsx';
import ProfileForm from '../page/ProfileForm.jsx';
import ModuleTracker from '../page/ModuleTracker.jsx';
import LocationToModule from '../page/LocationToModule.jsx';
import NotificationPage from '../component/notification/NotificationPage.jsx';

const PageRoute = ({ sidebarOpen, setSidebarOpen }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
    severityType: '',
  });
  let tokenId = localStorage.getItem('token');
  // console.log(tokenId, 'tokenId',sessionStorage.getItem('browserSessionActive'),'..........')
  useEffect(() => {
  if (tokenId) {
    setIsAuthenticated(true)
  }
  }, [tokenId])
// useEffect(() => {
//   const tabId = Date.now().toString();
//   const activeTabsKey = 'activeTabs';
// console.log(activeTabsKey,'activeTabsKey')
//   let tabs = JSON.parse(localStorage.getItem(activeTabsKey)) || [];
//   tabs.push(tabId);
//   localStorage.setItem(activeTabsKey, JSON.stringify(tabs));

//   // Set session active
//   sessionStorage.setItem('browserSessionActive', 'true');

//   // ✅ Check token & session to set auth
//   const token = localStorage.getItem('token');
//   const sessionActive = sessionStorage.getItem('browserSessionActive');

//   if (token && sessionActive === 'true') {
//     setIsAuthenticated(true);
//   }

//   const cleanup = () => {
//     let tabs = JSON.parse(localStorage.getItem(activeTabsKey)) || [];
//     tabs = tabs.filter(id => id !== tabId);
//     localStorage.setItem(activeTabsKey, JSON.stringify(tabs));

//     const isSessionStillActive = sessionStorage.getItem('browserSessionActive');

//     if (tabs.length === 0 && !isSessionStillActive) {
//       localStorage.removeItem('token');
//     }
//   };

//   window.addEventListener('beforeunload', cleanup);

//   return () => {
//     window.removeEventListener('beforeunload', cleanup);
//     cleanup();
//   };
// }, []);


// 2nd ---------------------------------------------------------------
// useEffect(() => {
//   const tabId = Date.now().toString();
//   const activeTabsKey = 'activeTabs';

//   // Add this tab to activeTabs
//   let tabs = JSON.parse(localStorage.getItem(activeTabsKey)) || [];
//   tabs.push(tabId);
//   localStorage.setItem(activeTabsKey, JSON.stringify(tabs));

//   sessionStorage.setItem('browserSessionActive', 'true');

//   const token = localStorage.getItem('token');
//   const sessionActive = sessionStorage.getItem('browserSessionActive');

//   if (token && sessionActive === 'true') {
//     setIsAuthenticated(true);
//   }

//   const cleanup = () => {
//     let tabs = JSON.parse(localStorage.getItem(activeTabsKey)) || [];
//     tabs = tabs.filter(id => id !== tabId);
//     localStorage.setItem(activeTabsKey, JSON.stringify(tabs));
//   };

//   // 👇 Handle cleanup on unload
//   window.addEventListener('beforeunload', cleanup);

//   // 👇 Listen for changes in localStorage
//   const onStorage = (event) => {
//     if (event.key === activeTabsKey) {
//       const tabs = JSON.parse(localStorage.getItem(activeTabsKey)) || [];
//       const sessionActive = sessionStorage.getItem('browserSessionActive');

//       // Token clear only if NO tabs left and this tab also has no session
//       if (tabs.length === 0 && !sessionActive) {
//         localStorage.removeItem('token');
//       }
//     }
//   };

//   window.addEventListener('storage', onStorage);

//   return () => {
//     window.removeEventListener('beforeunload', cleanup);
//     window.removeEventListener('storage', onStorage);
//     cleanup();
//   };
// }, []);




  return (
    <>
      <Routes>
        {/* Public Route: Login */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} issnackbarsOpen={issnackbarsOpen}
          setIsSnackbarsOpen={setIsSnackbarsOpen} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<PageLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create_user_role" element={<UserRolesPage />} />
            <Route path="/add_user" element={<AddUser />} />
            <Route path="/company" element={<Company />} />
            <Route path="/group_holding" element={<GroupCompaniesPage />} />
            <Route path="/user_management" element={<UserManagementPage />} />
            <Route path="/location" element={<Location />} />
            <Route path="/module" element={<Module />} />
            <Route path="/sub_module" element={<SubModule />} />
            <Route path="/access_control" element={<AccessControl />} />
            <Route path="/onboarding" element={<Onbarding />} />
            {/* <Route path="/onboarding" element={<Onbarding />} /> */}
            <Route path="/onbarding_compliance_scope" element={<OnbardingComplianceScope />} />
            <Route path="/onbarding_payroll_compliance" element={<OnbardingPayrollCompliance />} />
            <Route path="/outsourcing_scope" element={<OutsourcingScope />} />
            <Route path="/reimbursements" element={<Reimbursements />} />
            <Route path="/payroll_management" element={<PayrollManagement />} />
            <Route path="/service_trackers" element={<ServiceTrackers />} />
            <Route path="/role_manager" element={<RoleManager />} />
            <Route path="/upload_documents" element={<DocumentUpload />} />
            <Route path="/document_repository" element={<DocumentRepository />} />
            <Route path="/approved_documents" element={<ApprovedDocument />} />
            <Route path="/tagged_documents" element={<TaggedDocument />} />
            <Route path="/untagged_documents" element={<UntaggedDocument />} />
            <Route path="/pending_documents" element={<PendingDocument />} />
            <Route path="/module_tracker" element={<ModuleTracker />} />
            {/* <Route path="/user_profile/1" element={<UserProfilePage />} /> */}
            <Route path="/user_profile/1" element={<ProfileForm />} />
            <Route path="/module_by_location" element={<LocationToModule />} />
            <Route path="/notification" element={<NotificationPage />} />
          </Route>
        </Route>

        {/* Catch-all: 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
    </>

  );
};


export default PageRoute;
