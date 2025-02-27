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
import { type IChatRepository } from "@shared/repositories/chat.repository";
import { type IMessagesRepository } from "@shared/repositories/messages.repository";
import { Logger } from "winston";
import { Chat } from "@services/db/schema";
import { ISystemPromptService } from "@chat/chat.interfaces/systemPrompt.service.interface";
import ChatQueue from "@services/queues/chat.queue";
import { BaseCache } from "@services/redis/base.cache";
import { ServiceError } from "@shared/errors/service.error";

class ChatStreamService implements IChatStreamService {
  private readonly audioGeneratorService: IAudioGeneratorService;
  private readonly systemPromptService: ISystemPromptService;
  private readonly messagesRepository: IMessagesRepository;
  private readonly chatRepository: IChatRepository;
  private readonly chatCache: BaseCache;
  private readonly chatQueue: ChatQueue;
  private readonly logger: Logger;

  constructor({
    audioGeneratorService,
    systemPromptService,
    messagesRepository,
    chatRepository,
    chatCache,
    chatQueue,
    logger,
  }: IChatStreamServiceDependencies) {
    this.audioGeneratorService = audioGeneratorService;
    this.systemPromptService = systemPromptService;
    this.messagesRepository = messagesRepository;
    this.chatRepository = chatRepository;
    this.chatCache = chatCache;
    this.chatQueue = chatQueue;
    this.logger = logger;
  }

  public async startChatStream(chatRequest: IChatRequest): Promise<void> {
    // Check if chat exists
    const chat = await this.getChat(chatRequest.chatId);

    // Extract last user message
    const lastUserMessage = this.extractLastUserMessage(chatRequest.messages);

    // Save user message
    await this.saveMessage(chat.id, lastUserMessage);

    // Get system prompt to start the conversation
    const sytemPrompt = await this.systemPromptService.getSystemPrompt({
      tutorId: chatRequest.tutorId,
      chatCategory: chat.category,
      chatTopic: chat.topic,
      studyingLanguageLevel: chatRequest.studyingLanguageLevel,
      vocabularySetId: chatRequest.vocabularySetId,
    });

    // Start chat with AI
    return await this.streamChatToResponse(chatRequest, sytemPrompt);
  }

  private async getChat(chatId: string): Promise<Chat> {
    const chat = await this.chatRepository.getById(chatId);

    if (!chat)
      throw ServiceError.NotFound({
        message: `Chat ${chatId} not found`,
      });

    return chat;
  }

  private extractLastUserMessage(messages: CoreMessage[]): CoreMessage {
    const lastUserMessage = messages
      .filter((message: CoreMessage) => message.role === "user")
      .at(-1);

    return lastUserMessage;
  }

  private async streamChatToResponse(
    chatRequest: IChatRequest,
    systemPrompt: string
  ): Promise<void> {
    const { res, chatId, messages, tutorId } = chatRequest;

    return pipeDataStreamToResponse(res, {
      execute: async (streamWriter) => {
        const result = streamText({
          model: customAi("gpt-3.5-turbo"),
          system: systemPrompt,
          messages,
          onFinish: async ({ text, usage }) =>
            await this.onFinishStream({
              chatId,
              content: text,
              streamWriter,
              tutorId,
              usedTokens: Number(usage),
            }),
        });

        // for await (const part of result.fullStream) {
        //   const error = part.type.includes("error");

        //   if (error)

        return result.mergeIntoDataStream(streamWriter);
      },
    });
  }

  private async onFinishStream({
    chatId,
    content,
    streamWriter,
    tutorId,
    usedTokens,
  }: IOnFinishStream): Promise<void> {
    const { audioContent } = await this.audioGeneratorService.generateAudio(
      content,
      tutorId
    );

    // Attache audio content to the stream
    streamWriter.writeMessageAnnotation({
      type: "audio",
      data: JSON.stringify(audioContent),
    });

    // this.chatQueue.addChatJob("saveChatMessages", [
    //   {
    //     id: uuidv4(),
    //     content: text,
    //     createdAt: new Date(),
    //     role: "assistant",
    //     chatId: chatId,
    //     usedTokens: 0,
    //   },
    // ]);

    await this.saveAssistantMessage(chatId, content);
    // await this.saveMessage(chatId, { content, role: "assistant" }, usedTokens);
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

  private async saveAssistantMessage(
    chatId: string,
    text: string
  ): Promise<void> {
    await this.messagesRepository.saveMessages([
      {
        id: uuidv4(),
        content: text,
        role: "assistant",
        createdAt: new Date(),
        chatId: chatId,
        usedTokens: 0,
      },
    ]);
  }

  private async saveMessage(
    chatId: string,
    message: CoreMessage,
    usedTokens?: number
  ): Promise<void> {
    await this.messagesRepository.saveMessages([
      {
        id: uuidv4(),
        ...message,
        createdAt: new Date(),
        chatId: chatId,
        usedTokens: usedTokens,
      },
    ]);
  }
}

export default ChatStreamService;
