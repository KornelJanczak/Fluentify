import winston from "winston";
import dotenv from "dotenv";
import NotFoundError from "@shared/errors/notFound.error";

dotenv.config();

class Config {
  public PORT: string | undefined;
  public DATABASE_URL: string | undefined;
  public NODE_ENV: string | undefined;
  public SESSION_SECRET: string | undefined;
  public CLIENT_URL: string | undefined;
  public COOKIE_SESSION_NAME: string | undefined;
  public LOG_LEVEL: string | undefined;
  public OPENAI_API_KEY: string | undefined;
  public GOOGLE_GENERATIVE_AI_API_KEY: string | undefined;
  public GOOGLE_CLIENT_ID: string | undefined;
  public GOOGLE_CLIENT_SECRET: string | undefined;
  public GOOGLE_CALLBACK_URL: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public REDIS_HOST: string | undefined;
  public GOOGLE_API_KEY: string | undefined;
  public BULL_BASE_PATH: string | undefined;
  readonly loggerLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  };
  private readonly fileName = "config";

  constructor() {
    this.PORT = process.env.PORT || "";
    this.NODE_ENV = process.env.NODE_ENV || "";
    this.DATABASE_URL = process.env.DATABASE_URL || "";
    this.SESSION_SECRET = process.env.SESSION_SECRET || "";
    this.CLIENT_URL = process.env.CLIENT_URL || "";
    this.COOKIE_SESSION_NAME = process.env.COOKIE_SESSION_NAME || "";
    this.LOG_LEVEL = process.env.LOG_LEVEL || "";
    this.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
    this.GOOGLE_GENERATIVE_AI_API_KEY =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
    this.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
    this.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
    this.GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "";
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || "";
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || "";
    this.REDIS_HOST = process.env.REDIS_HOST || "";
    this.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
    this.BULL_BASE_PATH = process.env.BULL_BASE_PATH || "";
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new NotFoundError({
          fileName: this.fileName,
          service: "validateConfig",
          message: `Configuration ${key} is undefined.`,
        });
      }
    }
  }

  public createLogger(name?: string) {
    return winston.createLogger({
      levels: this.loggerLevels,
      level: process.env.LOG_LEVEL || "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),

        winston.format.printf(
          ({ timestamp, level, message, code, service, fileName, stack }) => {
            const ifErrorCodeExist = code ? `(${code})` : "";
            const isService = service ? `/${service}` : "";
            const logLocation = fileName
              ? `${fileName}${isService}`
              : `${name}${isService}`;

            const loggMessage = `${timestamp} ${level}${ifErrorCodeExist} [${logLocation}]: ${message}`;
            if (stack) {
              return `${loggMessage}\nStack: ${stack}`;
            }

            return loggMessage;
          }
        )
      ),
      transports: [new winston.transports.Console()],
    });
  }
}

export const config: Config = new Config();
