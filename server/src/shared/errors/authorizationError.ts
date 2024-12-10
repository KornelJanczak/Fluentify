import ServerError from "./serverError";
import { ServerErrorProps } from "./serverError";
import HTTP_STATUS from "http-status-codes";

class AuthorizationError extends ServerError {
  constructor(props: Partial<ServerErrorProps> = {}) {
    super({
      name: "AuthenticationError",
      code: HTTP_STATUS.UNAUTHORIZED,
      ...props,
    });
  }
}

export default AuthorizationError;
