import { CoreMessage } from "ai";
import { Request, Response } from "express";
import * as googleCloud from "@google-cloud/text-to-speech";
import { IChatRepository } from "@shared/repositories/chatRepository";
import { IMessagesRepository } from "@shared/repositories/messagesRepository";
import { ITutorProfileRepository } from "@shared/repositories/tutorProfileRepository";
import TopicPromptBase from "./chat.services/topicPrompt.service/topicPromptBase";
import { Logger } from "winston";
import { IFlashCardRepository } from "@shared/repositories/flashCardRepository";
import { DataStreamWriter } from "ai";

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
  tutorId: string;
  messages: CoreMessage[];
  userId: string;
  chatCategory: string;
  chatTopic: string;
  vocabularySetId?: string;
}

export interface IChatStreamServiceDependencies {
  audioGeneratorService: IAudioGeneratorService;
  topicPromptFactory: ITopicPromptFactory;
  chatRepository: IChatRepository;
  messagesRepository: IMessagesRepository;
  flashCardRepository: IFlashCardRepository;
  messages: CoreMessage[];
  chatId: string;
  logger: Logger;
}

export interface IOnFinishStream {
  chatId: string;
  text: string;
  streamWriter: DataStreamWriter;
  userId: string;
  tutorId: string;
}

export interface IAudioGeneratorService {
  generateAudio(text: string, tutorId: string): Promise<IAudioContent>;
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

export interface IVoice
  extends googleCloud.protos.google.cloud.texttospeech.v1.IVoice {}

export interface ITopicPromptBaseDependencies {
  // logger: Logger;
  topic: string;
}

export interface IVocabPraticePromptDependencies
  extends ITopicPromptBaseDependencies {
  // flashCardRepository: IFlashCardRepository;
}

export interface ITopicPromptFactory {
  createTopicPrompt: (category: string, topic: string) => TopicPromptBase;
}

export interface ITopicPromptFactoryDependencies {
  category: string;
  topic: string;
}

export interface ITutorPromptService {
  getTutor(tutorId: string, studyingLanguageLevel: string): string;
}
