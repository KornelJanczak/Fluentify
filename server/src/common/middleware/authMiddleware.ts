import { NextFunction, Request, Response } from "express";
import AuthenticationError from "../errors/authenticationError";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("auth", req.isAuthenticated());

  if (!req.isAuthenticated()) {
    next(new AuthenticationError({ message: "User is not authenticated" }));
  }
  next();
};

export default authMiddleware;
