import ServerError, { ServerErrorArguments } from "./serverError";
import HTTP_STATUS from "http-status-codes";

class AuthorizationError extends ServerError {
  constructor({ fileName, service, message, stack }: ServerErrorArguments) {
    super("AuthorizationError", HTTP_STATUS.UNAUTHORIZED, {
      fileName,
      message,
      service,
      stack,
    });
  }
}

export default AuthorizationError;
