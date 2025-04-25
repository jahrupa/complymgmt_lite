import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageLayout from '../layout/pageLayout';
import DashboardPage from '../page/DashboardPage';
import UserRolesPage from '../page/UserRolesPage';
import Login from '../page/Login';
import GroupOnboardingPage from '../page/GroupOnboardingPage';
import { GroupCompaniesPage } from '../page/GroupCompaniesPage';
import UserManagementPage from '../page/UserManagementPage';
import NotFoundPage from '../page/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

const PageRoute = ({ sidebarOpen, setSidebarOpen }) => {
  // const isAuthenticated = Boolean(localStorage.getItem('authToken')); // Example of checking authentication status
  // console.log(isAuthenticated.rememberMe)
  const isAuthenticated = true; // Example of checking authentication status
  return (
    // <Routes>
    //   <Route path="/" element={<Login />} />

    //   <Route
    //     path="/"
    //     element={<PageLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
    //   >
    //     <Route index element={<Navigate to="/dashboard" />} />
    //     <Route path="dashboard" element={<DashboardPage />} />
    //     <Route path="userroles" element={<UserRolesPage />} />
    //     <Route path="grouponboarding" element={<GroupOnboardingPage />} />
    //     <Route path="groupofcompanies" element={<GroupCompaniesPage />} />
    //     <Route path="usermanagement" element={<UserManagementPage />} />
    //   </Route>
    // </Routes>


    <Routes>
      {/* Public Route: Login */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/" element={<PageLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="userroles" element={<UserRolesPage />} />
          <Route path="grouponboarding" element={<GroupOnboardingPage />} />
          <Route path="groupofcompanies" element={<GroupCompaniesPage />} />
          <Route path="usermanagement" element={<UserManagementPage />} />
        </Route>
      </Route>
      {/* Catch-all Route for 404 */}
      <Route path="*" element={<NotFoundPage />} />

      {/* Redirect unauthenticated users to login */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/" />} />
    </Routes>
    
  );
};

export default PageRoute;
