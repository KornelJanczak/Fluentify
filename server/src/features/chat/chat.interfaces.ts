import { StreamTextResult, CoreTool, CoreMessage } from "ai";
import { Request, Response, NextFunction } from "express";
import * as googleCloud from "@google-cloud/text-to-speech";
import { IChatRepository } from "@shared/repositories/chatRepository";
import { IMessagesRepository } from "@shared/repositories/messagesRepository";
import { Logger } from "winston";

export type ChatResult = StreamTextResult<Record<string, CoreTool<any, any>>>;
export type executeReturnType = Promise<Response<any, Record<string, any>>>;

export interface IChatService {
  execute(): executeReturnType;
}

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
  startChatStream(
    res: Response,
    chatId: string,
    messages: CoreMessage[]
  ): Promise<void>;
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
  generateAudio(text: string): Promise<IAudioContent>;
}

export interface IAudioGeneratorServiceDependencies {
  userId: string;
  logger: Logger;
}

export interface IGenerateAudioRequest
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechRequest {}

export interface IAudioContent
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechResponse {}
