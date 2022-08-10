import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
    url: "https://iam.sandboxing.tech",
    realm: "RealDemo",
    clientId: "demo-client",
});

export default keycloak;