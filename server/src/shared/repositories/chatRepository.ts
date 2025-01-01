import { db } from "../services/db";
import { type Chat, chats } from "../services/db/schema";
import { eq } from "drizzle-orm";
import DatabaseError from "../errors/dbError";

export interface IChatRepository {
  create(newItem: Chat): Promise<Chat>;
  getById(id: string): Promise<Chat>;
  getByUserId(userId: string): Promise<Chat[]>;
}

class ChatRepository implements IChatRepository {
  private readonly fileName = "chatRepository";
  async create(newItem: Chat): Promise<Chat> {
    try {
      const [createdItem] = await db.insert(chats).values(newItem).returning();

      return createdItem;
    } catch (error) {
      throw new DatabaseError({
        fileName: this.fileName,
        service: "create",
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async getById(id: string): Promise<Chat> {
    try {
      const [item] = await db.select().from(chats).where(eq(chats.id, id));

      return item;
    } catch (error) {
      throw new DatabaseError({
        fileName: this.fileName,
        service: "getById",
        message: error.message,
        stack: error.stack,
      });
    }
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
        fileName: this.fileName,
        service: "getByUserId",
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export default ChatRepository;

// export const chatRepository = new ChatRepository();
