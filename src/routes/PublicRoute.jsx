import { useKeycloak } from "@react-keycloak/web";
import { Navigate } from "react-router";
import React from "react";

const PublicRoute = ({ children }) => {
    const { keycloak } = useKeycloak();

    // const isLoggedIn = keycloak.authenticated || localStorage.getItem("token");
    // localStorage.setItem('token', keycloak.idToken)
    const isLoggedIn = localStorage.getItem("token") !=="undefined";
    return !isLoggedIn ? children : <Navigate to="/" />
};

export default PublicRoute;


