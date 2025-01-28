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

    if (fileName) {
      (this as any).fileName = fileName;
    }

    if (service) {
      (this as any).service = service;
    }

    if (stack) {
      (this as any).stack = stack;
    }

    Error.captureStackTrace(this, ServerError);
  }
}

export default ServerError;
