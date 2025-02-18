import ServerError from "./server.error";
import { ServerErrorArguments } from "./server.error";

export class ServiceError extends ServerError {
  static NotFound(descriptors: ServerErrorArguments) {
    const { name } = ServiceError.NotFound;
    return new ServiceError(name, descriptors);
  }

  static AuthError(descriptors: ServerErrorArguments) {
    const { name } = ServiceError.AuthError;
    return new ServiceError(name, descriptors);
  }

  static DeletionError(descriptors: ServerErrorArguments) {
    const { name } = ServiceError.DeletionError;
    return new ServiceError(name, descriptors);
  }

  static DatabaseError(descriptors: ServerErrorArguments) {
    const { name } = ServiceError.DatabaseError;
    return new ServiceError(name, descriptors);
  }

  static RedisError(descriptors: ServerErrorArguments) {
    const { name } = ServiceError.RedisError;
    return new ServiceError(name, descriptors);
  }

  static WorkerError(descriptors: ServerErrorArguments) {
    const { name } = ServiceError.WorkerError;
    return new ServiceError(name, descriptors);
  }
}
