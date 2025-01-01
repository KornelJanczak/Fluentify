import {
  IAudioContent,
  IAudioGeneratorService,
  IAudioGeneratorServiceDependencies,
  IGenerateAudioRequest,
} from "@chat/chat.interfaces";
import NotFoundError from "@shared/errors/notFoundError";
import { tutorProfileRepository } from "@shared/repositories/tutorProfileRepository";
import { textToSpeechClient } from "@shared/services/textToSpeech";
import { config } from "@root/config";
import { Logger } from "winston";

// const logger = config.createLogger("audioGenerator.service");

class AudioGeneratorService implements IAudioGeneratorService {
  private readonly fileName = "audioGenerator.service";
  private logger: Logger;
  private userId: string;

  constructor({ userId, logger }: IAudioGeneratorServiceDependencies) {
    this.userId = userId;
    this.logger = logger;
  }

  async generateAudio(text: string): Promise<IAudioContent> {
    console.log(this);

    const request = await this.createRequest(text);
    return await this.syntheziseAudio(request);
  }

  private async syntheziseAudio(
    request: IGenerateAudioRequest
  ): Promise<IAudioContent> {
    try {
      this.logger.info({
        service: "generateAudio",
        messge: "Start generating audio...",
      });

      const [response] = await textToSpeechClient.synthesizeSpeech(request);
      return response;
    } catch (error) {
      throw new NotFoundError({
        fileName: this.fileName,
        service: "generateAudio",
        message: error.message,
        stack: error.stack,
      });
    }
  }

  private async createRequest(text: string): Promise<IGenerateAudioRequest> {
    console.log(this.userId);

    const tutorProfile = await tutorProfileRepository.getTutorProfileByUserId(
      this.userId
    );

    if (!tutorProfile)
      throw new NotFoundError({
        fileName: this.fileName,
        service: "createRequest",
        message: "Tutor profile not found",
      });

    const { languageCode, ssmlGender, name } = tutorProfile;

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
