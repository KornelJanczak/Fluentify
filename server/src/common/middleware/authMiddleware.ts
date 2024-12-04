import { NextFunction, Request, Response } from "express";
import AuthenticationError from "../errors/authenticationError";
import logger from "../config/logger";

const authMiddleware = (req: Request, _: Response, next: NextFunction) => {
  console.log(req.user);

  if (!req.isAuthenticated()) {
    return next(
      new AuthenticationError({
        service: "authMiddleware",
        message: "User is not authenticated",
      })
    );
  }

  logger.info("AuthMiddleware: User is authenticated");
  return next();
};

export default authMiddleware;
