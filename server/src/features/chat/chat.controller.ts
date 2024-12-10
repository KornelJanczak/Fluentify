import { Request, Response, NextFunction } from "express";
import ChatService from "./service";
import { ChatControllerAbstract, ChatServiceAbstract } from "./chat.interfaces";
import chatRepository from "@shared/repositories/chatRepository";
import { v4 as uuidv4 } from "uuid";
import { User } from "src/shared/db/schema";
import { type Chat } from "src/shared/db/schema";
import HTTP_STATUS from "http-status-codes";
import NotFoundError from "@shared/errors/notFoundError";
import messagesRepository from "@shared/repositories/messagesRepository";

class ChatController implements ChatControllerAbstract {
  async startChat(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = req.body.messages;
      const chatId = req.body.chatId;

      const chatService: ChatServiceAbstract = new ChatService(
        messages,
        chatId
      );

      const conversationResult = await chatService.execute();

      return conversationResult.pipeDataStreamToResponse(res);
    } catch (error) {
      next(
        new NotFoundError({
          service: "chat.controller: startChat",
          ...error,
        })
      );
    }
  }

  async createChat(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = req.user as User;

      console.log(req.body);

      const newItem = {
        id: uuidv4(),
        userId: user.id,
        title: req.body.title,
        usedTokens: 0,
        startedAt: new Date(),
      };

      const newChat = (await chatRepository.create({
        service: "chat.controller: createChat",
        newItem,
      })) as Chat;

      return res.status(HTTP_STATUS.OK).json(newChat.id);
    } catch (error) {
      next(
        new NotFoundError({
          service: "chat.controller: createChat",
          ...error,
        })
      );
    }
  }

  async getChat(req: Request, res: Response, next: NextFunction) {
    try {
      const chat = await chatRepository.getById({
        service: "chat.controller: getChat",
        id: req.params.id,
      });

      console.log(chat);

      return res.status(HTTP_STATUS.OK).json(chat);
    } catch (error) {
      next(
        new NotFoundError({
          service: "chat.controller: getChat",
          ...error,
        })
      );
    }
  }

  async getMessagesByChatId(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await messagesRepository.getMessagesByChatId({
        service: "chat.controller: getMessagesByChatId",
        chatId: req.params.id,
      });

      return res.status(HTTP_STATUS.OK).json(messages);
    } catch (error) {
      next(
        new NotFoundError({
          service: "chat.controller: getMessagesByChatId",
          ...error,
        })
      );
    }
  }
}

const chatController: ChatControllerAbstract = new ChatController();
export default chatController;
