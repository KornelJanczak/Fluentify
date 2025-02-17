import { NextFunction, Request, Response } from "express";
import { IChatStreamService } from "./chat.interfaces/chatStream.service.interfaces";
import {
  IChatController,
  IChatControllerDependencies,
} from "./chat.interfaces/controller.interfaces";
import { v4 as uuidv4 } from "uuid";
import { User } from "@services/db/schema";
import HTTP_STATUS from "http-status-codes";
import { IMessagesRepository } from "@shared/repositories/messages.repository";
import { IChatRepository } from "@shared/repositories/chat.repository";
import NotFoundError from "@shared/errors/notFound.error";
import { IChatCache } from "@services/redis/chat.cache";
import InternalServerError from "@shared/errors/internalServer.error";

class ChatController implements IChatController {
  private readonly fileName: string = "chatController";
  private readonly messagesRepository: IMessagesRepository;
  private readonly chatRepository: IChatRepository;
  private readonly chatStreamService: IChatStreamService;
  private readonly chatCache: IChatCache;

  constructor({
    chatStreamService,
    messagesRepository,
    chatCache,
    chatRepository,
  }: IChatControllerDependencies) {
    this.chatStreamService = chatStreamService;
    this.messagesRepository = messagesRepository;
    this.chatCache = chatCache;
    this.chatRepository = chatRepository;
  }

  public async startChat(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    const { body } = req;
    const user: User = req.user as User;

    return await this.chatStreamService.startChatStream({
      userId: user.id,
      tutorId: user.tutorId,
      studyingLanguageLevel: user.studyingLanguageLevel,
      res,
      ...body,
    });
  }

  public async createChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const user: User = req.user as User;

    const newChat = await this.chatRepository.create({
      id: uuidv4(),
      userId: user.id,
      title: req.body.title,
      usedTokens: 0,
      startedAt: new Date(),
    });

    if (!newChat) {
      return next(
        new NotFoundError({
          fileName: this.fileName,
          message: "User has no chats",
          service: "createChat",
        })
      );
    }

    return res.status(HTTP_STATUS.OK).json(newChat.id);
  }

  public async getChatsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const user: User = req.user as User;

    const cachedChats = await this.chatCache.getChatsFromCache(user.id);
   

    const cacheIsEmpty = !cachedChats || cachedChats.length <= 0;

    if (cacheIsEmpty) {
      const chats = await this.chatRepository.getChatsByUserId(user.id);
      await this.chatCache.addChatsToCache(chats, user.id);

      if (!chats || chats.length === 0) {
        return next(
          new NotFoundError({
            fileName: this.fileName,
            message: "User has no chats",
            service: "getChatsByUserId",
          })
        );
      }

      return res.status(HTTP_STATUS.OK).json(chats);
    } else {
      return res.status(HTTP_STATUS.OK).json(cachedChats);
    }
  }

  public async getChatById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const chat = await this.chatRepository.getById(req.params.id);

    if (!chat) {
      return next(
        new NotFoundError({
          fileName: this.fileName,
          message: "Chat not found",
          service: "getChatsById",
        })
      );
    }

    return res.status(HTTP_STATUS.OK).json(chat);
  }

  public async getMessagesByChatId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const messages = await this.messagesRepository.getMessagesByChatId(
      req.params.id
    );

    if (!messages || messages.length === 0) {
      return next(
        new NotFoundError({
          fileName: this.fileName,
          message: "Messages not found",
          service: "getMessagesByChatId",
        })
      );
    }

    return res.status(HTTP_STATUS.OK).json(messages);
  }

  public async deleteChatById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const user: User = req.user as User;
    const chatId = req.params.id;
    const deletedChat = await this.chatRepository.deleteById(chatId);

    if (deletedChat) {
      await this.chatCache.deleteChatFromCache(chatId, user.id);
      console.log("Chat has been deleted");

      return res
        .status(HTTP_STATUS.OK)
        .json({ message: "Chat has been deleted" });
    } else {
      return next(
        new InternalServerError({
          fileName: this.fileName,
          message: "Chat has not been deleted",
          service: "deleteChatById",
        })
      );
    }
  }
}

export default ChatController;
