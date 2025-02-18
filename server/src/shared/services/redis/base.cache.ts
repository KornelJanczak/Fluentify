import { ServiceError } from "@shared/errors/service.error";
import { createClient } from "redis";
import { Logger } from "winston";

export type RedisClient = ReturnType<typeof createClient>;

export interface IBaseCacheDependencies {
  client: RedisClient;
  logger: Logger;
}

export abstract class BaseCache {
  public readonly client: RedisClient;
  protected readonly fileName: string;
  protected readonly logger: Logger;

  constructor({ client, logger }: IBaseCacheDependencies) {
    this.client = client;
    this.logger = logger;
    this.cacheError();
  }

  protected async connectionGuard(): Promise<void> {
    try {
      if (!this.client.isOpen) await this.client.connect();
    } catch (error) {
      throw ServiceError.RedisError({
        message: error.message,
        stack: error.stack,
      });
    }
  }
  protected cacheError(): void {
    this.client.on("error", (error: unknown) => {
      this.logger.error(error);
    });
  }
}
