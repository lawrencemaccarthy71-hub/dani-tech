import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from './auth';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * AdminProtectedRoute wraps any admin page.
 * If the admin session is not present in sessionStorage, the user
 * is immediately redirected to /admin/login.
 */
export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};
