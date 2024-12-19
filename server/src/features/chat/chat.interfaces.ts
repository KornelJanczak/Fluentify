import { StreamTextResult, CoreTool } from "ai";
import { Request, Response, NextFunction } from "express";

export type ChatResult = StreamTextResult<Record<string, CoreTool<any, any>>>;
export type executeReturnType = Promise<Response<any, Record<string, any>>>;

export interface ChatServiceAbstract {
  execute(): executeReturnType
}

export interface ChatControllerAbstract {
  startChat(req: Request, res: Response, next: NextFunction): void;
  createChat(req: Request, res: Response, next: NextFunction): void;
  getChat(req: Request, res: Response, next: NextFunction): void;
  getMessagesByChatId(req: Request, res: Response, next: NextFunction): void;
}
