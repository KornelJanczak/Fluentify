import RedisError from "@shared/errors/redis.error";
import { BaseCache, IBaseCacheDependencies } from "./base.cache";
import { Chat, Message } from "@services/db/schema";
import { toInteger } from "lodash";

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
    const key = `chats:ids:${userId}`;
    await this.connectionGuard();
    try {
      const multi = this.client.MULTI();

      for (const chat of chats) {
        multi.SADD(key, chat.id);
      }

      for (const chat of chats) {
        for (const [itemKey, itemValue] of Object.entries(chat)) {
          multi.HSET(`chat:${chat.id}`, `${itemKey}`, `${itemValue}`);
        }
      }

      await multi.EXEC();
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
    const key = `chats:ids:${userId}`;
    await this.connectionGuard();
    try {
      const chatsIds: string[] = await this.client.SMEMBERS(key);

      const chats: Chat[] = await Promise.all(
        chatsIds.map(async (id) => {
          const chat = await this.client.HGETALL(`chat:${id}`);
          return {
            id: chat.id,
            usedTokens: toInteger(chat.usedTokens),
            title: chat.title,
            startedAt: new Date(chat.startedAt),
            userId: chat.userId,
          } as Chat;
        })
      );

      return chats;
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
    await this.connectionGuard();
    try {
      await this.client.SREM(`chats:ids:${userId}`, chatId);
      await this.client.DEL(`chat:${chatId}`);
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
