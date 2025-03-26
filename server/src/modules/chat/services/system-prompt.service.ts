import { Injectable } from '@nestjs/common';
import { ServiceError } from 'src/common/service-error';
import { VocabularySetRepository } from 'src/shared/repositories/vocabulary-set.repository';
import { TutorPromptService } from './tutor-prompt.service';
import { GetSystemPromptArgs } from '../chat.interfaces';
import { VocabPractisePrompt } from '../prompts/vocab-practise.prompt';
import { TopicPromptFactoryService } from './topic-prompt-factory.service';
import { SettingsRepository } from 'src/shared/repositories/settings.repository';

@Injectable()
export class SystemPromptService {
  constructor(
    private vocabularySetRepository: VocabularySetRepository,
    private settingsRepository: SettingsRepository,
    private tutorPromptService: TutorPromptService,
    private topicPromptFactoryService: TopicPromptFactoryService,
  ) {}

  public async getSystemPrompt({
    userId,
    chatCategory,
    chatTopic,
    vocabularySetId,
  }: GetSystemPromptArgs): Promise<string> {
    const { tutorId, learningLanguageLevel } =
      await this.findSettingsByUserId(userId);

    const tutorPrompt = this.tutorPromptService.getTutorPrompt(
      tutorId,
      learningLanguageLevel,
    );

    const topicPrompt = await this.generateTopicPrompt(
      chatCategory,
      chatTopic,
      vocabularySetId,
    );

    return `${tutorPrompt}\n/${topicPrompt}`;
  }

  private async generateTopicPrompt(
    chatCategory: string,
    chatTopic: string,
    vocabularySetId?: string,
  ): Promise<string> {
    const topicPrompt = this.topicPromptFactoryService.createTopicPrompt(
      chatCategory,
      chatTopic,
    );

    if (topicPrompt instanceof VocabPractisePrompt && vocabularySetId)
      topicPrompt.useVocabulary(
        await this.findAllFlashCardsByVocabularySetId(vocabularySetId),
      );

    return topicPrompt.getTopicPrompt();
  }

  private async findAllFlashCardsByVocabularySetId(vocabularySetId: string) {
    const flashCards =
      await this.vocabularySetRepository.findAllFlashCardsByVocabularySetId(
        vocabularySetId,
      );

    if (!flashCards) throw ServiceError.NotFoundError('Flash cards not found');

    return flashCards;
  }

  private async findSettingsByUserId(userId: string) {
    const settings = await this.settingsRepository.findByUserId(userId);

    if (!settings) throw ServiceError.NotFoundError('Settings not found');

    return settings;
  }
}
