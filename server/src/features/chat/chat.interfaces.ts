import { StreamTextResult, CoreTool } from "ai";
import { Request, Response, NextFunction } from "express";
import * as googleCloud from "@google-cloud/text-to-speech";

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

export interface IChatService {}

export interface IChatStreamService {
  startChatStream(
    res: Response,
    generateAudio: (text: string) => Promise<IAudioContent>
  ): void;
}

export interface IAudioGeneratorService {
  generateAudio(text: string): Promise<IAudioContent>;
}

export interface IGenerateAudioRequest
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechRequest {}

export interface IAudioContent
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechResponse {}
