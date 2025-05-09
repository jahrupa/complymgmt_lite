import React, { useEffect, useState } from 'react';
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
import AccessControl from '../page/AccessControl';

const PageRoute = ({ sidebarOpen, setSidebarOpen }) => {
  const[isAuthenticated,setIsAuthenticated]=useState(false)
   let tokenId = localStorage.getItem('token');
    useEffect(()=>{
      if(tokenId){
          setIsAuthenticated(true)
      }
    },[tokenId])
  return (
    <Routes>
      {/* Public Route: Login */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated}/>} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<PageLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/createuserrole" element={<UserRolesPage />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/company" element={<Company />} />
          <Route path="/groupofholding" element={<GroupCompaniesPage />} />
          <Route path="/usermanagement" element={<UserManagementPage />} />
          <Route path="/location" element={<Location />} />
          <Route path="/module" element={<Module />} />
          <Route path="/submodule" element={<SubModule />} />
          <Route path="/accesscontrol" element={<AccessControl />} />

        </Route>
      </Route>

      {/* Catch-all: 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};


export default PageRoute;
