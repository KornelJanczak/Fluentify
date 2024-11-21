export type ServerErrorProps = {
  name: string;
  message?: string;
  stack?: string;
  service?: string;
  code: number;
};

abstract class ServerError extends Error {
  name: string;
  message: string;
  stack: string;
  service: string;
  code: number;

  constructor({ name, message, stack, service, code }: ServerErrorProps) {
    super();
    this.name = name;
    this.message = message;
    this.code = code;
    this.service = service;
    this.stack = stack;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ServerError;
