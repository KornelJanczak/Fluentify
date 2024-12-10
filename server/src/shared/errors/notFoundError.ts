import ServerError from "./serverError";
import HTTP_STATUS from "http-status-codes";
import { ServerErrorProps } from "./serverError";

class NotFoundError extends ServerError {
  constructor(props: Partial<ServerErrorProps> = {}) {
    super({
      name: "NotFoundError",
      code: HTTP_STATUS.NOT_FOUND,
      ...props,
    });
  }
}

export default NotFoundError;
