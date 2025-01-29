import { streamText, CoreMessage, pipeDataStreamToResponse } from "ai";
import { v4 as uuidv4 } from "uuid";
import { customAi } from "@shared/services/ai";
import {
  type IChatRequest,
  type IChatStreamServiceDependencies,
  type IChatStreamService,
  type IOnFinishStream,
} from "../chat.interfaces/chatStream.service.interfaces";
import { IAudioGeneratorService } from "@chat/chat.interfaces/audioGenerator.service.interfaces";
import NotFoundError from "@shared/errors/notFound.error";
import { type IChatRepository } from "@shared/repositories/chat.repository";
import { type IMessagesRepository } from "@shared/repositories/messages.repository";
import { Logger } from "winston";
import { Chat } from "@shared/services/db/schema";
import { ISystemPromptService } from "@chat/chat.interfaces/systemPrompt.service.interface";
import BaseQueue from "@services/queues/base.queue";
import ChatQueue from "@services/queues/chat.queue";

class ChatStreamService implements IChatStreamService {
  private readonly fileName = "chatStream.service";
  private readonly audioGeneratorService: IAudioGeneratorService;
  private readonly systemPromptService: ISystemPromptService;
  private readonly messagesRepository: IMessagesRepository;
  private readonly chatRepository: IChatRepository;
  private readonly chatQueue: ChatQueue;
  private readonly logger: Logger;

  constructor({
    audioGeneratorService,
    systemPromptService,
    messagesRepository,
    chatRepository,
    chatQueue,
    logger,
  }: IChatStreamServiceDependencies) {
    this.audioGeneratorService = audioGeneratorService;
    this.systemPromptService = systemPromptService;
    this.messagesRepository = messagesRepository;
    this.chatRepository = chatRepository;
    this.chatQueue = chatQueue;
    this.logger = logger;
  }

  async startChatStream(chatRequest: IChatRequest): Promise<void> {
    const chat = await this.getChat(chatRequest.chatId);
    const lastUserMessage = this.extractLastUserMessage(chatRequest.messages);

    await this.saveUserMessage(chat.id, lastUserMessage);

    return await this.streamChatToResponse({ ...chatRequest });
  }

  private async getChat(chatId: string): Promise<Chat> {
    const chat = await this.chatRepository.getById(chatId);
    if (!chat) {
      throw new NotFoundError({
        fileName: this.fileName,
        service: "getChat",
        message: "Chat not found",
      });
    }
    return chat;
  }

  private extractLastUserMessage(messages: CoreMessage[]): CoreMessage {
    const lastUserMessage = messages
      .filter((message: CoreMessage) => message.role === "user")
      .at(-1);

    return lastUserMessage;
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

  private async streamChatToResponse(chatRequest: IChatRequest): Promise<void> {
    const {
      res,
      chatId,
      messages,
      vocabularySetId,
      chatCategory,
      chatTopic,
      studyingLanguageLevel,
      tutorId,
    } = chatRequest;

    this.logger.info({
      fileName: this.fileName,
      message: "Start streaming chat...",
      service: "streamChatToResponse",
    });

    const sytemPrompt = await this.systemPromptService.getSystemPrompt({
      studyingLanguageLevel,
      chatCategory,
      chatTopic,
      tutorId,
      vocabularySetId,
    });

    return pipeDataStreamToResponse(res, {
      execute: (streamWriter) => {
        const result = streamText({
          model: customAi("gpt-3.5-turbo"),
          system: sytemPrompt,
          messages,
          onFinish: async ({ text }) =>
            await this.onFinishStream({
              chatId,
              text,
              streamWriter,
              tutorId,
            }),
        });

        return result.mergeIntoDataStream(streamWriter);
      },
    });
  }

  private async onFinishStream({
    chatId,
    text,
    streamWriter,
    tutorId,
  }: IOnFinishStream): Promise<void> {
    const { audioContent } = await this.audioGeneratorService.generateAudio(
      text,
      tutorId
    );

    // await this.messagesRepository.saveMessages([
    //   {
    //     id: uuidv4(),
    //     content: text,
    //     createdAt: new Date(),
    //     role: "assistant",
    //     chatId: chatId,
    //     usedTokens: 0,
    //   },
    // ]);

    streamWriter.writeMessageAnnotation({
      type: "audio",
      data: JSON.stringify(audioContent),
    });

    this.logger.info({
      fileName: this.fileName,
      message: "Finished streaming text",
      service: "onFinishStream",
    });

    this.chatQueue.addChatJob("saveChatMessages", [
      {
        id: uuidv4(),
        content: text,
        createdAt: new Date(),
        role: "assistant",
        chatId: chatId,
        usedTokens: 0,
      },
    ]);
  }
}

export default ChatStreamService;
