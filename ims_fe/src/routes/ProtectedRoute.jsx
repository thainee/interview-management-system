import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ContentLayout from '../layouts/ContentLayout';
import { isTokenExpired, removeExpiredToken } from '../utils/tokenUtils';


const ProtectedRoute = ({ allowedRoles }) => {
  if (isTokenExpired()) {
    removeExpiredToken();
  }
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  return (
    <MainLayout>
      <ContentLayout allowedRoles={allowedRoles} />
    </MainLayout>
  );
};

export default ProtectedRoute;
