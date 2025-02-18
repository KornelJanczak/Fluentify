import { Request, Response, NextFunction } from "express";
import { User } from "@services/db/schema";
import {
  IAuthController,
  IAuthControllerDependencies,
} from "./auth.interfaces";
import HTTP_STATUS from "http-status-codes";
import { Logger } from "winston";
import { HttpError } from "@shared/errors/http.error";

class AuthController implements IAuthController {
  private readonly logger: Logger;

  constructor({ logger }: IAuthControllerDependencies) {
    this.logger = logger;
  }

  public logOut(req: Request, res: Response, next: NextFunction) {
    req.logout((error) => {
      if (error) {
        return next(
          HttpError.Unauthorized({
            message: error.message,
            stack: error.stack,
          })
        );
      } else {
        this.logger.info(`User has been logged out`);

        return res
          .status(HTTP_STATUS.OK)
          .json({ message: "Logged out successfully" });
      }
    });
  }

  public authSession(req: Request, res: Response, next: NextFunction) {
    const currentUser: User = req.user as User;

    if (!currentUser)
      return next(
        HttpError.Unauthorized({
          message: "User is not authenticated",
        })
      );

    this.logger.info(`User is authenticated ${currentUser.id}`);

    return res.status(HTTP_STATUS.OK).json(currentUser);
  }
}

export default AuthController;
