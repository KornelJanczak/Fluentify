import { CoreMessage } from "ai";
import { Response } from "express";
import { IChatRepository } from "@shared/repositories/chat.repository";
import { IMessagesRepository } from "@shared/repositories/messages.repository";
import { Logger } from "winston";
import { IFlashCardRepository } from "@shared/repositories/flashCard.repository";
import { DataStreamWriter } from "ai";
import { IAudioGeneratorService } from "./audioGenerator.service.interfaces";
import { ITopicPromptFactory } from "./topicPrompt.service.interfaces";
import { ISystemPromptService } from "./systemPrompt.service.interface";
import BaseQueue from "@services/queues/base.queue";
import ChatQueue from "@services/queues/chat.queue";
import { BaseCache } from "@services/redis/base.cache";

export interface IChatStreamService {
  startChatStream({
    res,
    chatId,
    messages,
    userId,
  }: IChatRequest): Promise<void>;
}

export interface IChatRequest {
  res: Response;
  chatId: string;
  tutorId: string;
  messages: CoreMessage[];
  userId: string;
  chatCategory: string;
  chatTopic: string;
  studyingLanguageLevel: string;
  vocabularySetId?: string;
}

export interface IChatStreamServiceDependencies {
  audioGeneratorService: IAudioGeneratorService;
  systemPromptService: ISystemPromptService;
  chatRepository: IChatRepository;
  messagesRepository: IMessagesRepository;
  flashCardRepository: IFlashCardRepository;
  chatCache: BaseCache;
  chatQueue: ChatQueue;
  messages: CoreMessage[];
  chatId: string;
  logger: Logger;
}

export interface IOnFinishStream {
  chatId: string;
  text: string;
  streamWriter: DataStreamWriter;
  tutorId: string;
}
