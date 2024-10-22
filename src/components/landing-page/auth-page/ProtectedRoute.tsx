import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { checkSessionExpiry, clearSession } from './sessionAuth';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("userData");
  const navigate = useNavigate()

  useEffect(() => {
    const isSessionExpired = checkSessionExpiry();
    if (isSessionExpired) {
      clearSession();
      navigate("/login"); 
    }
  }, [navigate]);

  if (!token && !userData) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
