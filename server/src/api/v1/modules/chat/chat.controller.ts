import { Request, Response, NextFunction } from "express";
import ChatService from "./service";
import { ChatControllerAbstract, ChatServiceAbstract } from "./chat.interfaces";
import chatRepository from "../../../../common/repositories/chatRepository";
import { v4 as uuidv4 } from "uuid";

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
      // const userId = req.user.id;

      // const newChat = await chatRepository.create(
      //   {
      //     id: uuidv4(),
      //     userId: userId,
      //     title: req.body.title,
      //     usedTokens: 0,
      //     startedAt: new Date(),
      //   },
      //   "createChat"
      // );

      // return res.status(201).json(newChat);
    } catch (error) {
      next(error);
    }
  }

  async getChat(req: Request, res: Response, next: NextFunction) {
    try {
      const chat = await chatRepository.getById(req.params.id, "getChat");
      return res.status(200).json(chat);
    } catch (error) {
      next(error);
    }
  }
}

const chatController: ChatControllerAbstract = new ChatController();
export default chatController;
