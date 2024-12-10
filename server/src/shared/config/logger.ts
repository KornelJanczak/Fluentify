import { createLogger, format, transports } from "winston";

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const logger = createLogger({
  levels,
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),

    format.printf(({ timestamp, level, message, code, service, stack }) => {
      const ifErrorCodeExist = code ? `(${code})` : "";

      const loggMessage = `${timestamp} ${level}${ifErrorCodeExist} [${
        service || "server"
      }]: ${message}`;
      if (stack) {
        return `${loggMessage}\nStack: ${stack}`;
      }

      return loggMessage;
    })
  ),
  transports: [new transports.Console()],
});

export default logger;
