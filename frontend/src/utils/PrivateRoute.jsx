import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthCheck from "./authCheck";
const PrivateRoute = () => {
const { isAuthenticated, loading } = useAuthCheck();
  useEffect(() => {
    
  }, []);


  if (loading) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
