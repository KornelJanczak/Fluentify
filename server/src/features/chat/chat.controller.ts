import { Request, Response } from "express";
import {
  IChatController,
  IChatControllerDependencies,
  IChatStreamService,
} from "./chat.interfaces";
import { v4 as uuidv4 } from "uuid";
import { User } from "@shared/services/db/schema";
import HTTP_STATUS from "http-status-codes";
import { IMessagesRepository } from "@shared/repositories/messagesRepository";
import { IChatRepository } from "@shared/repositories/chatRepository";

class ChatController implements IChatController {
  private readonly messagesRepository: IMessagesRepository;
  private readonly chatRepository: IChatRepository;
  private readonly chatStreamService: IChatStreamService;

  constructor({
    chatStreamService,
    messagesRepository,
    chatRepository,
  }: IChatControllerDependencies) {
    this.chatStreamService = chatStreamService;
    this.messagesRepository = messagesRepository;
    this.chatRepository = chatRepository;
  }

  async startChat(req: Request, res: Response) {
    const messages = req.body.messages;
    const chatId = req.body.chatId;
    const user: User = req.user as User;

    try {
      return await this.chatStreamService.startChatStream({
        res,
        chatId,
        messages,
        userId: user.id,
      });
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  async createChat(req: Request, res: Response) {
    const user: User = req.user as User;
    const newChat = await this.chatRepository.create({
      id: uuidv4(),
      userId: user.id,
      title: req.body.title,
      usedTokens: 0,
      startedAt: new Date(),
    });
    return res.status(HTTP_STATUS.OK).json(newChat.id);
  }

  async getChat(req: Request, res: Response) {
    const chat = await this.chatRepository.getById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(chat);
  }

  async getMessagesByChatId(req: Request, res: Response) {
    const messages = await this.messagesRepository.getMessagesByChatId(
      req.params.id
    );
    return res.status(HTTP_STATUS.OK).json(messages);
  }
}

export default ChatController;
