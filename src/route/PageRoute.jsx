import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import DashboardPage from '../page/DashboardPage';
import UserRolesPage from '../page/UserRolesPage';
import Login from '../page/Login';
import Company from '../page/Company';
import GroupCompaniesPage from '../page/GroupCompaniesPage';
import NotFoundPage from '../page/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import Location from '../page/Location';
import Module from '../page/Module';
import SubModule from '../page/SubModule';
import AddUser from '../page/AddUser';
import AccessControl from '../page/AccessControl';
import ServiceTrackers from '../component/ServiceTrackers.jsx';
import DocumentUpload from '../page/DocumentUpload.jsx';
import TaggedDocument from '../page/TaggedDocument.jsx';
import UntaggedDocument from '../page/UntaggedDocument.jsx';
import PendingDocument from '../page/PendingDocument.jsx';
import Snackbars from '../component/Snackbars.jsx';
import ProfileForm from '../page/ProfileForm.jsx';
import LocationToModule from '../page/LocationToModule.jsx';
import CreateNotificationTemplate from '../page/CreateNotificationTemplate.jsx';
import ServiceTrackerInnerPage from '../page/ServiceTrackerInnerPage.jsx';
import ServiceTrackerAccess from '../page/ServiceTrackerAccess.jsx';
import NotificationList from '../page/NotificationList.jsx';
import CreateNotification from '../page/CreateNotification.jsx';
import ChangePassword from '../page/ChangePassword.jsx';
import ForgetPassword from '../page/ForgetPassword.jsx';
import ChangeForgetPassword from '../page/ChangeForgetPassword.jsx';
import ResetForgetPasswordSuccessful from '../page/ResetForgetPasswordSuccessful.jsx';
import NotificationMainPage from '../component/notification/NotificationMainPage.jsx';
import WidgetAccess from '../page/widgetAccess/WidgetAccess.jsx';
import ClientOnboarding from '../page/clientOnboarding/ClientOnboarding.jsx';
import DocumentBulkTagging from '../page/documentBulkTagging/DocumentBulkTagging.jsx';
import DashboardInternalPage from '../dashboards/dashboardInternalPage/DashboardInternalPage.jsx';
import RegisterProcessing from '../page/registerProcessing/RegisterProcessing.jsx';
// import RegisterProcessingV2 from '../page/RegisterProcessing.jsx';
import RegisterProcessingViewPage from '../page/RegisterProcessingViewPage.jsx';
import CreateRegister from '../page/CreateRegister.jsx';
import RegisterApplicability from '../page/RegisterApplicability.jsx';
import RegisterMapping from '../page/RegisterMapping.jsx';
import RegisterProcess from '../page/RegisterProcess.jsx';
import Entity from '../page/Entity.jsx';
import RequirePageAccess from '../component/RequirePageAccess.jsx';



