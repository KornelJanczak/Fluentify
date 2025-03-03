import {
  IAudioContent,
  IAudioGeneratorService,
  IGenerateAudioRequest,
  IVoice,
} from "../chat.interfaces/audioGenerator.service.interfaces";
import { textToSpeechClient } from "@shared/services/textToSpeech";
import { ServiceError } from "@shared/errors/service.error";

class AudioGeneratorService implements IAudioGeneratorService {
  async generateAudio(text: string, tutorId: string): Promise<IAudioContent> {
    const tutorVoices: IVoice[] = await this.getTutorVoices();
    const tutorVoice: IVoice = this.formatTutorVoice(tutorVoices, tutorId);
    const request = await this.createRequest(text, tutorVoice);
    return await this.syntheziseAudio(request);
  }

  private async syntheziseAudio(
    request: IGenerateAudioRequest
  ): Promise<IAudioContent> {
    try {
      const [response] = await textToSpeechClient.synthesizeSpeech(request);

      return response;
    } catch (error) {
      throw ServiceError.NotFound({
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
      throw ServiceError.NotFound({
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
      throw ServiceError.NotFound({
        message: `Tutor voice ${tutorId} not found`,
      });
    }

    const formatedVoice = {
      languageCode: tutorVoice.languageCodes[0],
      name: tutorVoice.name,
      ssmlGender: tutorVoice.ssmlGender,
    };

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
}

export default AudioGeneratorService;
