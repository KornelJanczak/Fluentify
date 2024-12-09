import { db } from "../db";
import { type Chat, chats } from "../db/schema";
import { eq } from "drizzle-orm";
import DatabaseError from "../errors/dbError";
import BaseRepository from "./baseRepository";
import { PgColumn, PgTable, TableConfig } from "drizzle-orm/pg-core";

class ChatRepository extends BaseRepository<Chat> {
  protected table: PgTable<TableConfig>;
  protected idColumn: PgColumn;

  constructor(table: PgTable<TableConfig>, idColumn: PgColumn) {
    super();
    this.table = table;
    this.idColumn = idColumn;
  }

  async getByUserId(userId: string): Promise<Chat[]> {
    try {
      const chatList: Chat[] = await db
        .select()
        .from(chats)
        .where(eq(chats.userId, userId));

      return chatList;
    } catch (error) {
      throw new DatabaseError({
        service: "chatRepository: getByUserId",
        ...error,
      });
    }
  }
}

const chatRepository = new ChatRepository(chats, chats.id);
export default chatRepository;
