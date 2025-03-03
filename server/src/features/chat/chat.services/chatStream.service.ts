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
import { type Message } from "@shared/services/db/schema";
import { type IChatRepository } from "@shared/repositories/chat.repository";
import { type IMessagesRepository } from "@shared/repositories/messages.repository";
import { Chat } from "@services/db/schema";
import { ISystemPromptService } from "@chat/chat.interfaces/systemPrompt.service.interface";
import { ServiceError } from "@shared/errors/service.error";
import { IAudioUploaderService } from "@chat/chat.interfaces/audioUploader.service.interfaces";

class ChatStreamService implements IChatStreamService {
  private readonly audioGeneratorService: IAudioGeneratorService;
  private readonly systemPromptService: ISystemPromptService;
  private readonly audioUploaderService: IAudioUploaderService;
  private readonly messagesRepository: IMessagesRepository;
  private readonly chatRepository: IChatRepository;

  constructor({
    audioGeneratorService,
    systemPromptService,
    audioUploaderService,
    messagesRepository,
    chatRepository,
  }: IChatStreamServiceDependencies) {
    this.audioGeneratorService = audioGeneratorService;
    this.systemPromptService = systemPromptService;
    this.audioUploaderService = audioUploaderService;
    this.messagesRepository = messagesRepository;
    this.chatRepository = chatRepository;
  }

  public async startChatStream(chatRequest: IChatRequest): Promise<void> {
    const chat = await this.getChat(chatRequest.chatId);
    const lastUserMessage = this.extractLastUserMessage(chatRequest.messages);
    await this.saveMessage(chat.id, lastUserMessage, null);

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
    return messages
      .filter((message: CoreMessage) => message.role === "user")
      .at(-1);
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
          onFinish: async ({ text, usage }) => {
            await this.onFinishStream({
              chatId,
              content: text,
              streamWriter,
              tutorId,
              usedTokens: usage.totalTokens,
            });
          },
        });
        
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

    streamWriter.writeMessageAnnotation({
      type: "audio",
      data: JSON.stringify(audioContent),
    });

    const messageId = await this.saveMessage(
      chatId,
      { content, role: "assistant" },
      usedTokens
    );

    await this.audioUploaderService.uploadAudio(audioContent, messageId);
  }

  private async saveMessage(
    chatId: string,
    message: CoreMessage,
    usedTokens?: number
  ): Promise<string> {
    return await this.messagesRepository.saveMessages([
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
