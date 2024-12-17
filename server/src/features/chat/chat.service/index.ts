import { CoreMessage, streamText } from "ai";
import { google } from "@ai-sdk/google";
import aiCharactersInitialPrompts from "@shared/services/ai/prompts";
import { ChatServiceAbstract, ChatResult } from "../chat.interfaces";
import chatRepository from "@shared/repositories/chatRepository";
import NotFoundError from "@shared/errors/notFoundError";
import { v4 as uuidv4 } from "uuid";
import messagesRepository from "@shared/repositories/messagesRepository";
import textToSpeechClient from "@shared/services/textToSpeech";

const fileName = "chat.service";

class ChatService implements ChatServiceAbstract {
  private messages: CoreMessage[] = [];
  private chatId: string;

  constructor(messages: CoreMessage[], chatId: string) {
    this.messages = messages;
    this.chatId = chatId;
  }

  async execute(): ChatResult {
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

    const result = await this.startStreamingText();
    return result;
  }

  private async startStreamingText(): ChatResult {
    const systemPrompt =
      aiCharactersInitialPrompts.johnFromAmerica("my daily routine");

    const ttsResult = await this.createTextToSpeechStream("Hello, what's up?");

    console.log(ttsResult);

    const result = await streamText({
      model: google("gemini-1.5-pro"),
      system: systemPrompt,
      messages: this.messages,
      onFinish: async ({ text }) => {
        console.log(text);

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
      },
    });

    console.log(result);

    return result;
  }

  private async createTextToSpeechStream(text: string) {
    const [response] = await textToSpeechClient.synthesizeSpeech({
      input: { text },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    });

    return response.audioContent;
  }

  private extractLastUserMessage(): CoreMessage {
    const lastUserMessage = this.messages
      .filter((message: CoreMessage) => message.role === "user")
      .at(-1);

    return lastUserMessage;
  }
}

export default ChatService;
