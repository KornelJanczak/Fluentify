import { db } from "../services/db";
import { type Message, messages } from "../services/db/schema";
import { eq } from "drizzle-orm";
import DatabaseError from "../errors/dbError";
import { PgColumn, PgTable, TableConfig } from "drizzle-orm/pg-core";

const fileName = "messagesRepository";

class MessagesRepository {
  protected table: PgTable<TableConfig>;
  protected idColumn: PgColumn;

  async saveMessages(newMessages: Message[]): Promise<Message[]> {
    try {
      return await db.insert(messages).values(newMessages).returning();
    } catch (error) {
      throw new DatabaseError({
        fileName,
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
        fileName,
        service: "getMessagesByChatId",
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export const messagesRepository = new MessagesRepository();
