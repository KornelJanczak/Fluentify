import {
  IAudioContent,
  IAudioGeneratorService,
  IAudioGeneratorServiceDependencies,
  IGenerateAudioRequest,
  IVoice,
} from "@chat/chat.interfaces";
import NotFoundError from "@shared/errors/notFoundError";
import { textToSpeechClient } from "@shared/services/textToSpeech";
import { Logger } from "winston";

class AudioGeneratorService implements IAudioGeneratorService {
  private readonly fileName = "audioGenerator.service";
  private readonly logger: Logger;

  constructor({
    logger,
  }: IAudioGeneratorServiceDependencies) {
    this.logger = logger;
  }

  async generateAudio(text: string, tutorId: string): Promise<IAudioContent> {
    const tutorVoice: IVoice = await this.getTutorProfile(tutorId);
    const request = await this.createRequest(text, tutorVoice);
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

  private async getTutorProfile(tutorId: string): Promise<IVoice> {
    const [{ voices }] = await textToSpeechClient.listVoices({
      languageCode: "en-US",
    });

    const userTutor: IVoice = voices.find((voice) => voice.name === tutorId);

    return userTutor;
  }

  private async createRequest(
    text: string,
    voice: IVoice
  ): Promise<IGenerateAudioRequest> {
    const request: IGenerateAudioRequest = {
      input: { text },
      voice,
      audioConfig: { audioEncoding: "MP3" },
    };

    return request;
  }

  private async saveAudioFile() {}
}

export default AudioGeneratorService;
