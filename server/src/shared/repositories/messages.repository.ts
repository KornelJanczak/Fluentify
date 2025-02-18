import { db } from "../services/db";
import { type Message, messages } from "../services/db/schema";
import { eq } from "drizzle-orm";
import { ServiceError } from "@shared/errors/service.error";

export interface IMessagesRepository {
  saveMessages(newMessages: Message[]): Promise<Message[]>;
  getMessagesByChatId(chatId: string): Promise<Message[]>;
}

class MessagesRepository implements IMessagesRepository {
  public async saveMessages(newMessages: Message[]): Promise<Message[]> {
    try {
      return await db.insert(messages).values(newMessages).returning();
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async getMessagesByChatId(chatId: string): Promise<Message[]> {
    try {
      return await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, chatId));
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export default MessagesRepository;
