import { Chat, Message } from "@services/db/schema";
import { IChatRepository } from "@shared/repositories/chat.repository";
import { IMessagesRepository } from "@shared/repositories/messages.repository";
import { IChatCache } from "@services/redis/chat.cache";

export interface IChatService {
  createChat(user: string, title: string): Promise<string>;
  getChatsByUserId(userId: string): Promise<Chat[]>;
  getChatById(chatId: string): Promise<Chat>;
  getMessagesByChatId(chatId: string): Promise<Message[]>;
  deleteChatById(user: string, chatId: string): Promise<string>;
}

export interface IChatServiceDependencies {
  chatRepository: IChatRepository;
  messagesRepository: IMessagesRepository;
  chatCache: IChatCache;
}
