import { BaseCache, IBaseCacheDependencies } from "./base.cache";
import { Chat, Message } from "@services/db/schema";
import { toInteger } from "lodash";
import { ServiceError } from "@shared/errors/service.error";

export interface IChatCache {
  addChatMessageToCache(chatId: string, value: Message): Promise<void>;
  addChatsToCache(chats: Chat[], userId: string): Promise<void>;
  getChatsFromCache(userId: string): Promise<Chat[]>;
  deleteChatFromCache(chatId: string, userId: string): Promise<void>;
}

interface IChatCacheDependencies extends IBaseCacheDependencies {}

class ChatCache extends BaseCache implements IChatCache {
  constructor({ logger, client }: IChatCacheDependencies) {
    super({ logger, client });
  }

  public async addChatMessageToCache(
    chatId: string,
    value: Message
  ): Promise<void> {
    await this.connectionGuard();
    try {
      await this.client.RPUSH(`messages:${chatId}`, JSON.stringify(value));
    } catch (error) {
      throw ServiceError.RedisError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async addChatsToCache(chats: Chat[], userId: string): Promise<void> {
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
      throw ServiceError.RedisError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async getChatsFromCache(userId: string): Promise<Chat[]> {
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
            topic: chat.topic,
            category: chat.category,
          } as Chat;
        })
      );

      return chats;
    } catch (error) {
      throw ServiceError.RedisError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async deleteChatFromCache(
    chatId: string,
    userId: string
  ): Promise<void> {
    await this.connectionGuard();
    try {
      await this.client.SREM(`chats:ids:${userId}`, chatId);
      await this.client.DEL(`chat:${chatId}`);
    } catch (error) {
      throw ServiceError.RedisError({
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export default ChatCache;
