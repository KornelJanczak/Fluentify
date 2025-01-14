import { IFlashCardRepository } from "@shared/repositories/flashCardRepository";
import { ITopicPromptFactory } from "./topicPrompt.service.interfaces";
import { ITutorPromptService } from "./tutorPrompt.service.interfaces";

export interface ISystemPromptService {
  getSystemPrompt(
    args: IGetSystemPromptArgs
  ): Promise<string>;
}

export interface ISystemPromptDependencies {
  topicPromptFactory: ITopicPromptFactory;
  flashCardRepository: IFlashCardRepository;
  tutorPromptService: ITutorPromptService;
}

export interface IGetSystemPromptArgs {
  tutorId: string;
  studyingLanguageLevel: string;
  chatCategory: string;
  chatTopic: string;
  vocabularySetId?: string;
}
