import ServerError from "./serverError";
import { ServerErrorProps } from "./serverError";

class AuthorizationError extends ServerError {
  constructor({ code = 403 }: ServerErrorProps) {
    super({
      name: "AuthenticationError",
      code,
    });
  }
}

export default AuthorizationError;
