import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

// Protected route component that checks if user is authenticated
// and if the user is a recruiter (if recruiterOnly is true)
const ProtectedRoute = ({ recruiterOnly = false, redirectPath = '/login' }) => {
  const isAuthenticated = authService.isAuthenticated();
  const isRecruiter = authService.isRecruiter();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

  // If route requires recruiter but user is not a recruiter, redirect
  if (recruiterOnly && !isRecruiter) {
    return <Navigate to="/" />;
  }

  // If authenticated and has proper role, render the nested routes
  return <Outlet />;
};

export default ProtectedRoute;