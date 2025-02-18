import ServerError from "./server.error";
import HTTP_STATUS from "http-status-codes";
import { ServerErrorArguments } from "./server.error";

export class HttpError extends ServerError {
  public readonly code: number;

  constructor(
    name: string,
    code: number,
    descriptors: ServerErrorArguments
  ) {
    super(name, descriptors);
    this.code = code;
  }

  static NotFound(descriptors: ServerErrorArguments) {
    const { name } = HttpError.NotFound;
    return new HttpError(name, HTTP_STATUS.NOT_FOUND, descriptors);
  }

  static InternalServerError(descriptors: ServerErrorArguments) {
    const { name } = HttpError.InternalServerError;
    return new HttpError(name, HTTP_STATUS.INTERNAL_SERVER_ERROR, descriptors);
  }

  static Unauthorized(descriptors: ServerErrorArguments) {
    const { name } = HttpError.Unauthorized;
    return new HttpError(name, HTTP_STATUS.UNAUTHORIZED, descriptors);
  }

  static BadRequest(descriptors: ServerErrorArguments) {
    const { name } = HttpError.BadRequest;
    return new HttpError(name, HTTP_STATUS.BAD_REQUEST, descriptors);
  }
}
