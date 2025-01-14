import * as googleCloud from "@google-cloud/text-to-speech";
import { Logger } from "winston";

export interface IAudioGeneratorService {
  generateAudio(text: string, tutorId: string): Promise<IAudioContent>;
}

export interface IAudioGeneratorServiceDependencies {
  logger: Logger;
}

export interface IGenerateAudioRequest
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechRequest {}

export interface IAudioContent
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechResponse {}

export interface IVoice
  extends googleCloud.protos.google.cloud.texttospeech.v1.IVoice {}
