import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
  Res,
} from '@nestjs/common';
import { ChatService } from './chat.service';
// import { ChatStreamService } from './chat-stream.service';
import { GoogleAuthGuard } from '../auth/strategies/google.guard';
import { UserId } from 'src/common/decorators/user-id.decorator';
import {
  CreateChatDto,
  FindAllByUserIdResponseDto,
  FindOneByIdResponseDto,
  FindWithMessagesByIdResponseDto,
  StartChatDto,
} from './chat.dto';
import { ChatStreamService } from './services/chat-stream.service';
import { User } from 'src/common/decorators/user.decorator';
import type { User as UserType } from 'src/shared/db/db.schema';
import { Response } from 'express';

@Controller('chat')
@UseGuards(GoogleAuthGuard)
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(
    private chatService: ChatService,
    private chatStreamService: ChatStreamService,
  ) {}

  @Post('start-chat')
  public async startChat(
    @Body() startChatDto: StartChatDto,
    @User() user: UserType,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`User ${user.id} is starting chat stream`);

    return await this.chatStreamService.startStream({
      tutorId: user.tutorId,
      studyingLanguageLevel: user.studyingLanguageLevel,
      res,
      ...startChatDto,
    });
  }

  @Post('create-chat')
  public async create(
    @Body() createChatDto: CreateChatDto,
    @UserId() userId: string,
  ): Promise<string> {
    console.log('createChatDto', createChatDto);

    const chatId = await this.chatService.create(createChatDto, userId);

    this.logger.log(`User ${userId} has created chat ${chatId}`);

    return chatId;
  }

  @Get()
  public async findAllByUserId(
    @UserId() userId: string,
  ): Promise<FindAllByUserIdResponseDto[]> {
    const chats = await this.chatService.findAllByUserId(userId);

    this.logger.log(
      `User ${userId} gets chats by user id, : ${JSON.stringify(chats)}`,
    );

    return chats;
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<FindOneByIdResponseDto> {
    const chat = await this.chatService.findById(id);

    this.logger.log(`Chat ${chat.id} has been found`);

    return chat;
  }

  @Get(':id/messages')
  public async findWithMessagesById(
    @Param('id') id: string,
  ): Promise<FindWithMessagesByIdResponseDto> {
    const chat = await this.chatService.findWithMessagesById(id);

    this.logger.log(
      `Messages for chat ${id} have been found, messages: ${chat.messages.length}`,
    );

    return chat;
  }

  @Delete(':id')
  public async deleteById(
    @Param('id') id: string,
    @UserId() userId: string,
  ): Promise<{ deletedChatId: string }> {
    const deletedChatId = await this.chatService.deleteById(id);

    this.logger.log(`Chat ${deletedChatId} has been deleted by user ${userId}`);

    return { deletedChatId };
  }
}
