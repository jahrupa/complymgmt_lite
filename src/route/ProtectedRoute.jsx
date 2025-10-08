// import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoute = ({ isAuthenticated }) => {
//   return isAuthenticated ? <Outlet /> : <Navigate to="/" />;

// };

// export default ProtectedRoute;

import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated ,isChangePassword}) => {
  const isTempPassword = isChangePassword === true;
  const location = useLocation();

  // Case 1: Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Case 2: User has temp password → force to password_setting
  if (isTempPassword && location.pathname !== "/password_setting") {
    return <Navigate to="/password_setting" replace />;
  }

  // Case 3: Normal authenticated flow
  return <Outlet />;
};

export default ProtectedRoute;

