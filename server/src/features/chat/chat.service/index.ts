import {
  generateId,
  streamText,
  CoreMessage,
  createDataStreamResponse,
  DataStreamWriter,
} from "ai";
import { google } from "@ai-sdk/google";
import aiCharactersInitialPrompts from "@shared/services/ai/prompts";
import {
  ChatServiceAbstract,
  ChatResult,
  executeReturnType,
} from "../chat.interfaces";
import chatRepository from "@shared/repositories/chatRepository";
import NotFoundError from "@shared/errors/notFoundError";
import { v4 as uuidv4 } from "uuid";
import messagesRepository from "@shared/repositories/messagesRepository";
import textToSpeechClient from "@shared/services/textToSpeech";
import fs, { WriteStream } from "fs";
import config from "@root/config";

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

    this.startStreamingText(streamWriter);
  }

  private async startStreamingText(streamWriter: DataStreamWriter) {
    let ttsStream: DataStreamWriter;

    const systemPrompt =
      aiCharactersInitialPrompts.johnFromAmerica("my daily routine");

    const result = streamText({
      model: google("gemini-1.5-pro"),
      system: systemPrompt,
      messages: this.messages,

      onFinish: async ({ text }) => {
        this.ttsRealtime(text.split(" "), streamWriter);
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
      onChunk: async ({ chunk }) => {
        console.log("chunk", chunk);
      },
    });

    // const text =  (await result.text).split("");

    result.mergeIntoDataStream(streamWriter);
  }

  private ttsRealtime(texts: string[], streamWriterr: DataStreamWriter) {
    const ttsStream = textToSpeechClient.streamingSynthesize();

    console.log(ttsStream);

    // Write the response to a file, replace with your desired output stream
    const streamWriter = fs.createWriteStream("output.wav");

    // The audio data is headerless LINEAR16 audio with a sample rate of 24000.
    const sampleRate = 24000;
    const numChannels = 1; // Mono audio
    const byteRate = sampleRate * numChannels * 2;
    const header = this.createWavHeader(sampleRate, numChannels, byteRate, 0);
    streamWriter.write(header);

    console.log(streamWriter);

    
    // Handle the TTS response stream
    ttsStream.on("data", (response: any) => {
      if (response.audioContent) {
        streamWriter.write(response.audioContent);
      }
    });

    ttsStream.on("error", (err: any) => {
      console.error("Error during Text-to-Speech:", err);
      streamWriter.end();
    });

    ttsStream.on("end", () => {
      console.log("Finished streaming Text-to-Speech");
      streamWriter.end();
    });

    // Note: Only Journey voices support streaming for now.
    ttsStream.write({
      streamingConfig: {
        voice: {
          name: "en-us-Journey-O",
          languageCode: "en-US",
          ssmlGender: "NEUTRAL",
        },
      },
    });

    // Stream the texts to TTS stream, replace with actual streaming texts
    for (const text of texts) {
      ttsStream.write({ input: { text: text } });
    }

    ttsStream.end();
  }

  private writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  private createWavHeader(
    sampleRate: number,
    numChannels: number,
    byteRate: number,
    dataSize: number
  ): Uint8Array {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    // RIFF chunk descriptor
    this.writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + dataSize, true); // File size - 8
    this.writeString(view, 8, "WAVE");

    // fmt sub-chunk
    this.writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true); // NumChannels
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, byteRate, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
    view.setUint16(32, numChannels * 2, true); // BlockAlign (NumChannels * BitsPerSample/8)
    view.setUint16(34, 16, true); // BitsPerSample

    // data sub-chunk
    this.writeString(view, 36, "data");
    view.setUint32(40, dataSize, true); // Subchunk2Size

    return new Uint8Array(header);
  }

  //

  private extractLastUserMessage(): CoreMessage {
    const lastUserMessage = this.messages
      .filter((message: CoreMessage) => message.role === "user")
      .at(-1);

    return lastUserMessage;
  }
}

export default ChatService;
