import { CoreMessage } from "ai";
import { Request, Response } from "express";
import * as googleCloud from "@google-cloud/text-to-speech";
import { IChatRepository } from "@shared/repositories/chatRepository";
import { IMessagesRepository } from "@shared/repositories/messagesRepository";
import { ITutorProfileRepository } from "@shared/repositories/tutorProfileRepository";
import { IFlashCardRepository } from "@shared/repositories/flashCardRepository";
import { Logger } from "winston";
import { int } from "drizzle-orm/mysql-core";

export interface IChatController {
  startChat(req: Request, res: Response): void;
  createChat(req: Request, res: Response): void;
  getChat(req: Request, res: Response): void;
  getMessagesByChatId(req: Request, res: Response): void;
}

export interface IChatControllerDependencies {
  chatRepository: IChatRepository;
  messagesRepository: IMessagesRepository;
  chatStreamService: IChatStreamService;
}

export interface IMainServiceConstructorProps {
  audioGeneratorService: IAudioGeneratorService;
  chatStreamService: IChatStreamService;
  messages: CoreMessage[];
  chatId: string;
  userId: string;
}

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
  messages: CoreMessage[];
  userId: string;
  chatCategory: string;
  chatTopic: string;
  vocabularySetId?: string;
}

export interface IChatStreamServiceDependencies {
  audioGeneratorService: IAudioGeneratorService;
  chatRepository: IChatRepository;
  messagesRepository: IMessagesRepository;
  messages: CoreMessage[];
  chatId: string;
  logger: Logger;
  systemPrompt: string;
}

export interface IAudioGeneratorService {
  generateAudio(text: string, userId: string): Promise<IAudioContent>;
}

export interface IAudioGeneratorServiceDependencies {
  userId: string;
  logger: Logger;
  tutorProfileRepository: ITutorProfileRepository;
}

export interface IGenerateAudioRequest
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechRequest {}

export interface IAudioContent
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechResponse {}

export interface ITopicPromptBaseDependencies {
  // logger: Logger;
  topic: string;
}

export interface IVocabPraticePromptDependencies
  extends ITopicPromptBaseDependencies {
  flashCardRepository: IFlashCardRepository;
}

export interface ITopicPromptFactoryDependencies {
  category: string;
  topic: string;
}
