import ServerError, { ServerErrorArguments } from "./serverError";
import HTTP_STATUS from "http-status-codes";

export default class DatabaseError extends ServerError {
  constructor({ fileName, service, message, stack }: ServerErrorArguments) {
    super("DatabaseError", HTTP_STATUS.UNAUTHORIZED, {
      fileName,
      message,
      service,
      stack,
    });
  }
}
