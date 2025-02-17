export type ServerErrorArguments = {
  fileName?: string;
  service: string;
  message: string;
  stack?: string;
};

abstract class ServerError extends Error {
  public code: number;
  public fileName?: string;
  public service: string;

  constructor(
    name: string,
    code: number,
    { fileName, service, message, stack }: ServerErrorArguments
  ) {
    super(message);
    this.name = name;
    this.code = code;
    this.fileName = fileName;
    this.service = service;
    this.stack = stack;

    Error.captureStackTrace(this, ServerError);
  }
}

export default ServerError;
