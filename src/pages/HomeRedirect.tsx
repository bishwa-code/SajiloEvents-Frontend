import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import HomePage from "./HomePage";

const HomeRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    // no user, show homepage normally
    return <HomePage />;
  }

  // user exists, redirect by role
  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "student") {
    return <Navigate to="/dashboard" replace />;
  }

  // fallback
  return <HomePage />;
};

export default HomeRedirect;
