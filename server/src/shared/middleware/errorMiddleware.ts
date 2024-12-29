import { Request, Response, NextFunction } from "express";
import ServerError from "../errors/serverError";
import { config } from "@root/config";

const logger = config.createLogger("errorMiddleware");

export const globalErrorMiddleware = (
  err: Error | ServerError,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  let errorResponse = {
    code: res.statusCode,
    name: "Internal Server Error",
    fileName: undefined,
    service: undefined,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  };

  if (err instanceof ServerError) {
    errorResponse = {
      code: err.code,
      name: err.name,
      fileName: err.fileName,
      service: err.service,
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    };
  }

  logger.error(errorResponse);

  return res.status(errorResponse.code).send(errorResponse);
};
