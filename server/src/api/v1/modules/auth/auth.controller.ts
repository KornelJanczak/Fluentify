import { Request, Response, NextFunction } from "express";
import AuthenticationError from "../../../../common/errors/authenticationError";
import logger from "../../../../common/config/logger";
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
        })
      );
  });
};

export const authStatusController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser = req.user;

  if (!currentUser)
    next(new AuthenticationError({ message: "User is not authenticated" }));

  console.log("User: ", currentUser);

  res.send(req.user).sendStatus(200);
};
