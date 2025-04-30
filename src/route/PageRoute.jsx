import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageLayout from '../layout/pageLayout';
import DashboardPage from '../page/DashboardPage';
import UserRolesPage from '../page/UserRolesPage';
import Login from '../page/Login';
import Company from '../page/Company';
import  GroupCompaniesPage from '../page/GroupCompaniesPage';
import UserManagementPage from '../page/UserManagementPage';
import NotFoundPage from '../page/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import Location from '../page/Location';
import Module from '../page/Module';
import SubModule from '../page/SubModule';
import AddUser from '../page/AddUser';

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
    //     <Route path="grouponboarding" element={<Company />} />
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
          <Route path="createuserrole" element={<UserRolesPage />} />
          <Route path="adduser" element={<AddUser />} />
          <Route path="company" element={<Company />} />
          <Route path="groupofholding" element={<GroupCompaniesPage />} />
          <Route path="usermanagement" element={<UserManagementPage />} />
          <Route path="location" element={<Location />} />
          <Route path="module" element={<Module />} />
          <Route path="submodule" element={<SubModule />} />


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
