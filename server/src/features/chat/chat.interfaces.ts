import { StreamTextResult, CoreTool, DataStreamWriter } from "ai";
import { Request, Response, NextFunction } from "express";

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

export interface IAudioGenerator {
  execute(): void;
}
