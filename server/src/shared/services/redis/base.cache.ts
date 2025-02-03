import { createClient } from "redis";
import { Logger } from "winston";

export type RedisClient = ReturnType<typeof createClient>;

export interface IBaseCacheDependencies {
  client: RedisClient;
  logger: Logger;
}

export abstract class BaseCache {
  protected readonly fileName: string;
  public readonly client: RedisClient;
  protected readonly logger: Logger;

  constructor({ client, logger }: IBaseCacheDependencies) {
    this.client = client;
    this.logger = logger;

    this.cacheError();
  }

  private cacheError(): void {
    this.client.on("error", (error: unknown) => {
      this.logger.error(error);
    });
  }
}
