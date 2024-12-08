import { CoreMessage, streamText } from "ai";
import { google } from "@ai-sdk/google";
import aiCharactersInitialPrompts from "../../../../../common/AI/prompts";
import { ChatServiceAbstract, ChatResult } from "../chat.interfaces";
import chatRepository from "../../../../../common/repositories/chatRepository";
import NotFoundError from "../../../../../common/errors/notFoundError";
import HTTP_STATUS from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import messagesRepository from "../../../../../common/repositories/messagesRepository";

class ChatService implements ChatServiceAbstract {
  private messages: CoreMessage[] = [];
  private chatId: string;

  constructor(messages: CoreMessage[], chatId: string) {
    this.messages = messages;
    this.chatId = chatId;
  }

  async execute(): ChatResult {
    const chat = await chatRepository.getById({
      service: "execute",
      id: this.chatId,
    });

    if (!chat)
      throw new NotFoundError({
        message: "Chat not found",
        service: "chatService: execute",
      });

    console.log(this.messages);

    const lastUserMessage = this.extractLastUserMessage();
    console.log(lastUserMessage);

    // await messagesRepository.saveMessages({
    //   service: "chatService: execute",
    //   messages: [
    //     {
    //       id: uuidv4(),
    //       ...lastUserMessage,
    //       createdAt: new Date(),
    //       chatId: this.chatId,
    //       usedTokens: 0,
    //     },
    //   ],
    // });

    const result = await this.startStreamingText();
    return result;
  }

  private async startStreamingText(): ChatResult {
    const systemPrompt =
      aiCharactersInitialPrompts.johnFromAmerica("my daily routine");

    const result = await streamText({
      model: google("gemini-1.5-pro"),
      system: systemPrompt,
      messages: this.messages,
    });

    console.log(result);

    return result;
  }

  private extractLastUserMessage(): CoreMessage {
    const lastUserMessage = this.messages
      .filter((message: CoreMessage) => message.role === "user")
      .at(-1);

    return lastUserMessage;
  }
}

export default ChatService;
