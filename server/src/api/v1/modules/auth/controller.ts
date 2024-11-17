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

  console.log(currentUser);
  console.log(req.session);

  if (!currentUser)
    next(new AuthenticationError({ message: "User is not authenticated" }));

  logger.info(`User ${currentUser} is authenticated`);
  res.send(req.user);
};
