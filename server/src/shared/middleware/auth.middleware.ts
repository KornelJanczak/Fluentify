import { NextFunction, Request, Response } from "express";
import { HttpError } from "@shared/errors/http.error";

const authMiddleware = (req: Request, _: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next(
      HttpError.Unauthorized({
        message: "User is not authenticated",
      })
    );
  }

  return next();
};

export default authMiddleware;
