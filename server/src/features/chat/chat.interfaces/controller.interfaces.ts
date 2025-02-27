import { NextFunction, Request, Response } from "express";
import { IChatStreamService } from "./chatStream.service.interfaces";
import { IChatService } from "./chat.service.interfaces";
import { Logger } from "winston";

export interface IChatController {
  startChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  createChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  getChatById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  getChatsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  getChatWithMessagesByChatId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  deleteChatById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
}

export interface IChatControllerDependencies {
  chatService: IChatService;
  chatStreamService: IChatStreamService;
  logger: Logger;
}
