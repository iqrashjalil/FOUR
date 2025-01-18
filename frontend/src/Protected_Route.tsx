import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const Protected_Route = ({ children, requiredRole }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userData = localStorage.getItem("user");

  const user = userData ? JSON.parse(userData) : null;

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    toast.error("You Are Not Allowed To Access");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default Protected_Route;
