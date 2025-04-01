import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  public catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errResponse = {
      error: 'Internal Server Error',
      message: 'Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    if (exception instanceof NotFoundException) {
      errResponse.statusCode = HttpStatus.NOT_FOUND;
      errResponse.error = exception.name;
      errResponse.message = exception.message;
    }

    if (exception instanceof BadRequestException) {
      errResponse.statusCode = HttpStatus.BAD_REQUEST;
      errResponse.error = exception.name;
      errResponse.message = exception.message;
    }

    if (exception instanceof UnauthorizedException) {
      errResponse.statusCode = HttpStatus.UNAUTHORIZED;
      errResponse.error = exception.name;
      errResponse.message = exception.message;
    }

    response.status(errResponse.statusCode).json(errResponse);
  }
}
