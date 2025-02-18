import { BaseCache } from "@services/redis/base.cache";
import { logger as redisLogger } from "@root/logger";
import { client } from "./redis.client";
import { ServiceError } from "@shared/errors/service.error";

const logger = redisLogger.createLogger("redis.connection");

export default class RedisConnection extends BaseCache {
  public connect(): void {
    this.client
      .connect()
      .then(() => {
        logger.info(`Redis connection established`);
      })
      .catch((error) => {
        throw ServiceError.RedisError({
          message: error.message,
          stack: error.stack,
        });
      });
  }
}

export const redisConnection: RedisConnection = new RedisConnection({
  client,
  logger,
});
