import {
  streamText,
  CoreMessage,
  DataStreamWriter,
  pipeDataStreamToResponse,
} from "ai";
import { v4 as uuidv4 } from "uuid";
import { customAi } from "@shared/services/ai";
import {
  IAudioGeneratorService,
  IChatStreamServiceDependencies,
  type IChatStreamService,
} from "@chat/chat.interfaces";
import { type Response } from "express";
import NotFoundError from "@shared/errors/notFoundError";
import { type IChatRepository } from "@shared/repositories/chatRepository";
import { type IMessagesRepository } from "@shared/repositories/messagesRepository";
import { Logger } from "winston";

class ChatStreamService implements IChatStreamService {
  private readonly audioGeneratorService: IAudioGeneratorService;
  private readonly messagesRepository: IMessagesRepository;
  private readonly chatRepository: IChatRepository;
  private readonly fileName = "chatStream.service";
  private logger: Logger;
  private systemPrompt: string;

  constructor({
    audioGeneratorService,
    messagesRepository,
    chatRepository,
    logger,
    systemPrompt,
  }: IChatStreamServiceDependencies) {
    this.audioGeneratorService = audioGeneratorService;
    this.messagesRepository = messagesRepository;
    this.chatRepository = chatRepository;
    this.logger = logger;
    this.systemPrompt = systemPrompt;
  }

  async startChatStream(
    res: Response,
    chatId: string,
    messages: CoreMessage[]
  ): Promise<void> {
    const chat = await this.chatRepository.getById(chatId);

    console.log(chat);

    if (!chat)
      throw new NotFoundError({
        fileName: this.fileName,
        service: "execute",
        message: "Chat not found",
      });

    const lastUserMessage = this.extractLastUserMessage(messages);

    await this.messagesRepository.saveMessages([
      {
        id: uuidv4(),
        ...lastUserMessage,
        createdAt: new Date(),
        chatId: chatId,
        usedTokens: 0,
      },
    ]);

    this.streamChatToResponse(res, chatId, messages);
  }

  private streamChatToResponse(
    res: Response,
    chatId: string,
    messages: CoreMessage[]
  ): void {
    this.logger.info({
      message: "Start streaming chat...",
      service: "streamChatToResponse",
    });

    return pipeDataStreamToResponse(res, {
      execute: (streamWriter) => {
        const result = streamText({
          model: customAi("gpt-3.5-turbo"),
          system: this.systemPrompt,
          messages,
          onFinish: async ({ text }) =>
            await this.onFinishStream(chatId, text, streamWriter),
        });

        return result.mergeIntoDataStream(streamWriter);
      },
    });
  }

  private async onFinishStream(
    chatId: string,
    text: string,
    streamWriter: DataStreamWriter
  ): Promise<void> {
    this.logger.info({
      message: "Finished streaming text",
      service: "onFinishStream",
    });

    const { audioContent } = await this.audioGeneratorService.generateAudio(
      text
    );

    await this.messagesRepository.saveMessages([
      {
        id: uuidv4(),
        content: text,
        createdAt: new Date(),
        role: "assistant",
        chatId: chatId,
        usedTokens: 0,
      },
    ]);

    streamWriter.writeMessageAnnotation({
      type: "audio",
      data: JSON.stringify(audioContent),
    });
  }

  private extractLastUserMessage(messages: CoreMessage[]): CoreMessage {
    const lastUserMessage = messages
      .filter((message: CoreMessage) => message.role === "user")
      .at(-1);

    return lastUserMessage;
  }
}

export default ChatStreamService;
