import ServerError from "./serverError";
import { ServerErrorProps } from "./serverError";

export default class DatabaseError extends ServerError {
  constructor(props: Partial<ServerErrorProps> = {}) {
    super({
      name: "DatabaseError",
      code: 500,
      ...props,
    });
  }
}
