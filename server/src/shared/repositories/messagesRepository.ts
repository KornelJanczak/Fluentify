import { db } from "../services/db";
import { type Message, messages } from "../services/db/schema";
import { eq } from "drizzle-orm";
import DatabaseError from "../errors/dbError";
import BaseRepository from "./baseRepository";
import { PgColumn, PgTable, TableConfig } from "drizzle-orm/pg-core";

const fileName = "messagesRepository";

class MessagesRepository extends BaseRepository<Message> {
  protected table: PgTable<TableConfig>;
  protected idColumn: PgColumn;

  constructor(table: PgTable<TableConfig>, idColumn: PgColumn) {
    super();
    this.table = table;
    this.idColumn = idColumn;
  }

  async saveMessages({
    messages,
    service,
  }: {
    service: string;
    messages: Message[];
  }) {
    try {
      return await db.insert(this.table).values(messages).returning();
    } catch (error) {
      throw new DatabaseError({
        fileName,
        service,
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async getMessagesByChatId({
    chatId,
    service,
  }: {
    chatId: string;
    service: string;
  }) {
    try {
      return await db
        .select()
        .from(this.table)
        .where(eq(messages.chatId, chatId));
    } catch (error) {
      throw new DatabaseError({
        fileName,
        service,
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

const messagesRepository = new MessagesRepository(messages, messages.id);
export default messagesRepository;
