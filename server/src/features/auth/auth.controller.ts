import { Request, Response, NextFunction } from "express";
import AuthenticationError from "@shared/errors/authenticationError";
import { User } from "@shared/services/db/schema";
import {
  IAuthController,
  IAuthControllerDependencies,
} from "./auth.interfaces";
import HTTP_STATUS from "http-status-codes";
import { Logger } from "winston";

class AuthController implements IAuthController {
  private readonly fileName = "auth.controller";
  private readonly logger: Logger;

  constructor({ logger }: IAuthControllerDependencies) {
    this.logger = logger;
  }

  public logOut(req: Request, res: Response, next: NextFunction) {
    req.logout((error) => {
      if (error) {
        next(
          new AuthenticationError({
            fileName: this.fileName,
            service: "logOut",
            ...error,
          })
        );
      } else {
        this.logger.info({
          service: "logOut",
          message: `User has been logged out`,
        });

        return res
          .status(HTTP_STATUS.OK)
          .json({ message: "Logged out successfully" });
      }
    });
  }

  public authStatus(req: Request, res: Response, next: NextFunction) {
    const currentUser: User = req.user as User;
    this.logger.info({
      service: "authStatus",
      message: `User is authenticated ${currentUser.id}`,
    });

    if (!currentUser) {
      next(
        new AuthenticationError({
          fileName: this.fileName,
          service: "authStatus",
          message: "User is not authenticated",
        })
      );
    }
    return res.status(HTTP_STATUS.OK).json(currentUser);
  }

  public authSession(req: Request, res: Response, __: NextFunction) {
    return res.status(HTTP_STATUS.OK).json(req.user);
  }
}

export default AuthController;
