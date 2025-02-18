export type ServerErrorArguments = {
  message: string;
  stack?: string;
};

abstract class ServerError extends Error {
  constructor(name: string, { message, stack }: ServerErrorArguments) {
    super(message);
    this.name = name;
    this.stack = stack;

    // Error.captureStackTrace(this, ServerError);
  }
}

export default ServerError;
