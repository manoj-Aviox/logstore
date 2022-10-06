import { useKeycloak } from "@react-keycloak/web";
import { Navigate } from "react-router";
import React from "react";

const PublicRoute = ({ children }) => {
  const { keycloak } = useKeycloak();
  const isLoggedIn =
    keycloak.authenticated || localStorage.getItem("refreshToken") !== null;
  return !isLoggedIn ? children : <Navigate to="/" />;
};

export default PublicRoute;
