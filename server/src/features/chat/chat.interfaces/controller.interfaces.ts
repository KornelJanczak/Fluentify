import { NextFunction, Request, Response } from "express";
import { IChatRepository } from "@shared/repositories/chat.repository";
import { IMessagesRepository } from "@shared/repositories/messages.repository";
import { IChatStreamService } from "./chatStream.service.interfaces";

export interface IChatController {
  startChat(req: Request, res: Response, next: NextFunction): void;
  createChat(req: Request, res: Response, next: NextFunction): void;
  getChatById(req: Request, res: Response, next: NextFunction): void;
  getChatsByUserId(req: Request, res: Response, next: NextFunction): void;
  getMessagesByChatId(req: Request, res: Response, next: NextFunction): void;
}

export interface IChatControllerDependencies {
  chatRepository: IChatRepository;
  messagesRepository: IMessagesRepository;
  chatStreamService: IChatStreamService;
}
