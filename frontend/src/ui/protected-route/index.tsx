import { Navigate, Outlet } from "@tanstack/react-router";

const ProtectedRoute = () => {
  const user = localStorage.getItem("user");

  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
