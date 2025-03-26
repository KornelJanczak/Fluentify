import { Injectable } from '@nestjs/common';
import type {
  IAudioContent,
  IGenerateAudioRequest,
  IVoice,
} from '../chat.interfaces';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { ServiceError } from 'src/common/service-error';
import { SettingsRepository } from 'src/shared/repositories/settings.repository';

@Injectable()
export class AudioGeneratorService {
  private textToSpeechClient: TextToSpeechClient = new TextToSpeechClient();

  constructor(private settingsRepository: SettingsRepository) {}

  public async generateAudio(
    text: string,
    userId: string,
  ): Promise<IAudioContent> {
    const { tutorId, learningLanguage } =
      await this.findSettingsByUserId(userId);

    const tutorVoices = await this.getTutorVoices(learningLanguage);
    const tutorVoice = this.formatTutorVoice(tutorVoices, tutorId);
    const request = this.createRequest(text, tutorVoice);

    return await this.syntheziseAudio(request);
  }

  private async syntheziseAudio(
    request: IGenerateAudioRequest,
  ): Promise<IAudioContent> {
    try {
      const [response] =
        await this.textToSpeechClient.synthesizeSpeech(request);

      return response;
    } catch (error) {
      throw ServiceError.ExternalServiceError(error.message);
    }
  }

  private async getTutorVoices(
    learningLanguageCode: string,
  ): Promise<IVoice[]> {
    try {
      const [{ voices }] = await this.textToSpeechClient.listVoices({
        languageCode: learningLanguageCode,
      });

      return voices;
    } catch (error) {
      throw ServiceError.ExternalServiceError(error.message);
    }
  }

  private formatTutorVoice(tutorVoices: IVoice[], tutorId: string): IVoice {
    const tutorVoice: IVoice = tutorVoices.find(
      (voice) => voice.name === tutorId,
    );

    if (!tutorVoice)
      throw ServiceError.NotFoundError(`Tutor voice ${tutorId} not found`);

    const formatedVoice = {
      languageCode: tutorVoice.languageCodes[0],
      name: tutorVoice.name,
      ssmlGender: tutorVoice.ssmlGender,
    };

    return formatedVoice;
  }

  private createRequest(text: string, voice: IVoice): IGenerateAudioRequest {
    const request: IGenerateAudioRequest = {
      input: { text: text },
      voice,
      audioConfig: { audioEncoding: 'MP3' },
    };

    return request;
  }

  private async findSettingsByUserId(userId: string) {
    const settings = await this.settingsRepository.findByUserId(userId);

    if (!settings) throw ServiceError.NotFoundError('Settings not found');

    return settings;
  }
}
