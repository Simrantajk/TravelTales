import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);

  // If user is not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If allowedRoles is provided and userRole is not in it, redirect to unauthorized page
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;