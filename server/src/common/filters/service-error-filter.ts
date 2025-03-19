import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';
import { ServiceError } from '../service-error';

@Catch(ServiceError)
export class ServiceErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ServiceErrorFilter.name);
  public catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(
      `${exception.name}: ${exception.message}`,
      exception.stack,
    );

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      name: 'Internal Server Error',
      message: 'Server Error',
    };

    if (exception instanceof ServiceError.NotFoundError)
      errResponse.statusCode = HttpStatus.NOT_FOUND;

    response.status(errResponse.statusCode).json(errResponse);
  }
}
