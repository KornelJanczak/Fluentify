import { NextFunction, Request, Response } from "express";
import AuthenticationError from "@shared/errors/authenticationError";
import { config } from "@root/config";

const logger = config.createLogger("authMiddleware");

const authMiddleware = (req: Request, _: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next(
      new AuthenticationError({
        service: "authMiddleware",
        message: "User is not authenticated",
      })
    );
  }

  logger.info("User is authenticated");
  return next();
};

export default authMiddleware;
