import {
  IAudioContent,
  IAudioGeneratorService,
  IAudioGeneratorServiceDependencies,
  IGenerateAudioRequest,
} from "@chat/chat.interfaces";
import NotFoundError from "@shared/errors/notFoundError";
import { ITutorProfileRepository } from "@shared/repositories/tutorProfileRepository";
import { textToSpeechClient } from "@shared/services/textToSpeech";
import { Logger } from "winston";

class AudioGeneratorService implements IAudioGeneratorService {
  private readonly fileName = "audioGenerator.service";
  private readonly tutorProfileRepository: ITutorProfileRepository;
  private readonly logger: Logger;

  constructor({
    logger,
    tutorProfileRepository,
  }: IAudioGeneratorServiceDependencies) {
    this.logger = logger;
    this.tutorProfileRepository = tutorProfileRepository;
  }

  async generateAudio(text: string, userId: string): Promise<IAudioContent> {
    const request = await this.createRequest(text, userId);
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

  private async createRequest(
    text: string,
    userId: string
  ): Promise<IGenerateAudioRequest> {
    const tutorProfile =
      await this.tutorProfileRepository.getTutorProfileByUserId(userId);

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
