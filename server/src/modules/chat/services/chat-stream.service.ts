import { Inject, Injectable } from '@nestjs/common';
import { streamText, CoreMessage, pipeDataStreamToResponse } from 'ai';
import { ServiceError } from 'src/common/service-error';
import { ChatRepository } from 'src/shared/repositories/chat.repository';
import { SystemPromptService } from './system-prompt.service';
import { AudioGeneratorService } from './audio-generator.service';
import type {
  OnFinishStreamArgs,
  StartStreamRequest,
  StreamToResponseArgs,
} from '../chat.interfaces';
import { AiProvider } from 'src/shared/ai/ai.provider';
import { OpenAIProvider } from '@ai-sdk/openai';
import { AudioUploaderService } from './audio-uploader.service';
import * as uuid from 'uuid';
import { ChatService } from '../chat.service';

@Injectable()
export class ChatStreamService {
  constructor(
    @Inject(AiProvider) private AI: OpenAIProvider,
    private audioGeneratorService: AudioGeneratorService,
    private systemPromptService: SystemPromptService,
    private audioUploaderService: AudioUploaderService,
    private chatRepository: ChatRepository,
    private chatService: ChatService,
  ) {}

  public async startStream(
    startStreamRequest: StartStreamRequest,
  ): Promise<void> {
    const { chatId, messages } = startStreamRequest;

    const { settings, ...chat } =
      await this.chatService.findWithSettingsById(chatId);

    const lastUserMessage = this.extractLastUserMessage(messages);

    await this.chatRepository.saveMessages({
      chatId: chat.id,
      ...lastUserMessage,
      usedTokens: null,
    });

    // Get system prompt to start the conversation
    const systemPrompt = await this.systemPromptService.getSystemPrompt({
      tutorId: settings.tutorId,
      learningLanguageLevel: settings.learningLanguageLevel,
      learningLanguage: settings.learningLanguage,
      chatCategory: chat.category,
      chatTopic: chat.topic,
      vocabularySetId: chat.vocabularySetId,
    });

    // Start chat with AI
    return this.streamToResponse({
      systemPrompt,
      startStreamRequest,
      tutorId: settings.tutorId,
      learningLanguage: settings.learningLanguage,
    });
  }

  private extractLastUserMessage(messages: CoreMessage[]): CoreMessage {
    return messages
      .filter((message: CoreMessage) => message.role === 'user')
      .at(-1);
  }

  private streamToResponse({
    systemPrompt,
    tutorId,
    learningLanguage,
    startStreamRequest: { chatId, messages, res },
  }: StreamToResponseArgs): void {
    return pipeDataStreamToResponse(res, {
      execute: (streamWriter) => {
        const result = streamText({
          model: this.AI('gpt-3.5-turbo'),
          experimental_generateMessageId: uuid.v4,
          system: systemPrompt,
          messages,
          onFinish: async ({ text, response, usage }) => {
            await this.onFinishStream({
              chatId,
              tutorId,
              learningLanguage: learningLanguage,
              messageId: response.messages[0].id,
              content: text,
              streamWriter,
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

  private async onFinishStream({
    chatId,
    content,
    streamWriter,
    usedTokens,
    messageId,
    tutorId,
    learningLanguage,
  }: OnFinishStreamArgs): Promise<void> {
    const { audioContent } = await this.audioGeneratorService.generateAudio(
      tutorId,
      learningLanguage,
      content,
    );

    streamWriter.writeMessageAnnotation({
      type: 'audio',
      data: JSON.stringify(audioContent),
    });

    const savedMessageId = await this.chatRepository.saveMessages({
      id: messageId,
      chatId,
      content,
      role: 'assistant',
      usedTokens,
    });

    await this.audioUploaderService.uploadAudio(audioContent, savedMessageId);
  }
}
