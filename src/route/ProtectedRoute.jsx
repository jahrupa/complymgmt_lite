import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to="/" />;
  }

  // If authenticated, render the child route (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
