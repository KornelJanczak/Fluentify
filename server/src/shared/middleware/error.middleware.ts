import { Request, Response, NextFunction } from "express";
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
) => {
  const baseResponse = {
    code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    name: "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
    message: "Internal Server Error",
  };

  let errorResponse: any = baseResponse;

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
      name: errorResponse.name,
      stack: errorResponse.stack,
      message: errorResponse.message,
    });
  }

  return res.status(errorResponse.code).send(errorResponse);
};
