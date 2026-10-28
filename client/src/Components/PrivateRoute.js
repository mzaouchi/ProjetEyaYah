import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const isAuth = useSelector((state) => state.UsersReducer.isAuth);
  const token = localStorage.getItem("token");

  return isAuth || token ? children : <Navigate to="/Login" />;
};

export default PrivateRoute;
