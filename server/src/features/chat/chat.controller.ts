import { NextFunction, Request, Response } from "express";
import { IChatStreamService } from "./chat.interfaces/chatStream.service.interfaces";
import {
  IChatController,
  IChatControllerDependencies,
} from "./chat.interfaces/controller.interfaces";
import { User } from "@services/db/schema";
import HTTP_STATUS from "http-status-codes";
import { IChatService } from "./chat.interfaces/chat.service.interfaces";
import { Logger } from "winston";

class ChatController implements IChatController {
  private readonly chatService: IChatService;
  private readonly chatStreamService: IChatStreamService;
  private readonly logger: Logger;

  constructor({
    chatStreamService,
    chatService,
    logger,
  }: IChatControllerDependencies) {
    this.chatStreamService = chatStreamService;
    this.chatService = chatService;
    this.logger = logger;
  }

  public async startChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { body } = req;
    const user: User = req.user as User;

    try {
      this.logger.info(`User ${user.id} is starting chat stream`);

      return await this.chatStreamService.startChatStream({
        userId: user.id,
        tutorId: user.tutorId,
        studyingLanguageLevel: user.studyingLanguageLevel,
        res,
        ...body,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async createChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const user: User = req.user as User;

    try {
      const chatId = await this.chatService.createChat(user.id, req.body.title);

      this.logger.info(`User ${user.id} has created chat ${chatId}`);

      return res.status(HTTP_STATUS.OK).json(chatId);
    } catch (error) {
      return next(error);
    }
  }

  public async getChatsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const user: User = req.user as User;

    try {
      const chats = await this.chatService.getChatsByUserId(user.id);

      this.logger.info(
        `User ${user.id} gets chats by user id, chats: ${chats}`
      );

      return res.status(HTTP_STATUS.OK).json(chats);
    } catch (error) {
      return next(error);
    }
  }

  public async getChatById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const chat = await this.chatService.getChatById(req.params.id);

      this.logger.info(`Chat ${chat.id} has been found`);

      return res.status(HTTP_STATUS.OK).json(chat);
    } catch (error) {
      return next(error);
    }
  }

  public async getMessagesByChatId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const messages = await this.chatService.getMessagesByChatId(
        req.params.id
      );
      return res.status(HTTP_STATUS.OK).json(messages);
    } catch (error) {
      return next(error);
    }
  }

  public async deleteChatById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const user: User = req.user as User;
    const chatId = req.params.id;

    try {
      const deletedChatId = await this.chatService.deleteChatById(
        user.id,
        chatId
      );

      this.logger.info(
        `Chat ${deletedChatId} has been deleted by user ${user.id}`
      );

      return res
        .status(HTTP_STATUS.OK)
        .json({ message: "Chat has been deleted", chatId: deletedChatId });
    } catch (error) {
      return next(error);
    }
  }
}

export default ChatController;
