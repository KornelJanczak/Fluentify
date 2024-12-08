import ServerError from "./serverError";
import HTTP_STATUS from "http-status-codes";
import { ServerErrorProps } from "./serverError";

export default class DatabaseError extends ServerError {
  constructor(props: Partial<ServerErrorProps> = {}) {
    super({
      name: "DatabaseError",
      code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ...props,
    });
  }
}
