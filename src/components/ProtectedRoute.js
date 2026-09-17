import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role }) {
  const { session, ready } = useAuth();

  if (!ready) return null;
  if (!session || session.role !== role) {
    return <Navigate to={`/${role}/login`} replace />;
  }
  return <Outlet />;
}
