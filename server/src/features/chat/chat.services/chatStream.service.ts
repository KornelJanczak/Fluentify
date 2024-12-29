import {
  streamText,
  CoreMessage,
  DataStreamWriter,
  pipeDataStreamToResponse,
} from "ai";
import { v4 as uuidv4 } from "uuid";
import { messagesRepository } from "@shared/repositories/messagesRepository";
import { customAi } from "@shared/services/ai";
import {
  IAudioGeneratorService,
  type IAudioContent,
  type IChatStreamService,
} from "@chat/chat.interfaces";
import { type Response } from "express";
import { chatRepository } from "@shared/repositories/chatRepository";
import NotFoundError from "@shared/errors/notFoundError";
import { config } from "@root/config";

const fileName = "chatStream.service";
const logger = config.createLogger(fileName);

class ChatStreamService implements IChatStreamService {
  private audioGeneratorService: IAudioGeneratorService;
  private messages: CoreMessage[];
  private chatId: string;
  private systemPrompt: string;

  constructor(
    audioGeneratorService: IAudioGeneratorService,
    messages: CoreMessage[],
    chatId: string,
    systemPrompt: string
  ) {
    this.audioGeneratorService = audioGeneratorService;
    this.messages = messages;
    this.chatId = chatId;
    this.systemPrompt = systemPrompt;
  }

  async execute(
    res: Response
    // generateAudio: (text: string) => Promise<IAudioContent>
  ): Promise<void> {
    const chat = await chatRepository.getById(this.chatId);

    if (!chat)
      throw new NotFoundError({
        fileName,
        service: "execute",
        message: "Chat not found",
      });

    const lastUserMessage = this.extractLastUserMessage();

    await messagesRepository.saveMessages([
      {
        id: uuidv4(),
        ...lastUserMessage,
        createdAt: new Date(),
        chatId: this.chatId,
        usedTokens: 0,
      },
    ]);

    this.startStreamingChat(res);
  }

  private startStreamingChat(res: Response): void {
    logger.info({
      message: "Start streaming chat...",
      service: "startStreamingChat",
    });

    return pipeDataStreamToResponse(res, {
      execute: (streamWriter) => {
        const result = streamText({
          model: customAi("gpt-3.5-turbo"),
          system: this.systemPrompt,
          messages: this.messages,
          onFinish: async ({ text }) =>
            await this.onFinishStream(text, streamWriter),
        });

        return result.mergeIntoDataStream(streamWriter);
      },
    });
  }

  private async onFinishStream(
    text: string,
    streamWriter: DataStreamWriter
  ): Promise<void> {
    logger.info({
      message: "Finished streaming text",
      service: "onFinishStream",
    });

    const { audioContent } = await this.audioGeneratorService.execute(text);

    await messagesRepository.saveMessages([
      {
        id: uuidv4(),
        content: text,
        createdAt: new Date(),
        role: "assistant",
        chatId: this.chatId,
        usedTokens: 0,
      },
    ]);

    streamWriter.writeMessageAnnotation({
      type: "audio",
      data: JSON.stringify(audioContent),
    });
  }

  private extractLastUserMessage(): CoreMessage {
    const lastUserMessage = this.messages
      .filter((message: CoreMessage) => message.role === "user")
      .at(-1);

    return lastUserMessage;
  }
}

export default ChatStreamService;
