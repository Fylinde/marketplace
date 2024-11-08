import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface ProtectedRouteProps {
  children: JSX.Element;  // Change from `element` to `children`
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.access_token);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
