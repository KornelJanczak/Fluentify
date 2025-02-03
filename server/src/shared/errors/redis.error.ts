import ServerError from "./server.error";

class RedisError extends ServerError {
  constructor({ message, fileName, service, stack }) {
    super("RedisError", 500, {
      message,
      fileName,
      service,
      stack,
    });
  }
}

export default RedisError;
