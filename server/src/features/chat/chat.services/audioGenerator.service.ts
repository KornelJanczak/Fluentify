import {
  IAudioContent,
  IAudioGeneratorService,
  IAudioGeneratorServiceDependencies,
  IGenerateAudioRequest,
  IVoice,
} from "../chat.interfaces/audioGenerator.service.interfaces";
import NotFoundError from "@shared/errors/notFound.error";
import { textToSpeechClient } from "@shared/services/textToSpeech";
import { Logger } from "winston";

class AudioGeneratorService implements IAudioGeneratorService {
  private readonly fileName = "audioGenerator.service";
  private readonly logger: Logger;

  constructor({ logger }: IAudioGeneratorServiceDependencies) {
    this.logger = logger;
  }

  async generateAudio(text: string, tutorId: string): Promise<IAudioContent> {
    this.logger.info({
      fileName: this.fileName,
      service: "generateAudio",
      message: "Start generating audio...",
    });

    const tutorVoices: IVoice[] = await this.getTutorVoices();
    const tutorVoice: IVoice = this.formatTutorVoice(tutorVoices, tutorId);
    const request = await this.createRequest(text, tutorVoice);
    return await this.syntheziseAudio(request);
  }

  private async syntheziseAudio(
    request: IGenerateAudioRequest
  ): Promise<IAudioContent> {
    try {
      this.logger.info({
        fileName: this.fileName,
        service: "syntheziseAudio",
        message: "Start synthezising audio...",
      });

      const [response] = await textToSpeechClient.synthesizeSpeech(request);

      console.log(response);

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

  private async getTutorVoices(): Promise<IVoice[]> {
    try {
      const [{ voices }] = await textToSpeechClient.listVoices({
        languageCode: "en-US",
      });

      return voices;
    } catch (error) {
      new NotFoundError({
        fileName: this.fileName,
        service: "getTutorVoice",
        message: error.message,
        stack: error.stack,
      });
    }
  }

  private formatTutorVoice(tutorVoices: IVoice[], tutorId: string) {
    const tutorVoice: IVoice = tutorVoices.find(
      (voice) => voice.name === tutorId
    );

    if (!tutorVoice) {
      throw new NotFoundError({
        fileName: this.fileName,
        service: "getTutorVoice",
        message: "Tutor not found",
      });
    }

    const formatedVoice = {
      languageCode: tutorVoice.languageCodes[0],
      name: tutorVoice.name,
      ssmlGender: tutorVoice.ssmlGender,
    };

    this.logger.info({
      fileName: this.fileName,
      service: "getTutorVoice",
      message: `Tutor id: ${formatedVoice.name}`,
    });

    return formatedVoice;
  }

  private async createRequest(
    text: string,
    voice: IVoice
  ): Promise<IGenerateAudioRequest> {
    const request: IGenerateAudioRequest = {
      input: { text: text },
      voice,
      audioConfig: { audioEncoding: "MP3" },
    };

    return request;
  }

  private async saveAudioFile() {}
}

export default AudioGeneratorService;
