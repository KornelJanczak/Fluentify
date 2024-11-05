import { Request, Response, NextFunction } from "express";

interface NotFoundHandler {
  (req: Request, res: Response, next: NextFunction): void;
}

export const notFoundHandler: NotFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found = ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const generalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;

  console.log(err.stack);

  res.status(statusCode).send({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
