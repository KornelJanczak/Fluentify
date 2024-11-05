import "dotenv/config";
import cookieParser from "cookie-parser";
import express, { Application } from "express";
import routes from "./routes/index";
import { Express } from "express";
import { GrantType, setupKinde } from "@kinde-oss/kinde-node-express";

const config = {
  clientId: process.env.KINDE_CLIENT_ID,
  issuerBaseUrl: process.env.KINDE_ISSUER_URL,
  siteUrl: "http://localhost:3000",
  secret: process.env.KINDE_CLIENT_SECRET,
  redirectUrl: "http://localhost:3000",
  scope: "openid profile email",
  grantType: GrantType.AUTHORIZATION_CODE, //or CLIENT_CREDENTIALS or PKCE
  unAuthorisedUrl: "http://localhost:3000/unauthorised",
  postLogoutRedirectUrl: "http://localhost:3000",
};

export default function createApp(): Application {
  const app: Express = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api", routes);

  setupKinde(config, app);

  return app;
}
