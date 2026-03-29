import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "./Loader";

const SuperAdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (user && user?.roles?.includes("superadmin")) {
    return <Outlet />;
  }

  // If not superadmin, kick to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default SuperAdminRoute;
