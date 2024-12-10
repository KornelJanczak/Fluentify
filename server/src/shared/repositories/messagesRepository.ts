import { db } from "../db";
import { type Message, messages } from "../db/schema";
import { eq } from "drizzle-orm";
import DatabaseError from "../errors/dbError";
import BaseRepository from "./baseRepository";
import { PgColumn, PgTable, TableConfig } from "drizzle-orm/pg-core";

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
        service,
        ...error,
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
        service,
        ...error,
      });
    }
  }
}

const messagesRepository = new MessagesRepository(messages, messages.id);
export default messagesRepository;
