import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import { config } from "@root/config";

const logger = config.createLogger("baseCache");

export type RedisClient = ReturnType<typeof createClient>;
class BaseCache {
  client: RedisClient;

  constructor() {}

  async connect(): Promise<void> {
    try {
      this.client = createClient({
        url: config.REDIS_HOST_URL,
      });
      await this.client.connect();
      logger.info(`Redis connection: ${await this.client.ping()}`);
    } catch (error) {
      logger.error(error);
    }
  }

  createSessionStore(): RedisStore {
    this.connect();
    this.cacheError();
    return new RedisStore({ client: this.client, prefix: "session" });
  }

  private cacheError(): void {
    this.client.on("error", (error: unknown) => {
      logger.error(error);
    });
  }
}

let redisClient = createClient({ url: config.REDIS_HOST_URL });
redisClient.connect().catch(console.error);

export let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

// const baseCache: BaseCache = new BaseCache();
// export default baseCache;
