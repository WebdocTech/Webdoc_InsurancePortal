import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles = [] }) {
  // Safely parse user from sessionStorage
  const user = JSON.parse(sessionStorage.getItem('user')) || null;

  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is provided, check if user role is included
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.userRole)) {
    // User is logged in but not authorized, redirect to permission denied page
    return <Navigate to="/PermissionNotAllowed" replace />;
  }

  // User is authorized, render the protected component
  return children;
}

export default ProtectedRoute;
