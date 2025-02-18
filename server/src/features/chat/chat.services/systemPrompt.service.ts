import {
  ISystemPromptDependencies,
  ISystemPromptService,
  IGetSystemPromptArgs,
} from "@chat/chat.interfaces/systemPrompt.service.interface";
import TopicPromptBase from "./topicPrompt.service/topicPromptBase";
import VocabPracticePrompt from "./topicPrompt.service/vocabPracticePrompt";
import { ITopicPromptFactory } from "@chat/chat.interfaces/topicPrompt.service.interfaces";
import { IFlashCardRepository } from "@shared/repositories/flashCard.repository";
import { ITutorPromptService } from "@chat/chat.interfaces/tutorPrompt.service.interfaces";
import { ServiceError } from "@shared/errors/service.error";

class SystemPromptService implements ISystemPromptService {
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
      throw ServiceError.NotFound({
        message: "Flash cards not found",
      });
    }

    return flashCards;
  }
}

export default SystemPromptService;
