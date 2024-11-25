import "dotenv/config";
import cookieParser from "cookie-parser";
import express, { Application } from "express";
import routes from "./app.router";
import { Express } from "express";
import { generalErrorHandler } from "./common/middleware/errorMiddleware";
import passport from "passport";
import { SESSION_MAX_AGE } from "./common/config/constants";
import "./common/strategies/google-strategy";
import cors from "cors";
import cookieSession from "cookie-session";

export default function createApp(): Application {
  const app: Express = express();
  app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use(
    cookieSession({
      name: process.env.COOKIE_SESSION_NAME,
      keys: ["mokhtarah"],
      maxAge: SESSION_MAX_AGE,
    })
  );
  app.use(cookieParser());

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api", routes);

  app.use(generalErrorHandler);

  return app;
}
