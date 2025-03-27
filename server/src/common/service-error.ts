import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceError extends Error {
  constructor(
    public name: string,
    public message: string,
    public stack?: any,
  ) {
    super(message);

    this.name = name;

    if (Error.captureStackTrace)
      Error.captureStackTrace(this, this.constructor);
  }

  static NotFoundError(message: string, stack?: any) {
    return new ServiceError('NotFoundError', message, stack);
  }

  static AuthError(message: string, stack?: any) {
    return new ServiceError('AuthError', message, stack);
  }

  static DeletionError(message: string, stack?: any) {
    return new ServiceError('DeletionError', message, stack);
  }

  static DatabaseError(message: string, stack?: any) {
    return new ServiceError('DatabaseError', message, stack);
  }

  static RedisError(message: string, stack?: any) {
    return new ServiceError('RedisError', message, stack);
  }

  static ExternalServiceError(message: string, stack?: any) {
    return new ServiceError('ExternalServiceError', message, stack);
  }

  static WorkerError(message: string, stack?: any) {
    return new ServiceError('WorkerError', message, stack);
  }
}
