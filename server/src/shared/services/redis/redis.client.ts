import { createClient } from "redis";
import { config } from "@root/config";

export const client = createClient({
  url: config.REDIS_HOST,
});
