import ServerError, { ServerErrorArguments } from "./server.error";
import HTTP_STATUS from "http-status-codes";

export default class DatabaseError extends ServerError {
  constructor({ fileName, service, message, stack }: ServerErrorArguments) {
    super("DatabaseError", HTTP_STATUS.INTERNAL_SERVER_ERROR, {
      fileName,
      message,
      service,
      stack,
    });
  }
}
