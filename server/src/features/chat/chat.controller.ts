import { Request, Response } from "express";
import ChatService from "./chat.services/index.service";
import { IChatController } from "./chat.interfaces";
import { chatRepository } from "@shared/repositories/chatRepository";
import { v4 as uuidv4 } from "uuid";
import { User } from "@shared/services/db/schema";
import HTTP_STATUS from "http-status-codes";
import { messagesRepository } from "@shared/repositories/messagesRepository";
import { pipeDataStreamToResponse } from "ai";
import AudioGenerator from "./chat.services/audioGenerator.service";
import ChatStreamService from "./chat.services/chatStream.service";
import AudioGeneratorService from "./chat.services/audioGenerator.service";
import MainService from "./chat.services/main.service";

class ChatController implements IChatController {
  async startChat(req: Request, res: Response) {
    const messages = req.body.messages;
    const chatId = req.body.chatId;
    const user: User = req.user as User;

    const chatStreamService = new ChatStreamService(
      new AudioGeneratorService(user.id),
      messages,
      chatId,
      "system prompt"
    );

    return chatStreamService.startChatStream(res);

    // const mainService = new MainService(
    //   audioGeneratorService,
    //   chatStreamService
    // );

    // const chatService = new ChatService(messages, chatId);

    // return chatStreamService.execute(res, audioGeneratorService.execute.bind(this));
    // // const audioGenerator = new AudioGenerator();

    // return pipeDataStreamToResponse(res, {
    //   execute: async (streamWriter) => {
    //     await chatService.execute(streamWriter);
    //   },
    // });
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

const chatController: IChatController = new ChatController();
export default chatController;
