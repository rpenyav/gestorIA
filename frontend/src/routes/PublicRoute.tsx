// PublicRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useAuth();

  return userId ? <Navigate to="/" /> : <>{children}</>;
};

export default PublicRoute;
