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
import DocumentRepository from '../page/DocumentRepository.jsx';
import ApprovedDocument from '../page/ApprovedDocument.jsx';
import TaggedDocument from '../page/TaggedDocument.jsx';
import UntaggedDocument from '../page/UntaggedDocument.jsx';
import PendingDocument from '../page/PendingDocument.jsx';

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



        </Route>
      </Route>

      {/* Catch-all: 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};


export default PageRoute;
