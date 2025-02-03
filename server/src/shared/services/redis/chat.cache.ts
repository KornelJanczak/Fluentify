import RedisError from "@shared/errors/redis.error";
import { BaseCache, IBaseCacheDependencies } from "./base.cache";
import { Message } from "@services/db/schema";

interface IChatCacheDependencies extends IBaseCacheDependencies {}

class ChatCache extends BaseCache {
  protected fileName: string = "chat.cache";

  constructor({ logger, client }: IChatCacheDependencies) {
    super({ logger, client });
  }

  async addChatMessageToCache(chatId: string, value: Message): Promise<void> {
    try {
      if (!this.client.isOpen) await this.client.connect();

      await this.client.RPUSH(`messages:${chatId}`, JSON.stringify(value));
    } catch (error) {
      throw new RedisError({
        fileName: this.fileName,
        message: error.message,
        service: "addChatMessageToCache",
        stack: error.stack,
      });
    }
  }
}

export default ChatCache;
