import { Request, Response, NextFunction } from "express";
import ServerError from "../errors/serverError";

interface NotFoundHandler {
  (req: Request, res: Response, next: NextFunction): void;
}

export const notFoundHandler: NotFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found = ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const generalErrorHandler = (
  err: Error | ServerError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;

  if (err instanceof ServerError) {
    const errorResponse = {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    };

    const jsonErrorStucture = JSON.stringify(errorResponse, null, 2);

    return res.status(err.code).send(errorResponse);
  }

  return res.status(statusCode).send({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
