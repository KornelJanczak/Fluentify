import { Inject, Injectable } from '@nestjs/common';
import { streamText, CoreMessage, pipeDataStreamToResponse } from 'ai';
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
import * as uuid from 'uuid';

@Injectable()
export class ChatStreamService {
  constructor(
    @Inject(AiProvider) private AI: OpenAIProvider,
    private audioGeneratorService: AudioGeneratorService,
    private systemPromptService: SystemPromptService,
    private audioUploaderService: AudioUploaderService,
    private chatRepository: ChatRepository,
  ) {}

  public async startStream(
    startStreamRequest: StartStreamRequest,
  ): Promise<void> {
    const { chatId, messages } = startStreamRequest;

    const chat = await this.findChatById(chatId);

    const lastUserMessage = this.extractLastUserMessage(messages);

    await this.chatRepository.saveMessages({
      chatId: chat.id,
      ...lastUserMessage,
      usedTokens: null,
    });

    // Get system prompt to start the conversation
    const systemPrompt = await this.systemPromptService.getSystemPrompt({
      userId: chat.userId,
      chatCategory: chat.category,
      chatTopic: chat.topic,
      vocabularySetId: chat.vocabularySetId,
    });

    // Start chat with AI
    return this.streamToResponse(chat.userId, startStreamRequest, systemPrompt);
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
    userId: string,
    startStreamRequest: StartStreamRequest,
    systemPrompt: string,
  ): void {
    const { res, chatId, messages } = startStreamRequest;

    return pipeDataStreamToResponse(res, {
      execute: (streamWriter) => {
        const result = streamText({
          model: this.AI('gpt-3.5-turbo'),
          experimental_generateMessageId: uuid.v4,
          system: systemPrompt,
          messages,
          onFinish: async ({ text, response, usage }) => {
            await this.onFinishStream({
              userId,
              chatId,
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

  private async onFinishStream(
    onFinishStreamArgs: OnFinishStreamArgs,
  ): Promise<void> {
    const { chatId, content, streamWriter, usedTokens, messageId, userId } =
      onFinishStreamArgs;

    const { audioContent } = await this.audioGeneratorService.generateAudio(
      content,
      userId,
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
