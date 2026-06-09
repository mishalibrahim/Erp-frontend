import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const PublicLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  // If they are already logged in, they shouldn't see the login page.
  // Send them straight to the dashboard.
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eceef2" }}>
      <Outlet />
    </div>
  );
};
