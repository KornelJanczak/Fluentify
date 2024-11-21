import { createLogger, format, loggers, transports } from "winston";

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
    format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} ${level}: ${stack || message}`;
    })
  ),
  transports: [new transports.Console()],
});

loggers.add("jsonLogger", {
  levels,
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.colorize(),
    format.errors({ stack: true }),
    format.timestamp(),
    format.json()
  ),
  transports: [new transports.Console()],
});

loggers.add("timestampLogger", {
  levels,
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf(({ timestamp, level, message, code, stack }) => {
      return `${timestamp} ${level} ${code}: ${stack || message}`;
    })
  ),
  transports: [new transports.Console()],
});

export default logger;
