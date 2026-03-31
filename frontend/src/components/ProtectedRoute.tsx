import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component ensures only authenticated admins can access certain routes.
 * Checks for valid JWT token in localStorage.
 * If token doesn't exist, redirects to login page.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // No token found, redirect to login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
