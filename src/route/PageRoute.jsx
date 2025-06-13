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
import Onbarding from '../page/Onbarding';
import OnbardingComplianceScope from '../component/OnbardingComplianceScope.jsx';
import OnbardingPayrollCompliance from '../component/OnbardingPayrollCompliance.jsx';
import ServiceTrackers from '../component/ServiceTrackers.jsx';
import RoleManager from '../component/RoleManager.jsx';
import OutsourcingScope from '../component/OutsourcingScope.jsx';
import Reimbursements from '../component/Reimbursements.jsx';
import PayrollManagement from '../component/PayrollManagement.jsx';
import DocumentUpload from '../page/DocumentUpload.jsx';

const PageRoute = ({ sidebarOpen, setSidebarOpen }) => {
  const[isAuthenticated,setIsAuthenticated]=useState(true)
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
          <Route path="/onboarding" element={<Onbarding />} />
          {/* <Route path="/onboarding" element={<Onbarding />} /> */}
          <Route path="/onbardingcompliancescope" element={<OnbardingComplianceScope />} />
          <Route path="/onbardingpayrollcompliance" element={<OnbardingPayrollCompliance />} />
          <Route path="/outsourcingScope" element={<OutsourcingScope />} />
          <Route path="/reimbursements" element={<Reimbursements />} />
          <Route path="/payrollmanagement" element={<PayrollManagement />} />
          <Route path="/servicetrackers" element={<ServiceTrackers />} />
          <Route path="/rolemanager" element={<RoleManager />} />
          <Route path="/uploadDocument" element={<DocumentUpload />} />


          


          


        </Route>
      </Route>

      {/* Catch-all: 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};


export default PageRoute;
