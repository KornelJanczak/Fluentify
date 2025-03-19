import { Inject, Injectable, Scope } from '@nestjs/common';
import { streamText, CoreMessage, pipeDataStreamToResponse } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { ServiceError } from 'src/common/service-error';
import { ChatRepository } from 'src/shared/repositories/chat.repository';
import { SystemPromptService } from './system-prompt.service';
import { AudioGeneratorService } from './audio-generator.service';
import type { Chat } from 'src/shared/db/db.schema';
import type {
  OnFinishStreamArgs,
  StartStreamRequest,
} from '../chat.interfaces';
import { AiProvider } from 'src/shared/ai/ai.provider';
import { OpenAIProvider } from '@ai-sdk/openai';
import { AudioUploaderService } from './audio-uploader.service';

@Injectable({ scope: Scope.REQUEST })
export class ChatStreamService {
  constructor(
    @Inject(AiProvider) private AI: OpenAIProvider,
    private audioGeneratorService: AudioGeneratorService,
    private systemPromptService: SystemPromptService,
    private chatRepository: ChatRepository,
    private audioUploaderService: AudioUploaderService,
  ) {}

  public async startStream(
    startStreamRequest: StartStreamRequest,
  ): Promise<void> {
    const { chatId, messages, tutorId, studyingLanguageLevel } =
      startStreamRequest;

    const chat = await this.findChatById(chatId);

    const lastUserMessage = this.extractLastUserMessage(messages);

    await this.saveMessage(chat.id, lastUserMessage, null);

    // Get system prompt to start the conversation
    const systemPrompt = await this.systemPromptService.getSystemPrompt({
      tutorId: tutorId,
      studyingLanguageLevel: studyingLanguageLevel,
      chatCategory: chat.category,
      chatTopic: chat.topic,
      vocabularySetId: chat.vocabularySetId,
    });

    // Start chat with AI
    return this.streamToResponse(startStreamRequest, systemPrompt);
  }

  private async findChatById(chatId: string): Promise<Chat> {
    const chat = await this.chatRepository.findById(chatId);

    if (!chat) throw ServiceError.NotFoundError(`Chat ${chatId} not found`);

    return chat;
  }

  private extractLastUserMessage(messages: CoreMessage[]): CoreMessage {
    return messages
      .filter((message: CoreMessage) => message.role === 'user')
      .at(-1);
  }

  private streamToResponse(
    startStreamRequest: StartStreamRequest,
    systemPrompt: string,
  ): void {
    const { res, chatId, messages, tutorId } = startStreamRequest;

    return pipeDataStreamToResponse(res, {
      execute: (streamWriter) => {
        const result = streamText({
          model: this.AI('gpt-3.5-turbo'),
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
          onError: () => {
            throw ServiceError.ExternalServiceError('Stream to response error');
          },
        });

        return result.mergeIntoDataStream(streamWriter);
      },
    });
  }

  private async onFinishStream(
    onFinishStreamArgs: OnFinishStreamArgs,
  ): Promise<void> {
    const { chatId, content, streamWriter, tutorId, usedTokens } =
      onFinishStreamArgs;

    const { audioContent } = await this.audioGeneratorService.generateAudio(
      content,
      tutorId,
    );

    streamWriter.writeMessageAnnotation({
      type: 'audio',
      data: JSON.stringify(audioContent),
    });

    const messageId = await this.saveMessage(
      chatId,
      { content, role: 'assistant' },
      usedTokens,
    );

    await this.audioUploaderService.uploadAudio(audioContent, messageId);
  }

  private async saveMessage(
    chatId: string,
    message: CoreMessage,
    usedTokens?: number,
  ): Promise<string> {
    return await this.chatRepository.saveMessages([
      {
        id: uuidv4(),
        ...message,
        createdAt: new Date(),
        chatId,
        usedTokens,
      },
    ]);
  }
}
