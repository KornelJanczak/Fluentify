import {
  IAudioContent,
  IAudioGeneratorService,
  IGenerateAudioRequest,
} from "@chat/chat.interfaces";
import NotFoundError from "@shared/errors/notFoundError";
import { tutorProfileRepository } from "@shared/repositories/tutorProfileRepository";
import { textToSpeechClient } from "@shared/services/textToSpeech";
import { config } from "@root/config";

const fileName = "audioGenerator";
const logger = config.createLogger("audioGenerator.service");

class AudioGeneratorService implements IAudioGeneratorService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async execute(text: string): Promise<IAudioContent> {
    const request = await this.createRequest(text);
    return await this.generateAudio(request);
  }

  private async generateAudio(
    request: IGenerateAudioRequest
  ): Promise<IAudioContent> {
    try {
      logger.info({
        service: "generateAudio",
        messge: "Start generating audio...",
      });

      const [response] = await textToSpeechClient.synthesizeSpeech(request);
      return response;
    } catch (error) {
      throw new NotFoundError({
        fileName,
        service: "generateAudio",
        message: error.message,
        stack: error.stack,
      });
    }
  }

  private async createRequest(text: string): Promise<IGenerateAudioRequest> {
    const { languageCode, ssmlGender, name } =
      await tutorProfileRepository.getTutorProfileByUserId(this.userId);

    const request: IGenerateAudioRequest = {
      input: { text: text },
      voice: {
        languageCode,
        ssmlGender,
        name,
      },
      audioConfig: { audioEncoding: "MP3" },
    };

    return request;
  }

  private async saveAudioFile() {}
}

export default AudioGeneratorService;
