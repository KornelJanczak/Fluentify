import dotenv from "dotenv";
import { toInteger } from "lodash";
import { ServiceError } from "@shared/errors/service.error";

dotenv.config();

class Config {
  public readonly PORT: number;
  // public readonly NODE_ENV: string;
  public readonly DATABASE_URL: string;
  public readonly SESSION_SECRET: string;
  public readonly CLIENT_URL: string;
  public readonly LOG_LEVEL: string;
  public readonly OPENAI_API_KEY: string;
  public readonly BULL_BASE_PATH: string;

  public readonly SECRETS: {
    ONE: string;
    TWO: string;
  };

  public readonly REDIS: {
    HOST: string;
    PORT: number;
  };

  public readonly GOOGLE: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    CALLBACK_URL: string;
    // API_KEY: string;
    // GENERATIVE_AI_API_KEY: string;
  };

  readonly LOGGER_LEVELS = {
    FATAL: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4,
    TRACE: 5,
  };

  constructor() {
    this.PORT = toInteger(process.env.PORT) || 5000;
    // this.NODE_ENV = process.env.NODE_ENV || "";
    this.DATABASE_URL = process.env.DATABASE_URL || "";
    this.SESSION_SECRET = process.env.SESSION_SECRET || "";
    this.CLIENT_URL = process.env.CLIENT_URL || "";
    this.LOG_LEVEL = process.env.LOG_LEVEL || "";
    this.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
    this.BULL_BASE_PATH = process.env.BULL_BASE_PATH || "";

    this.SECRETS = {
      ONE: process.env.SECRET_KEY_ONE || "",
      TWO: process.env.SECRET_KEY_TWO || "",
    };

    this.REDIS = {
      HOST: process.env.REDIS_HOST || "",
      PORT: toInteger(process.env.REDIS_PORT) || 6379,
    };

    this.GOOGLE = {
      CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
      CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
      CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "",
      // API_KEY: process.env.GOOGLE_API_KEY || "",
      // GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
    };

    this.validateConfig();
  }

  private validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (typeof value === "object") {
        for (const [subKey, subValue] of Object.entries(value)) {
          if (subValue === undefined || subValue === "") {
            throw ServiceError.NotFound({
              message: `Configuration ${key}.${subKey} is undefined.`,
            });
          }
        }
      } else if (value === undefined || value === "") {
        throw ServiceError.NotFound({
          message: `Configuration ${key} is undefined.`,
        });
      }
    }
  }
}

export const config: Config = new Config();
