import { type Chat, type Message, chats, messages } from '../db/db.schema';
import { eq } from 'drizzle-orm';
import { ServiceError } from 'src/common/service-error';
import { Inject, Injectable } from '@nestjs/common';
import { Drizzle, DrizzleAsyncProvider } from '../db/db.provider';
import {
  CreateChatDto,
  FindWithMessagesByIdResponseDto,
} from 'src/modules/chat/chat.dto';

@Injectable()
export class ChatRepository {
  constructor(@Inject(DrizzleAsyncProvider) private db: Drizzle) {}

  public async create(
    createChatDto: CreateChatDto,
    userId: string,
  ): Promise<string> {
    const newChat = {
      ...createChatDto,
      userId,
    };

    console.log('newChat', newChat);

    try {
      const [chat] = await this.db
        .insert(chats)
        .values(newChat)
        .returning({ id: chats.id });

      return chat.id;
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async findAllByUserId(userId: string): Promise<Chat[]> {
    try {
      return await this.db.select().from(chats).where(eq(chats.userId, userId));
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async findById(id: string): Promise<Chat> {
    try {
      const [item] = await this.db.select().from(chats).where(eq(chats.id, id));
      return item;
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async findWithMessagesById(
    chatId: string,
  ): Promise<FindWithMessagesByIdResponseDto> {
    try {
      return await this.db.query.chats.findFirst({
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
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async deleteById(chatId: string): Promise<string> {
    try {
      const [chat] = await this.db
        .delete(chats)
        .where(eq(chats.id, chatId))
        .returning({ id: chats.id });

      return chat.id;
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async saveMessages(newMessages: Message[]): Promise<string> {
    try {
      const [{ id }] = await this.db
        .insert(messages)
        .values(newMessages)
        .returning({ id: messages.id });
      return id;
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }
}

export type ChatWithMessages = Chat & {
  messages: Omit<Message, 'chatId'>[];
};
