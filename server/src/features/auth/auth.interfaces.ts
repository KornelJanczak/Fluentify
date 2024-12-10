import { Request, Response, NextFunction } from "express";

export interface AuthControllerAbstract {
  logOut(req: Request, res: Response, next: NextFunction): void;
  authStatus(req: Request, res: Response, next: NextFunction): void;
  authSession(req: Request, res: Response, __: NextFunction): void;
}
