import {
  ISystemPromptDependencies,
  ISystemPromptService,
  IGetSystemPromptArgs,
} from "@chat/chat.interfaces/systemPrompt.service.interface";
import TopicPromptBase from "./topicPrompt.service/topicPromptBase";
import VocabPracticePrompt from "./topicPrompt.service/vocabPracticePrompt";
import { ITopicPromptFactory } from "@chat/chat.interfaces/topicPrompt.service.interfaces";
import NotFoundError from "@shared/errors/notFoundError";
import { IFlashCardRepository } from "@shared/repositories/flashCardRepository";
import { ITutorPromptService } from "@chat/chat.interfaces/tutorPrompt.service.interfaces";

class SystemPromptService implements ISystemPromptService {
  private readonly fileName = "systemPrompt.service";
  private readonly topicPromptFactory: ITopicPromptFactory;
  private readonly flashCardRepository: IFlashCardRepository;
  private readonly tutorPromptService: ITutorPromptService;

  constructor({
    topicPromptFactory,
    tutorPromptService,
    flashCardRepository,
  }: ISystemPromptDependencies) {
    this.topicPromptFactory = topicPromptFactory;
    this.flashCardRepository = flashCardRepository;
    this.tutorPromptService = tutorPromptService;
  }

  async getSystemPrompt({
    tutorId,
    studyingLanguageLevel,
    chatCategory,
    chatTopic,
    vocabularySetId,
  }: IGetSystemPromptArgs): Promise<string> {
    const tutorPrompt = this.tutorPromptService.getTutorPrompt(
      tutorId,
      studyingLanguageLevel
    );
    const topicPrompt = await this.generateTopicPrompt(
      chatCategory,
      chatTopic,
      vocabularySetId
    );

    return `${tutorPrompt} ${topicPrompt}`;
  }

  private async generateTopicPrompt(
    chatCategory: string,
    chatTopic: string,
    vocabularySetId?: string
  ): Promise<string> {
    const topicPrompt: TopicPromptBase =
      this.topicPromptFactory.createTopicPrompt(chatCategory, chatTopic);

    if (topicPrompt instanceof VocabPracticePrompt && vocabularySetId) {
      const vocabulary = await this.getFlashCardsByVocabularySetId(
        vocabularySetId
      );

      topicPrompt.useVocabulary(vocabulary);
    }


    
    return topicPrompt.getTopicPrompt();
  }

  private async getFlashCardsByVocabularySetId(vocabularySetId: string) {
    const flashCards =
      await this.flashCardRepository.getFlashCardsByVocabularySetId(
        vocabularySetId
      );

    if (!flashCards) {
      throw new NotFoundError({
        fileName: this.fileName,
        service: "getFlashCardsByVocabularySetId",
        message: "Flash cards not found",
      });
    }

    return flashCards;
  }
}

export default SystemPromptService;
