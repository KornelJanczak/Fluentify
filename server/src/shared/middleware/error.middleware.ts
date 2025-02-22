import type { Request, Response } from "express";
import ServerError from "../errors/server.error";
import HTTP_STATUS from "http-status-codes";
import { HttpError } from "@shared/errors/http.error";
import { logger as errorLogger } from "@root/logger";
import { ServiceError } from "@shared/errors/service.error";

export const globalErrorMiddleware = (
  err: Error | ServerError,
  req: Request,
  res: Response
) => {
  const logger = errorLogger.createLogger("errorMiddleware");

  console.log("globalErrorMiddleware", err);

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
    console.log("ServiceError", err);

    logger.error({
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  }

  return res.status(errorResponse.code).send(errorResponse);
};
