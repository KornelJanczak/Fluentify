import { streamText, CoreMessage, DataStreamWriter } from "ai";
import aiCharactersInitialPrompts from "@shared/services/ai/prompts";
import chatRepository from "@shared/repositories/chatRepository";
import NotFoundError from "@shared/errors/notFoundError";
import { v4 as uuidv4 } from "uuid";
import messagesRepository from "@shared/repositories/messagesRepository";
import { textToSpeechClient } from "@shared/services/textToSpeech";
import config from "@root/config";
import { customAi } from "@shared/services/ai";

const fileName = "chat.service";
const logger = config.createLogger(fileName);

class ChatService {
  private messages: CoreMessage[] = [];
  private chatId: string;

  constructor(messages: CoreMessage[], chatId: string) {
    this.messages = messages;
    this.chatId = chatId;
  }

  async execute(streamWriter: DataStreamWriter) {
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

    await this.startStreamingText(streamWriter);
  }

  private async startStreamingText(streamWriter: DataStreamWriter) {
    logger.info("Starting streaming text");
    const systemPrompt =
      aiCharactersInitialPrompts.johnFromAmerica("my daily routine");

    const result = streamText({
      model: customAi("gpt-3.5-turbo"),

      system: systemPrompt,
      messages: this.messages,

      onFinish: async ({ text }) => {
        await this.generateAudio(text, streamWriter);
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
      onChunk: async (chunk) => {
        console.log(chunk);
      },
    });

    return result.mergeIntoDataStream(streamWriter);
  }

  private async generateAudio(text: string, streamWriter: DataStreamWriter) {
    const [response] = await textToSpeechClient.synthesizeSpeech({
      input: { text: text },
      voice: {
        languageCode: "en-US",
        ssmlGender: "FEMALE",
        name: "en-US-Journey-F",
      },
      audioConfig: { audioEncoding: "MP3" },
    });

    streamWriter.writeMessageAnnotation({
      type: "audio",
      data: JSON.stringify(response.audioContent),
    });
  }

  private extractLastUserMessage(): CoreMessage {
    const lastUserMessage = this.messages
      .filter((message: CoreMessage) => message.role === "user")
      .at(-1);

    return lastUserMessage;
  }
}

export default ChatService;