const PageRoute = ({ sidebarOpen, setSidebarOpen }) => {
  // Start from the stored token so a full page load of a protected URL keeps its path and query
  // string instead of bouncing through "/" to active_url
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('authToken')))
  const [isChangePassword, setIsChangePassword] = useState(false)
  const [unreadCountNotification, setUnreadCountNotification] = useState(0);
  const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
    severityType: '',
  });
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('activeItem') || 'Dashboard';
  });
  let tokenId = localStorage.getItem('authToken');
  useEffect(() => {
    if (tokenId) {
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem('activeItem')
      localStorage.removeItem('active_url')
      localStorage.removeItem('username')
      localStorage.removeItem('user_id')
      setIsAuthenticated(false)
      setActivePage('Dashboard')
    }
  }, [tokenId])

  const pageActiveRoute = localStorage.getItem('active_url')
  return (
    <>
      <Routes>
        {/* Public Route: Login */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? (
                isChangePassword === true
                  ? <Navigate to="/password_setting" replace />
                  : <Navigate to={`${pageActiveRoute || "/dashboard"}`} replace />
              )
              : (
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  issnackbarsOpen={issnackbarsOpen}
                  setIsSnackbarsOpen={setIsSnackbarsOpen}
                  setIsChangePassword={setIsChangePassword}
                />
              )
          }
        />


        {/* Protected Routes */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} isChangePassword={isChangePassword} />}>
          <Route element={<PageLayout
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            unreadCountNotification={unreadCountNotification}
            setUnreadCountNotification={setUnreadCountNotification}
            setActivePage={setActivePage}
            activePage={activePage}
          />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/widget_access" element={<WidgetAccess />} />
            <Route path="/client_onboarding" element={<ClientOnboarding />} />
            <Route path="/document_bulk_tagging" element={<DocumentBulkTagging />} />
            {/* The old Widget Mappings page is now part of Widget Access */}
            <Route path="/widget_mappings" element={<Navigate to="/widget_access" replace />} />
            <Route path="/create_user_role" element={<RequirePageAccess page="user"><UserRolesPage /></RequirePageAccess>} />
            <Route path="/add_user" element={<RequirePageAccess page="user"><AddUser /></RequirePageAccess>} />
            <Route path="/company" element={<RequirePageAccess page="company"><Company /></RequirePageAccess>} />
            <Route path="/entity" element={<RequirePageAccess page="entity"><Entity /></RequirePageAccess>} />
            <Route path="/group_holding" element={<RequirePageAccess page="group"><GroupCompaniesPage /></RequirePageAccess>} />
            <Route path="/location" element={<RequirePageAccess page="company_location"><Location /></RequirePageAccess>} />
            <Route path="/module" element={<RequirePageAccess page="module"><Module /></RequirePageAccess>} />
            <Route path="/sub_module" element={<RequirePageAccess page="submodule"><SubModule /></RequirePageAccess>} />
            <Route path="/access_control" element={<RequirePageAccess page="user_access"><AccessControl /></RequirePageAccess>} />
            <Route path="/service_trackers" element={<RequirePageAccess page="service_tracker"><ServiceTrackers /></RequirePageAccess>} />
            <Route path="/upload_documents" element={<RequirePageAccess page="document_repository"><DocumentUpload /></RequirePageAccess>} />
            <Route path="/tagged_documents" element={<RequirePageAccess page="document_repository"><TaggedDocument /></RequirePageAccess>} />
            <Route path="/untagged_documents" element={<RequirePageAccess page="document_repository"><UntaggedDocument /></RequirePageAccess>} />
            <Route path="/pending_documents" element={<RequirePageAccess page="document_repository"><PendingDocument /></RequirePageAccess>} />
            {/* <Route path="/user_profile/1" element={<UserProfilePage />} /> */}
            <Route path="/user_profile/1" element={<ProfileForm />} />
            <Route path="/location_to_module" element={<RequirePageAccess page="location_to_module"><LocationToModule /></RequirePageAccess>} />
            <Route path="/register_processing" element={<RegisterProcessing />} />
            {/* <Route path="/register_processing_v2" element={<RegisterProcessingV2 />} /> */}

            {/* notification sub-routes */}
            <Route path="/notification" element={
              <NotificationMainPage setUnreadCountNotification={setUnreadCountNotification} />
            }>
              <Route path="create_notification_template" element={<CreateNotificationTemplate />} />
              <Route path="template_list" element={<NotificationList />} />
              <Route path="create_notification" element={<CreateNotification />} />
            </Route>
            {/* notification sub-routes end*/}

            {/* register processing routes */}
            <Route path="/register" element={
              <RegisterProcessingViewPage />
            } />
            <Route path="create_register" element={<CreateRegister />} />
            <Route path="create_applicability" element={<RegisterApplicability />} />
            <Route path="create_mapping" element={<RegisterMapping />} />
            <Route path="process_register" element={<RegisterProcess />} />
            {/* register processing routes end */}

            <Route path="/service/:trackerName/:id" element={<RequirePageAccess page="service_tracker"><ServiceTrackerInnerPage /></RequirePageAccess>} />
            <Route path="/service_tracker_access" element={<ServiceTrackerAccess />} />
            <Route path="/password_setting" element={<ChangePassword setIsChangePassword={setIsChangePassword} />} />
            {/* Dashboard Internal Routes */}
            <Route path='/:dashboard_name/dashboard/:info' element={<DashboardInternalPage />} />
          </Route>

        </Route>

        {/* Catch-all: 404 */}
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/reset_password" element={<ChangeForgetPassword setIsChangePassword={setIsChangePassword} />} />
        <Route path="/forget_password" element={<ForgetPassword />} />
        <Route path="/reset_password_successful" element={<ResetForgetPasswordSuccessful />} />
      </Routes>
      <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
    </>

  );
};


export default PageRoute;
