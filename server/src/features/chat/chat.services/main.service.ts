import {
  IAudioGeneratorService,
  IChatStreamService,
} from "@chat/chat.interfaces";

class MainService {
  private audioGeneratorService: IAudioGeneratorService;
  private chatStreamService: IChatStreamService;

  constructor(
    audioGeneratorService: IAudioGeneratorService,
    chatStreamService: IChatStreamService
  ) {
    this.audioGeneratorService = audioGeneratorService;
    this.chatStreamService = chatStreamService;
  }

  async execute() {
    this.chatStreamService.execute
  }
}


export default MainService;