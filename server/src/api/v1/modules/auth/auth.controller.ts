import { Request, Response, NextFunction } from "express";
import AuthenticationError from "../../../../common/errors/authenticationError";

export const logOutController = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  req.logout((err) => {
    if (err)
      next(
        new AuthenticationError({
          message: err.message,
          stack: err.stack,
          service: "logOutController",
        })
      );
  });
};

export const authStatusController = (
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  const currentUser = req.user;

  if (!currentUser) {
    console.log("AuthStatusContoller - User: ", currentUser);
    next(
      new AuthenticationError({
        message: "User is not authenticated",
        service: "authStatusController",
      })
    );
  } else {
    return res.status(200).json(currentUser);
  }
};
