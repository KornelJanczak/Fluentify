import { NextFunction, Request, Response } from "express";
import { IChatRepository } from "@shared/repositories/chatRepository";
import { IMessagesRepository } from "@shared/repositories/messagesRepository";
import { IChatStreamService } from "./chatStream.service.interfaces";

export interface IChatController {
  startChat(req: Request, res: Response, next: NextFunction): void;
  createChat(req: Request, res: Response, next: NextFunction): void;
  getChatById(req: Request, res: Response, next: NextFunction): void;
  getMessagesByChatId(req: Request, res: Response, next: NextFunction): void;
}

export interface IChatControllerDependencies {
  chatRepository: IChatRepository;
  messagesRepository: IMessagesRepository;
  chatStreamService: IChatStreamService;
}
