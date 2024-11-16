import ServerError from "./serverError";
import { ServerErrorProps } from "./serverError";

class AuthenticationError extends ServerError {
  constructor(props: Partial<ServerErrorProps> = {}) {
    super({
      name: "AuthenticationError",
      code: 401,
      ...props
    });
  }
}

export default AuthenticationError;
