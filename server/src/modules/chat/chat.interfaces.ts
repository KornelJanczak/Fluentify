import * as googleCloud from '@google-cloud/text-to-speech';
import type { CoreMessage, DataStreamWriter } from 'ai';
import { Response } from 'express';

export interface GenerateAudioRequest
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechRequest {}

export interface AudioContent
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechResponse {}

export interface Voice
  extends googleCloud.protos.google.cloud.texttospeech.v1.IVoice {}

export interface StartStreamRequest {
  chatId: string;
  messages: CoreMessage[];
  res: Response;
}

export interface StreamToResponseArgs {
  tutorId: string;
  learningLanguage: string;
  systemPrompt: string;
  startStreamRequest: StartStreamRequest;
}

export interface OnFinishStreamArgs {
  chatId: string;
  messageId: string;
  tutorId: string;
  learningLanguage: string;
  content: string;
  usedTokens: number;
  streamWriter: DataStreamWriter;
}

export interface GetSystemPromptArgs {
  tutorId: string;
  learningLanguage: string;
  learningLanguageLevel: string;
  chatCategory: string;
  chatTopic: string;
  vocabularySetId?: string;
}
