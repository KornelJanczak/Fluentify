import type { NextFunction, Request, Response } from "express";
import ServerError from "../errors/server.error";
import HTTP_STATUS from "http-status-codes";
import { HttpError } from "@shared/errors/http.error";
import { logger as errorLogger } from "@root/logger";
import { ServiceError } from "@shared/errors/service.error";

const logger = errorLogger.createLogger("errorMiddleware");
export const globalErrorMiddleware = (
  err: Error | ServerError,
  _: Request,
  res: Response,
  __: NextFunction
): Response => {
  let errorResponse = {
    code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    name: "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
    message: "Server is busy, please try again later",
  };

  if (err instanceof HttpError) {
    errorResponse = {
      code: err.code,
      name: err.name,
      message: JSON.stringify(err.message),
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    };

    logger.error({
      code: errorResponse.code,
      name: errorResponse.name,
      stack: errorResponse.stack,
      message: errorResponse.message,
    });
  } else if (err instanceof ServiceError) {
    logger.error({
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  }

  return res.status(errorResponse.code).send(errorResponse);
};
