import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
  url: "https://iam.sandboxing.tech",
  realm: "Com work",
  clientId: "Comviv",
});

export default keycloak;
