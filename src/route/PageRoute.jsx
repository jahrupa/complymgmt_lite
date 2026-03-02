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
import DetailsPage from '../page/DetailsPage.jsx';
import ServiceTrackerInnerPage from '../page/ServiceTrackerInnerPage.jsx';
import ServiceTrackerAccess from '../page/ServiceTrackerAccess.jsx';
import NotificationList from '../page/NotificationList.jsx';
import CreateNotification from '../page/CreateNotification.jsx';
import ChangePassword from '../page/ChangePassword.jsx';
import ForgetPassword from '../page/ForgetPassword.jsx';
import ChangeForgetPassword from '../page/ChangeForgetPassword.jsx';
import ResetForgetPasswordSuccessful from '../page/ResetForgetPasswordSuccessful.jsx';
import NotificationMainPage from '../component/notification/NotificationMainPage.jsx';
import WidgetMappings from '../dashboards/widgets/WidgetMappings.jsx';
import DashboardInternalPage from '../dashboards/dashboardInternalPage/DashboardInternalPage.jsx';
import RegisterProcessing from '../page/registerProcessing/RegisterProcessing.jsx';
import DashboardDrawerGridDetailPage from '../page/dashboardDrawerGridDetailPage/DashboardDrawerGridDetailPage.jsx';

const PageRoute = ({ sidebarOpen, setSidebarOpen }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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
            <Route path="/widget_mappings" element={<WidgetMappings />} />
            <Route path="/create_user_role" element={<UserRolesPage />} />
            <Route path="/add_user" element={<AddUser />} />
            <Route path="/company" element={<Company />} />
            <Route path="/group_holding" element={<GroupCompaniesPage />} />
            <Route path="/location" element={<Location />} />
            <Route path="/module" element={<Module />} />
            <Route path="/sub_module" element={<SubModule />} />
            <Route path="/access_control" element={<AccessControl />} />
            <Route path="/service_trackers" element={<ServiceTrackers />} />
            <Route path="/upload_documents" element={<DocumentUpload />} />
            <Route path="/tagged_documents" element={<TaggedDocument />} />
            <Route path="/untagged_documents" element={<UntaggedDocument />} />
            <Route path="/pending_documents" element={<PendingDocument />} />
            {/* <Route path="/user_profile/1" element={<UserProfilePage />} /> */}
            <Route path="/user_profile/1" element={<ProfileForm />} />
            <Route path="/location_to_module" element={<LocationToModule />} />
            <Route path="/register_processing" element={<RegisterProcessing />} />
            

            {/* notification sub-routes */}
            <Route path="/notification" element={
              <NotificationMainPage setUnreadCountNotification={setUnreadCountNotification} />
            }>
              <Route path="create_notification_template" element={<CreateNotificationTemplate />} />
              <Route path="template_list" element={<NotificationList />} />
              <Route path="create_notification" element={<CreateNotification />} />
            </Route>

            {/* notification sub-routes end*/}
            <Route path="/details/:seriesName/:year" element={<DetailsPage />} />
            <Route path="/service/:trackerName/:id" element={<ServiceTrackerInnerPage />} />
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
