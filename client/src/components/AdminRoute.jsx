import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { isAuthLoading, isAuthenticated, isAdminUser } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <div className="px-4 py-10 text-center text-slate-500">Checking admin access...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdminUser) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
}

export default AdminRoute;
