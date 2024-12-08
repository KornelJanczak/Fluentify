import { Request, Response, NextFunction } from "express";
import ChatService from "./service";
import { ChatControllerAbstract, ChatServiceAbstract } from "./chat.interfaces";
import chatRepository from "../../../../common/repositories/chatRepository";
import { v4 as uuidv4 } from "uuid";
import { User } from "@common/db/schema";
import { type Chat } from "@common/db/schema";
import HTTP_STATUS from "http-status-codes";
import NotFoundError from "../../../../common/errors/notFoundError";

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
}

const chatController: ChatControllerAbstract = new ChatController();
export default chatController;
