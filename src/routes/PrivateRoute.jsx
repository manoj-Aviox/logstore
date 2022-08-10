import { useKeycloak } from "@react-keycloak/web";
import { Navigate } from "react-router";
import React from "react";

const PrivateRoute = ({ children }) => {
    const { keycloak } = useKeycloak();

    // const isLoggedIn = localStorage.getItem("token");
    // const { keycloak } = useKeycloak();
    // localStorage.setItem('token', keycloak.idToken)

    const isLoggedIn = localStorage.getItem("token") !=="undefined";
    return isLoggedIn ? children : <Navigate to="/signup" />
};

export default PrivateRoute;


