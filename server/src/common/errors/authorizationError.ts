import ServerError from "./serverError";
import { ServerErrorProps } from "./serverError";

class AuthenticationError extends ServerError {
  constructor({ code = 403 }: ServerErrorProps) {
    super({
      name: "AuthenticationError",
      code,
    });
  }
}

export default AuthenticationError;
