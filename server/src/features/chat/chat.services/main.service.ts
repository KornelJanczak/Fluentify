import {
  IAudioGeneratorService,
  IChatStreamService,
} from "@chat/chat.interfaces";
import { CoreMessage } from "ai";

class MainService {
  private audioGeneratorService: IAudioGeneratorService;
  private chatStreamService: IChatStreamService;
  private messages: CoreMessage[];
  private chatId: string;
  private userId: string;

  constructor(
    audioGeneratorService: IAudioGeneratorService,
    chatStreamService: IChatStreamService,
    messages: CoreMessage[],
    chatId: string,
    userId: string
  ) {
    this.audioGeneratorService = audioGeneratorService;
    this.chatStreamService = chatStreamService;
    this.messages = messages;
    this.chatId = chatId;
    this.userId = userId;
  }

  async startChat() {
    // const audioService = this.audioGeneratorService.generateAudio(this.userId);
    // const chatService = this.chatStreamService.startChatStream(
    //   this.messages,
    //   this.chatId,
    //   "system prompt"
    // );
  }
}

export default MainService;
