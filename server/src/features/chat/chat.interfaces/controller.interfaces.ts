import { NextFunction, Request, Response } from "express";
import { IChatRepository } from "@shared/repositories/chat.repository";
import { IMessagesRepository } from "@shared/repositories/messages.repository";
import { IChatStreamService } from "./chatStream.service.interfaces";
import { IChatCache } from "@services/redis/chat.cache";

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
  getMessagesByChatId(
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
  chatRepository: IChatRepository;
  messagesRepository: IMessagesRepository;
  chatStreamService: IChatStreamService;
  chatCache: IChatCache;
}
