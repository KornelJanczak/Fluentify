import "dotenv/config";
import cookieParser from "cookie-parser";
import express, { Application } from "express";
import routes from "./router/index";
import { Express } from "express";
import { setupKinde } from "@kinde-oss/kinde-node-express";
import { generalErrorHandler } from "./common/middleware/errorMiddleware";
import config from "./common/config/kindeConfig";
import passport from "passport";
import session from "express-session";
import "./common/strategies/google-strategy";
import cookieSession from "cookie-session";

const SESSION_EXPIRY_DATE = 60 * 60000;

export default function createApp(): Application {
  const app: Express = express();
  app.use(express.json());
  app.use(
    cookieSession({
      name: "fluentify-server-session",
      keys: ["mokhtarah"],
      maxAge: 24 * 60 * 60 * 100,
    })
  );
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "",
      saveUninitialized: true,
      resave: false,
      cookie: {
        maxAge: SESSION_EXPIRY_DATE,
        secure: true,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api", routes);

  // setupKinde(config, app);

  app.use(generalErrorHandler);

  return app;
}

// http://localhost:5000/api/v1/auth/google
