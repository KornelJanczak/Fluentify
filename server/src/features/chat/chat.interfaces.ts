import { StreamTextResult, CoreTool } from "ai";
import { Request, Response, NextFunction } from "express";
import * as googleCloud from "@google-cloud/text-to-speech";

export type ChatResult = StreamTextResult<Record<string, CoreTool<any, any>>>;
export type executeReturnType = Promise<Response<any, Record<string, any>>>;

export interface IChatService {
  execute(): executeReturnType;
}

export interface IChatController {
  startChat(req: Request, res: Response, next: NextFunction): void;
  createChat(req: Request, res: Response, next: NextFunction): void;
  getChat(req: Request, res: Response, next: NextFunction): void;
  getMessagesByChatId(req: Request, res: Response, next: NextFunction): void;
}

export interface IChatService {}

export interface IChatStreamService {
  execute(
    res: Response,
    generateAudio: (text: string) => Promise<IAudioContent>
  ): void;
}

export interface IAudioGeneratorService {
  execute(text: string): Promise<IAudioContent>;
}

export interface IGenerateAudioRequest
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechRequest {}

export interface IAudioContent
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechResponse {}
