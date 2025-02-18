import winston from "winston";
import morgan, { type Morgan } from "morgan";
import { Request, Response } from "express";

class Logger {
  private readonly levels: {
    fatal: 0;
    error: 1;
    warn: 2;
    info: 3;
    debug: 4;
    trace: 5;
  };
  public initializeMorgan(): Morgan<Request, Response> {
    return morgan(
      ":remote-addr :method :url :status :response-time ms"
    ) as unknown as Morgan<Request, Response>;
  }

  public createLogger(service: string) {
    return winston.createLogger({
      levels: this.levels,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),

        winston.format.printf((info) => {
          const { timestamp, level, message, code, stack } = info;
          const ifErrorCodeExist = code ? `(${code})` : "";
          let loggMessage: string;

      
          

          if (typeof info === "string") {
            loggMessage = `${timestamp} ${level} [${service}]: ${info}`;
            return loggMessage;
          }

          loggMessage = `${timestamp} ${level}${ifErrorCodeExist} [${service}]: ${message}`;

          if (stack) {
            return `${loggMessage}\nStack: ${stack}`;
          }

          return loggMessage;
        })
      ),
      transports: [new winston.transports.Console()],
    });
  }
}

export const logger = new Logger();
