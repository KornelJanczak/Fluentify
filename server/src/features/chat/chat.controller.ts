import { Request, Response } from "express";
import { IChatStreamService } from "./chat.interfaces/chatStream.service.interfaces";
import {
  IChatController,
  IChatControllerDependencies,
} from "./chat.interfaces/controller.interfaces";
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
    const { body } = req;
    const user: User = req.user as User;

    try {
      return await this.chatStreamService.startChatStream({
        userId: user.id,
        tutorId: user.tutorId,
        studyingLanguageLevel: user.studyingLanguageLevel,
        res,
        ...body,
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

  async getChatById(req: Request, res: Response) {
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
