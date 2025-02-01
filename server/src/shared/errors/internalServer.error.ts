import ServerError, { ServerErrorArguments } from "./server.error";
import HTTP_STATUS from "http-status-codes";

class InternalServerError extends ServerError {
  constructor({ fileName, service, message, stack }: ServerErrorArguments) {
    super("InternalServerError", HTTP_STATUS.INTERNAL_SERVER_ERROR, {
      fileName,
      message,
      service,
      stack,
    });
  }
}

export default InternalServerError;
