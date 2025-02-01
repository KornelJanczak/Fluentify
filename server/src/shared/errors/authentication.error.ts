import ServerError, { ServerErrorArguments } from "./server.error";
import HTTP_STATUS from "http-status-codes";

class AuthenticationError extends ServerError {
  constructor({ fileName, service, message, stack }: ServerErrorArguments) {
    super("AuthorizationError", HTTP_STATUS.UNAUTHORIZED, {
      fileName,
      message,
      service,
      stack,
    });
  }
}

export default AuthenticationError;
