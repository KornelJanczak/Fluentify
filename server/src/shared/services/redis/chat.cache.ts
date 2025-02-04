import RedisError from "@shared/errors/redis.error";
import { BaseCache, IBaseCacheDependencies } from "./base.cache";
import { Chat, Message } from "@services/db/schema";

export interface IChatCache {
  addChatMessageToCache(chatId: string, value: Message): Promise<void>;
  addChatsToCache(chats: Chat[], userId: string): Promise<void>;
  getChatsFromCache(userId: string): Promise<Chat[]>;
  deleteChatFromCache(chatId: string, userId: string): Promise<void>;
}

interface IChatCacheDependencies extends IBaseCacheDependencies {}

class ChatCache extends BaseCache implements IChatCache {
  protected fileName: string = "chat.cache";

  constructor({ logger, client }: IChatCacheDependencies) {
    super({ logger, client });
  }

  async addChatMessageToCache(chatId: string, value: Message): Promise<void> {
    await this.connectionGuard();
    try {
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

  async addChatsToCache(chats: Chat[], userId: string): Promise<void> {
    const key: string = `user:${userId}:chats:cached`;
    await this.connectionGuard();
    try {
      await this.client.SETEX(key, 3600, JSON.stringify(chats));
    } catch (error) {
      throw new RedisError({
        fileName: this.fileName,
        message: error.message,
        service: "addChatsToCache",
        stack: error.stack,
      });
    }
  }

  async getChatsFromCache(userId: string): Promise<Chat[]> {
    const key: string = `user:${userId}:chats:cached`;
    await this.connectionGuard();
    try {
      const chats = await this.client.GET(key);
      return JSON.parse(chats);
    } catch (error) {
      throw new RedisError({
        fileName: this.fileName,
        message: error.message,
        service: "getChatsFromCache",
        stack: error.stack,
      });
    }
  }

  async deleteChatFromCache(chatId: string, userId: string): Promise<void> {
    const key: string = `user:${userId}:chats:cached`;
    await this.connectionGuard();
    try {
      const chats = await this.client.GET(key);

      if (!chats) return;

      const parsedChats: Chat[] = JSON.parse(chats);
      const filteredChats = parsedChats.filter((chat) => chat.id !== chatId);

      const ttl = await this.client.TTL(key);

      await this.client.SETEX(key, ttl, JSON.stringify(filteredChats));
    } catch (error) {
      throw new RedisError({
        fileName: this.fileName,
        message: error.message,
        service: "deleteChatFromCache",
        stack: error.stack,
      });
    }
  }
}

export default ChatCache;
