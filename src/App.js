import React from "react";
import "./App.css";
import Index from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
import keycloak from "./keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";

function App() {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  const setTokens = (token, idToken, refreshToken) => {
    if (token !== "") {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("idToken", idToken);
    }
  };

  return (
    <>
      <header className="App-header">
        <ReactKeycloakProvider
          authClient={keycloak}
          onTokens={(keycloakTokens) =>
            setTokens(
              keycloakTokens.token ? keycloakTokens.token : "",
              keycloakTokens.idToken ? keycloakTokens.idToken : "",
              keycloakTokens.refreshToken ? keycloakTokens.refreshToken : ""
            )
          }
          initOptions={{
            onLoad: "",
            token,
            refreshToken,
          }}
        >
          <Index />
        </ReactKeycloakProvider>
      </header>
    </>
  );
}

export default App;
