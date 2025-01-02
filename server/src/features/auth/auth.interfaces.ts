import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";

export interface IAuthController {
  logOut(req: Request, res: Response, next: NextFunction): void;
  authStatus(req: Request, res: Response, next: NextFunction): void;
  authSession(req: Request, res: Response, __: NextFunction): void;
}

export interface IAuthControllerDependencies {
  logger: Logger;
}
