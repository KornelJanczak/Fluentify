import { Injectable } from '@nestjs/common';
import type {
  AudioContent,
  GenerateAudioRequest,
  Voice,
} from '../chat.interfaces';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { ServiceError } from 'src/common/service-error';

@Injectable()
export class AudioGeneratorService {
  private textToSpeechClient: TextToSpeechClient = new TextToSpeechClient();

  public async generateAudio(
    tutorId: string,
    learningLanguage: string,
    text: string,
  ): Promise<AudioContent> {
    const tutorVoices = await this.getTutorVoices(learningLanguage);
    const tutorVoice = this.formatTutorVoice(tutorVoices, tutorId);
    const request = this.createRequest(text, tutorVoice);

    return await this.syntheziseAudio(request);
  }

  private async syntheziseAudio(
    request: GenerateAudioRequest,
  ): Promise<AudioContent> {
    try {
      const [response] =
        await this.textToSpeechClient.synthesizeSpeech(request);

      return response;
    } catch (error) {
      throw ServiceError.ExternalServiceError(error.message);
    }
  }

  private async getTutorVoices(learningLanguageCode: string): Promise<Voice[]> {
    try {
      const [{ voices }] = await this.textToSpeechClient.listVoices({
        languageCode: learningLanguageCode,
      });

      return voices;
    } catch (error) {
      throw ServiceError.ExternalServiceError(error.message);
    }
  }

  private formatTutorVoice(tutorVoices: Voice[], tutorId: string): Voice {
    const tutorVoice = tutorVoices.find((voice) => voice.name === tutorId);

    if (!tutorVoice)
      throw ServiceError.NotFoundError(`Tutor voice ${tutorId} not found`);

    const formatedVoice = {
      languageCode: tutorVoice.languageCodes[0],
      name: tutorVoice.name,
      ssmlGender: tutorVoice.ssmlGender,
    };

    return formatedVoice;
  }

  private createRequest(text: string, voice: Voice): GenerateAudioRequest {
    const request: GenerateAudioRequest = {
      input: { text: text },
      voice,
      audioConfig: { audioEncoding: 'MP3' },
    };

    return request;
  }
}
