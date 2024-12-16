import { Request, Response } from "express";
import ChatService from "./chat.service";
import { ChatControllerAbstract, ChatServiceAbstract } from "./chat.interfaces";
import chatRepository from "@shared/repositories/chatRepository";
import { v4 as uuidv4 } from "uuid";
import { User } from "@shared/services/db/schema";
import HTTP_STATUS from "http-status-codes";
import messagesRepository from "@shared/repositories/messagesRepository";

class ChatController implements ChatControllerAbstract {
  async startChat(req: Request, res: Response) {
    const messages = req.body.messages;
    const chatId = req.body.chatId;

    const chatService: ChatServiceAbstract = new ChatService(messages, chatId);
    const conversationResult = await chatService.execute();

    return conversationResult.pipeDataStreamToResponse(res);
  }

  async createChat(req: Request, res: Response) {
    const user: User = req.user as User;
    const newChat = await chatRepository.create({
      id: uuidv4(),
      userId: user.id,
      title: req.body.title,
      usedTokens: 0,
      startedAt: new Date(),
    });
    return res.status(HTTP_STATUS.OK).json(newChat.id);
  }

  async getChat(req: Request, res: Response) {
    const chat = await chatRepository.getById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(chat);
  }

  async getMessagesByChatId(req: Request, res: Response) {
    const messages = await messagesRepository.getMessagesByChatId(
      req.params.id
    );
    return res.status(HTTP_STATUS.OK).json(messages);
  }
}

const chatController: ChatControllerAbstract = new ChatController();
export default chatController;
