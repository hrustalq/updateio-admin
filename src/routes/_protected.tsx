import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet, useLocation } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";

export const Protected: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { pathname } = useLocation();

  if (isLoading) {
    return (
      <div className="fixed top-1/2 left-1/2 z-[2000] basis-full flex flex-col flex-grow justify-center items-center">
        <LoaderCircle className="size-12 animate-spin" />
      </div>
    ); // You can replace this with a loading spinner component
  }

  if (pathname === "/login" && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
