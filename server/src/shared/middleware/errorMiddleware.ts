import { Request, Response, NextFunction } from "express";
import ServerError from "../errors/serverError";
import config from "@root/config";

const logger = config.createLogger();

export const globalErrorMiddleware = (
  err: Error | ServerError,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  let errorResponse = {
    name: "Internal Server Error",
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
    code: res.statusCode,
    service: undefined,
  };

  if (err instanceof ServerError) {
    errorResponse = {
      name: err.name,
      service: err.service,
      message: err.message,
      code: err.code,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    };
  }

  logger.error(errorResponse);

  return res.status(errorResponse.code).send(errorResponse);
};
