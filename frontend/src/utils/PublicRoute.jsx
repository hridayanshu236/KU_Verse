import { Navigate, Outlet } from "react-router-dom";
import useAuthCheck from "./authCheck";

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuthCheck();

  if (loading) {
    return <div>Loading...</div>;
  }

 
  return isAuthenticated ? <Navigate to="/feed" /> : <Outlet />;
};

export default PublicRoute;
