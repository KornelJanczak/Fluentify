import { NextFunction, Request, Response } from "express";
import { HttpError } from "@shared/errors/http.error";
import { logger as authMiddlewareLogger } from "@root/logger";

const logger = authMiddlewareLogger.createLogger("authMiddleware");

const authMiddleware = (req: Request, _: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next(
      HttpError.Unauthorized({
        message: "User is not authenticated",
      })
    );
  }

  logger.info("User is authenticated");
  return next();
};

export default authMiddleware;
