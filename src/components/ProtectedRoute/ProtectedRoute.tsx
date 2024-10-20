import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../redux/store';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const access_token = useSelector((state: RootState) => state.auth.access_token);

  if (!access_token) {
    console.log("ProtectedRoute - No token found, redirecting to sign-in.");
    return <Navigate to="/registration/sign-in" />;
}


  return <>{children}</>;
};

export default ProtectedRoute;
