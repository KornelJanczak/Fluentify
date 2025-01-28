import { NextFunction, Request, Response } from "express";
import AuthenticationError from "@shared/errors/authentication.error";
import { config } from "@root/config";

const logger = config.createLogger("authMiddleware");

const authMiddleware = (req: Request, _: Response, next: NextFunction) => {
  console.log("AUTH SESION", req.session);
  console.log("AUTH USER", req.user);

  if (!req.isAuthenticated()) {
    return next(
      new AuthenticationError({
        service: "authMiddleware",
        message: "User is not authenticated",
      })
    );
  }

  logger.info({ message: "User is authenticated" });
  return next();
};

export default authMiddleware;
