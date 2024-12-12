import { Request, Response, NextFunction } from "express";
import AuthenticationError from "@shared/errors/authenticationError";
import { User } from "@shared/db/schema";
import { AuthControllerAbstract } from "./auth.interfaces";
import HTTP_STATUS from "http-status-codes";

const fileName = "auth.controller";

class AuthController implements AuthControllerAbstract {
  public logOut(req: Request, res: Response, next: NextFunction) {
    req.logout((error) => {
      if (error) {
        next(
          new AuthenticationError({
            fileName,
            service: "logOut",
            ...error,
          })
        );
      } else {
        return res
          .status(HTTP_STATUS.OK)
          .json({ message: "Logged out successfully" });
      }
    });
  }

  public authStatus(req: Request, res: Response, next: NextFunction) {
    const currentUser: User = req.user as User;
    console.log("AuthStatusController - User: ", currentUser.id);

    if (!currentUser) {
      next(
        new AuthenticationError({
          fileName,
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

const authController = new AuthController();
export default authController;
