import { Request, Response, NextFunction, Express } from "express";
import AuthenticationError from "../../../../common/errors/authenticationError";

export const logOutController = ((
  req: Request,
  _: Response,
  next: NextFunction
) => {
  return req.logout((err) => {
    if (err)
      next(
        new AuthenticationError({
          message: err.message,
          stack: err.stack,
          service: "logOutController",
        })
      );
  });
}) as Express;

export const authStatusController = ((
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser = req.user;

  if (!currentUser) {
    console.log("AuthStatusContoller - User: ", currentUser);
    next(
      new AuthenticationError({
        message: "User is not authenticated",
        service: "authStatusController",
      })
    );
  }
  return res.status(200).json(currentUser);
}) as Express;

export const authSessionController = ((
  req: Request,
  res: Response,
  __: NextFunction
) => {
  return res.status(200).json(req.user);
}) as Express;
