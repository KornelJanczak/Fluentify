import { IChatRepository } from "@shared/repositories/chat.repository";
import { IMessagesRepository } from "@shared/repositories/messages.repository";
import { IChatCache } from "@services/redis/chat.cache";
import { v4 as uuidv4 } from "uuid";
import { Chat } from "@services/db/schema";
import { ServiceError } from "@shared/errors/service.error";
import { Message } from "@services/db/schema";
import {
  IChatService,
  IChatServiceDependencies,
} from "@chat/chat.interfaces/chat.service.interfaces";

class ChatService implements IChatService {
  private readonly chatRepository: IChatRepository;
  private readonly messagesRepository: IMessagesRepository;
  private readonly chatCache: IChatCache;

  constructor({
    chatRepository,
    messagesRepository,
    chatCache,
  }: IChatServiceDependencies) {
    this.chatRepository = chatRepository;
    this.messagesRepository = messagesRepository;
    this.chatCache = chatCache;
  }

  public async createChat(
    userId: string,
    topic: string,
    category: string
  ): Promise<string> {
    const newChatId = await this.chatRepository.create({
      id: uuidv4(),
      userId: userId,
      topic: topic,
      category: category,
      usedTokens: 0,
      startedAt: new Date(),
    });

    if (!newChatId) {
      throw ServiceError.NotFound({ message: "Chat has not been created" });
    }

    return newChatId;
  }

  public async getChatsByUserId(userId: string): Promise<Chat[]> {
    const cachedChats = await this.chatCache.getChatsFromCache(userId);
    const isCacheEmpty = !cachedChats || cachedChats.length <= 0;

    if (isCacheEmpty) {
      const chats = await this.chatRepository.getChatsByUserId(userId);
      const IsNoChatsAvailable = !chats || chats.length === 0;

      if (IsNoChatsAvailable) {
        throw ServiceError.NotFound({ message: `User ${userId} has no chats` });
      }

      await this.chatCache.addChatsToCache(chats, userId);

      return chats;
    }

    return cachedChats;
  }

  public async getChatById(chatId: string): Promise<Chat> {
    const chat = await this.chatRepository.getById(chatId);

    if (!chat) {
      throw ServiceError.NotFound({ message: `Chat ${chatId} not found` });
    }

    return chat;
  }

  public async getMessagesByChatId(chatId: string): Promise<Message[]> {
    const messages = await this.messagesRepository.getMessagesByChatId(chatId);

    // const isMessagesEmpty = !messages || messages.length === 0;

    // if (isMessagesEmpty) {
    //   throw ServiceError.NotFound({
    //     message: `Chat ${chatId} has no messages`,
    //   });
    // }

    return messages;
  }

  public async deleteChatById(userId: string, chatId: string): Promise<string> {
    const deletedChatId = await this.chatRepository.deleteById(chatId);

    if (deletedChatId) {
      await this.chatCache.deleteChatFromCache(chatId, userId);
      return deletedChatId;
    } else {
      throw ServiceError.DeletionError({
        message: `Chat ${chatId} has not been deleted`,
      });
    }
  }
}

export default ChatService;
