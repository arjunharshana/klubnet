import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SuperAdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  // Check if logged in AND if role is 'superadmin'
  if (user && user.role === "superadmin") {
    return <Outlet />;
  }

  // If not superadmin, kick to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default SuperAdminRoute;
