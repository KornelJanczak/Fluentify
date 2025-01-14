import { Request, Response } from "express";
import { IChatRepository } from "@shared/repositories/chatRepository";
import { IMessagesRepository } from "@shared/repositories/messagesRepository";
import { IChatStreamService } from "./chatStream.service.interfaces";

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
