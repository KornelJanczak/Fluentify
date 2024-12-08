import ServerError from "./serverError";
import { ServerErrorProps } from "./serverError";
import HTTP_STATUS from "http-status-codes";

class AuthenticationError extends ServerError {
  constructor(props: Partial<ServerErrorProps> = {}) {
    super({
      name: "AuthenticationError",
      code: HTTP_STATUS.NETWORK_AUTHENTICATION_REQUIRED,
      ...props,
    });
  }
}

export default AuthenticationError;
