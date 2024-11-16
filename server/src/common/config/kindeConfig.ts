import { GrantType } from "@kinde-oss/kinde-node-express";

const config = {
  clientId: process.env.KINDE_CLIENT_ID,
  issuerBaseUrl: process.env.KINDE_ISSUER_URL,
  siteUrl: "http://localhost:5000/api/v1",
  secret: process.env.KINDE_CLIENT_SECRET,
  redirectUrl: "http://localhost:5000/api/v1/auth/kinde_callback",
  scope: "openid profile email",
  grantType: GrantType.AUTHORIZATION_CODE,
  unAuthorisedUrl: "http://localhost:3000/unauthorised",
  postLogoutRedirectUrl: "http://localhost:3000",
};

export default config;

