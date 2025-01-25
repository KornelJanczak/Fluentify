import { config } from "@root/config";
import { BaseCache } from "@services/redis/redis.baseCahe";
import { Logger } from "winston";
import { client } from "./redis.client";

const logger: Logger = config.createLogger("redisConnection");

class RedisConnection extends BaseCache {
  private readonly fileName: string = "redis.connection";
  connect(): void {
    const service = "connect";
    this.client
      .connect()
      .then(() => {
        logger.info({
          fileName: this.fileName,
          service,
          message: `Redis connection: ${this.client.ping()}`,
        });
      })
      .catch((error) => {
        logger.error({
          fileName: this.fileName,
          service,
          message: "Error connecting to Redis",
          error,
        });
      });
  }
}

export const redisConnection: RedisConnection = new RedisConnection({
  client,
  logger,
});

export default () => {
  redisConnection.connect();
  console.log("a");
};
