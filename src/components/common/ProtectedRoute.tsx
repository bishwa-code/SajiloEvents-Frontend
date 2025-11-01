import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth.ts";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-900 dark:text-gray-100 text-xl">
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User is authenticated but not allowed for this role
    return <Navigate to="/" replace />; // redirect to home
  }

  return <Outlet />;
};

export default ProtectedRoute;
