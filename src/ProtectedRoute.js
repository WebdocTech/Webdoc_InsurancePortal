import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Retrieve user data from sessionStorage and handle empty or corrupted data
  const user = JSON.parse(sessionStorage.getItem('user')) || null;

  // If no user data is found or the user is not logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;  // Adjust the path to your actual login page
  }

  // If the user is logged in, allow access to the protected route
  return children;
}

export default ProtectedRoute;
