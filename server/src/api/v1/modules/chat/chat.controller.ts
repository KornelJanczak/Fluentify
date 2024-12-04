import { Request, Response, NextFunction } from "express";
import ChatService from "./service";
import { ChatControllerAbstract, ChatServiceAbstract } from "./chat.interfaces";
import chatRepository from "../../../../common/repositories/chatRepository";
import { v4 as uuidv4 } from "uuid";
import { User } from "@common/db/schema";
import { type Chat } from "@common/db/schema";

class ChatController implements ChatControllerAbstract {
  async startChat(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = req.body.messages;
      const chatService: ChatServiceAbstract = new ChatService(messages);

      const conversationResult = await chatService.execute();

      return conversationResult.pipeDataStreamToResponse(res);
    } catch (error) {
      next(error);
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
        service: "createChat",
        newItem,
      })) as Chat;

      return res.status(201).json(newChat.id);
    } catch (error) {
      next(error);
    }
  }

  async getChat(req: Request, res: Response, next: NextFunction) {
    try {
      const chat = await chatRepository.getById({
        service: "getChat",
        id: req.params.id,
      });
      return res.status(200).json(chat);
    } catch (error) {
      next(error);
    }
  }
}

const chatController: ChatControllerAbstract = new ChatController();
export default chatController;
