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
  IChatRequest,
  IChatStreamServiceDependencies,
  type IChatStreamService,
} from "@chat/chat.interfaces";
import NotFoundError from "@shared/errors/notFoundError";
import { type IChatRepository } from "@shared/repositories/chatRepository";
import { type IMessagesRepository } from "@shared/repositories/messagesRepository";
import { Logger } from "winston";
import { Chat } from "@shared/services/db/schema";

class ChatStreamService implements IChatStreamService {
  private readonly audioGeneratorService: IAudioGeneratorService;
  private readonly messagesRepository: IMessagesRepository;
  private readonly chatRepository: IChatRepository;
  private readonly fileName = "chatStream.service";
  private readonly logger: Logger;
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

  async startChatStream(chatRequest: IChatRequest): Promise<void> {
    const chat = await this.getChat(chatRequest.chatId);
    const lastUserMessage = this.extractLastUserMessage(chatRequest.messages);

    await this.saveUserMessage(chat.id, lastUserMessage);

    this.streamChatToResponse({ ...chatRequest });
  }

  private async saveUserMessage(
    chatId: string,
    message: CoreMessage
  ): Promise<void> {
    await this.messagesRepository.saveMessages([
      {
        id: uuidv4(),
        ...message,
        createdAt: new Date(),
        chatId: chatId,
        usedTokens: 0,
      },
    ]);
  }

  private async getChat(chatId: string): Promise<Chat> {
    const chat = await this.chatRepository.getById(chatId);
    if (!chat) {
      throw new NotFoundError({
        fileName: "chatStream.service",
        service: "getChat",
        message: "Chat not found",
      });
    }
    return chat;
  }

  private streamChatToResponse(chatRequest: IChatRequest): void {
    const { res, chatId, messages, userId } = chatRequest;
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
            await this.onFinishStream(chatId, text, streamWriter, userId),
        });

        return result.mergeIntoDataStream(streamWriter);
      },
    });
  }

  private async onFinishStream(
    chatId: string,
    text: string,
    streamWriter: DataStreamWriter,
    userId: string
  ): Promise<void> {
    this.logger.info({
      message: "Finished streaming text",
      service: "onFinishStream",
    });

    const { audioContent } = await this.audioGeneratorService.generateAudio(
      text,
      userId
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
