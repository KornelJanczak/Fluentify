import { db } from "../services/db";
import { type Chat, type Message, chats } from "../services/db/schema";
import { eq } from "drizzle-orm";
import { ServiceError } from "../errors/service.error";

export interface IChatRepository {
  create(newItem: Chat): Promise<string>;
  getById(id: string): Promise<Chat>;
  getByUserId(userId: string): Promise<Chat[]>;
  getChatsByUserId(userId: string): Promise<Chat[]>;
  getChatWithMessagesById(chatId: string): Promise<ChatWithMessages>;
  deleteById(id: string): Promise<string>;
}

class ChatRepository implements IChatRepository {
  public async create(newItem: Chat): Promise<string> {
    try {
      const [chat] = await db
        .insert(chats)
        .values(newItem)
        .returning({ id: chats.id });

      return chat.id;
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async getChatsByUserId(userId: string): Promise<Chat[]> {
    try {
      return await db.select().from(chats).where(eq(chats.userId, userId));
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async getById(id: string): Promise<Chat> {
    try {
      const [item] = await db.select().from(chats).where(eq(chats.id, id));
      return item;
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async getByUserId(userId: string): Promise<Chat[]> {
    try {
      return await db.select().from(chats).where(eq(chats.userId, userId));
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async getChatWithMessagesById(chatId: string): Promise<ChatWithMessages> {
    try {
      return await db.query.chats.findFirst({
        where: eq(chats.id, chatId),
        with: {
          messages: {
            columns: {
              id: true,
              usedTokens: true,
              role: true,
              content: true,
              createdAt: true,
            },
          },
        },
      });
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async deleteById(chatId: string): Promise<string> {
    try {
      const [chat] = await db
        .delete(chats)
        .where(eq(chats.id, chatId))
        .returning({ id: chats.id });

      return chat.id;
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export default ChatRepository;

export type ChatWithMessages = Chat & {
  messages: Omit<Message, "chatId">[];
};
