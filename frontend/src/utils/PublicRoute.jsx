import { Navigate, Outlet } from "react-router-dom";
import useAuthCheck from "./authCheck";
import LoadingSpinner from "../components/Common/LoadingSpinner";
const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuthCheck();

  if (loading) {
    return <div><LoadingSpinner/></div>;
  }

 
  return isAuthenticated ? <Navigate to="/feed" /> : <Outlet />;
};

export default PublicRoute;
