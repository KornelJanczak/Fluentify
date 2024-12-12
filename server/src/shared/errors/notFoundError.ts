import ServerError, { ServerErrorArguments } from "./serverError";
import HTTP_STATUS from "http-status-codes";

class NotFoundError extends ServerError {
  constructor({ fileName, service, message, stack }: ServerErrorArguments) {
    super("NotFoundError", HTTP_STATUS.UNAUTHORIZED, {
      fileName,
      message,
      service,
      stack,
    });
  }
}

export default NotFoundError;
