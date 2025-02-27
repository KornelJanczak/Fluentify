import { Chat, Message } from "@services/db/schema";
import { ChatWithMessages, IChatRepository } from "@shared/repositories/chat.repository";
import { IMessagesRepository } from "@shared/repositories/messages.repository";
import { IChatCache } from "@services/redis/chat.cache";

export interface IChatService {
  createChat(values: ICreateChat): Promise<string>;
  getChatsByUserId(userId: string): Promise<Chat[]>;
  getChatById(chatId: string): Promise<Chat>;
  getChatWithMessagesByChatId(chatId: string): Promise<ChatWithMessages>;
  deleteChatById(user: string, chatId: string): Promise<string>;
}

export interface IChatServiceDependencies {
  chatRepository: IChatRepository;
  messagesRepository: IMessagesRepository;
  chatCache: IChatCache;
}

export interface ICreateChat {
  userId: string;
  topic: string;
  category: string;
  vocabularySetId: string;
}
