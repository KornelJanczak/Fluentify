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

    const multi = this.client.MULTI();

    for (const chat of chats) {
      multi.ZADD(key, {
        score: new Date(chat.startedAt).getTime(),
        value: chat.id,
      });
    }

    for (const chat of chats) {
      for (const [itemKey, itemValue] of Object.entries(chat)) {
        multi.HSET(`chat:${chat.id}`, `${itemKey}`, `${itemValue}`);
      }
    }

    try {
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

  async getChatsFromCache(userId: string) {
    const key = `chats:ids:${userId}`;
    await this.connectionGuard();
    try {
      const chatsIds: string[] = await this.client.ZRANGE(key, 0, -1);

      const multi = this.client.multi();
      for (const id of chatsIds) {
        multi.HGETALL(`chat:${id}`);
      }

      const cachedChats = await multi.exec();

      //@ts-ignore
      const chats: Chat[] = cachedChats.map((chat: Chat) => {
        return {
          ...chat,
          startedAt: new Date(chat.startedAt),
          usedTokens: toInteger(chat.usedTokens),
        };
      });

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
      await this.client.ZREM(`chats:ids:${userId}`, chatId);
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
