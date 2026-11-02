import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RoleGuard = ({ allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    // If student tries to go to admin/instructor, redirect to their dashboard
    return <Navigate to="/student" replace />;
  }

  return <Outlet />;
};
