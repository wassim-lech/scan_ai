import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component for routes that require authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return children ? children : <Outlet />;
};

// Component for routes that require specific roles
export const RoleProtectedRoute = ({ roles, children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // Redirect to profile if authenticated but not authorized for this role
  if (!roles.includes(user.role)) {
    return <Navigate to="/profile" />;
  }

  return children ? children : <Outlet />;
};