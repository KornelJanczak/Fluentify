import { db } from "../services/db";
import { type Message, messages } from "../services/db/schema";
import { eq } from "drizzle-orm";
import DatabaseError from "../errors/db.error";

export interface IMessagesRepository {
  saveMessages(newMessages: Message[]): Promise<Message[]>;
  getMessagesByChatId(chatId: string): Promise<Message[]>;
}

class MessagesRepository implements IMessagesRepository {
  private readonly fileName = "messagesRepository";

  async saveMessages(newMessages: Message[]): Promise<Message[]> {
    console.log("newMessages", newMessages);

    try {
      return await db.insert(messages).values(newMessages).returning();
    } catch (error) {
      throw new DatabaseError({
        fileName: this.fileName,
        service: "saveMessages",
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async getMessagesByChatId(chatId: string): Promise<Message[]> {
    try {
      return await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, chatId));
    } catch (error) {
      throw new DatabaseError({
        fileName: this.fileName,
        service: "getMessagesByChatId",
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export default MessagesRepository;
