import { Request, Response, NextFunction } from "express";
import ServerError from "../errors/serverError";
import logger from "../config/logger";

export const generalErrorHandler = (
  err: Error | ServerError,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;

  if (err instanceof ServerError) {
    const errorResponse = {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    };

    logger.error(errorResponse);

    res.status(err.code).send(errorResponse);
  }

  res.status(statusCode).send({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
