import { Request, Response } from "express";
import ChatService from "./chat.service";
import { ChatControllerAbstract, ChatServiceAbstract } from "./chat.interfaces";
import chatRepository from "@shared/repositories/chatRepository";
import { v4 as uuidv4 } from "uuid";
import { User } from "@shared/services/db/schema";
import HTTP_STATUS from "http-status-codes";
import messagesRepository from "@shared/repositories/messagesRepository";
import { pipeDataStreamToResponse } from "ai";
import textToSpeechClient from "@shared/services/textToSpeech";
import { DataStreamWriter } from "ai";

class ChatController implements ChatControllerAbstract {
  async startChat(req: Request, res: Response) {
    const messages = req.body.messages;
    const chatId = req.body.chatId;

    const chatService = new ChatService(messages, chatId);

    return pipeDataStreamToResponse(res, {
      execute: async (streamWriter) => {
        
        await chatService.execute(streamWriter);
      },
    });
  }

  streamAudio(streamWriter: DataStreamWriter) {
    const ttsStream = textToSpeechClient.streamingSynthesize();
    let dataToWrite;

    const sampleRate = 24000;
    const numChannels = 1; // Mono audio

    ttsStream.on("data", (response: any) => {
      console.log(response);
      if (response.audioContent) {
        dataToWrite = response.audioContent;
      }
    });

    ttsStream.on("error", (err: any) => {
      console.error("Error during Text-to-Speech:", err);
    });

    ttsStream.on("end", () => {
      console.log("Finished streaming Text-to-Speech");
    });

    ttsStream.write({
      streamingConfig: {
        voice: {
          name: "en-us-Journey-O",
          languageCode: "en-US",
          ssmlGender: "NEUTRAL",
        },
        audioConfig: {
          audioEncoding: "LINEAR16",
          sampleRateHertz: sampleRate,
        },
      },
    });

    // Stream the texts to TTS stream
    const texts = ["Hello", "world"]; // Replace with actual texts
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
