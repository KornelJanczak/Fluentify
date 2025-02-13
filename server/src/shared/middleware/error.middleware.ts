import { Request, Response, NextFunction } from "express";
import ServerError from "../errors/server.error";
import { config } from "@root/config";
import RedisError from "@shared/errors/redis.error";
import HTTP_STATUS from "http-status-codes";

const logger = config.createLogger("errorMiddleware");

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

  if (err instanceof ServerError) {
    errorResponse = {
      code: err.code,
      name: err.name,
      fileName: err.fileName,
      service: err.service,
      message: JSON.stringify(err.message),
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    };
  } else {
    logger.error({
      code: errorResponse.code,
      name: errorResponse.name,
      stack: errorResponse.stack,
      message: errorResponse.message,
    });
  }

  if (err instanceof RedisError) {
    errorResponse = baseResponse;
  }

  return res.status(errorResponse.code).send(errorResponse);
};
