import { Injectable } from '@nestjs/common';
import { Chat } from 'src/shared/db/db.schema';
import { ServiceError } from 'src/common/service-error';
import { ChatRepository } from 'src/shared/repositories/chat.repository';
import { CreateChatDto, FindWithMessagesByIdResponseDto } from './chat.dto';

@Injectable()
export class ChatService {
  constructor(private chatRepository: ChatRepository) {}

  public async create(
    createChatDto: CreateChatDto,
    userId: string,
  ): Promise<string> {
    const newChatId = await this.chatRepository.create(createChatDto, userId);

    if (!newChatId)
      throw ServiceError.NotFoundError('Chat has not been created');

    return newChatId;
  }

  public async findAllByUserId(userId: string): Promise<Chat[]> {
    // Removed Redis cache condition
    const chats = await this.chatRepository.findAllByUserId(userId);
    const isNoChatsAvailable = !chats || chats.length === 0;

    if (isNoChatsAvailable)
      throw ServiceError.NotFoundError(`User ${userId} has no chats`);

    // Removed Redis cache addition

    return chats;
  }

  public async findById(chatId: string): Promise<Chat> {
    const chat = await this.chatRepository.findById(chatId);

    if (!chat) throw ServiceError.NotFoundError(`Chat ${chatId} not found`);

    return chat;
  }

  public async findWithMessagesById(
    chatId: string,
  ): Promise<FindWithMessagesByIdResponseDto> {
    return await this.chatRepository.findWithMessagesById(chatId);
  }

  public async deleteById(chatId: string): Promise<string> {
    const deletedChatId = await this.chatRepository.deleteById(chatId);

    if (!deletedChatId)
      throw ServiceError.DeletionError(`Chat ${chatId} has not been deleted`);

    return deletedChatId;
  }
}
