import "dotenv/config";
import cookieParser from "cookie-parser";
import express, { Application } from "express";
import routes from "./router/index";
import { Express } from "express";
import { generalErrorHandler } from "./common/middleware/errorMiddleware";
import passport from "passport";
import session from "express-session";
import "./common/strategies/google-strategy";
import cookieSession from "cookie-session";

const SESSION_MAX_AGE = 24 * 60 * 60 * 1000;
const SESSION_EXPIRY_DATE = 60 * 60000;

export default function createApp(): Application {
  const app: Express = express();
  app.use(express.json());
  app.use(
    cookieSession({
      name: process.env.COOKIE_SESSION_NAME,
      keys: ["mokhtarah"],
      maxAge: SESSION_MAX_AGE,
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

  app.use(generalErrorHandler);

  return app;
}
