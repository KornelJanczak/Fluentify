import * as googleCloud from '@google-cloud/text-to-speech';
import type { CoreMessage, DataStreamWriter } from 'ai';
import { Response } from 'express';

export interface IGenerateAudioRequest
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechRequest {}

export interface IAudioContent
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechResponse {}

export interface IVoice
  extends googleCloud.protos.google.cloud.texttospeech.v1.IVoice {}

export interface StartStreamRequest {
  chatId: string;
  messages: CoreMessage[];
  res: Response;
}

export interface OnFinishStreamArgs {
  userId: string;
  chatId: string;
  messageId: string;
  content: string;
  usedTokens: number;
  streamWriter: DataStreamWriter;
}

export interface GetSystemPromptArgs {
  userId: string;
  chatCategory: string;
  chatTopic: string;
  vocabularySetId?: string;
}
