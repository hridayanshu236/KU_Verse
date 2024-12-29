import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthCheck from "./authCheck";
import LoadingSpinner from "../components/Common/LoadingSpinner";
const PrivateRoute = () => {
const { isAuthenticated, loading } = useAuthCheck();
  useEffect(() => {
  }, []);


  if (loading) {
    return <div><LoadingSpinner/></div>; 
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
