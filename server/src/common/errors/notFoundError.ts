import ServerError from "./serverError";
import { ServerErrorProps } from "./serverError";

class NotFoundError extends ServerError {
  constructor({ code = 404 }: ServerErrorProps) {
    super({
      name: "NotFoundError",
      code,
    });
  }
}

export default NotFoundError;
