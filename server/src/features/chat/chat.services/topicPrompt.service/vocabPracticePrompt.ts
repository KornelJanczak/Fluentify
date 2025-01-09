import { IVocabPraticePromptDependencies } from "@chat/chat.interfaces";
import TopicPromptBase from "./topicPromptBase";
import { Logger } from "winston";
import { IFlashCardRepository } from "@shared/repositories/flashCardRepository";
import NotFoundError from "@shared/errors/notFoundError";
import { FlashCard } from "@shared/services/db/schema";
import { tool } from "ai";
import { z } from "zod";

class VocabPracticePrompt extends TopicPromptBase {
  private flashCardRepository: IFlashCardRepository;
  protected category = "Vocabulary practice";
  protected topic: string;
  protected topics = [
    {
      topic: "Practice vocabulary word by word",
      additionalRules: `
      - You should 
      - If student doesn't know the translation you should say it
      - You should ask student to repeat the word after you
      - You should ask student to use the word in a sentence
    `,
    },
  ];

  constructor(dependencies: IVocabPraticePromptDependencies) {
    super(dependencies);
  }

  useLearningVocabularyTool() {
    return tool({
      description: "Get learning vocabulary from db and use it to practice",
      parameters: z.object({
        vocabularySetId: z.string().describe("Id of the vocabulary set"),
      }),
      execute: async ({ vocabularySetId }) => {
        return await this.getFlashCardsByVocabularySetId(vocabularySetId);
      },
    });
  }

  private formatFlashCardsIntoStrings(flashCards: FlashCard[]): string[] {
    return flashCards.map(
      ({ definition, translation }) => `${definition} - ${translation}`
    );
  }

  private async getFlashCardsByVocabularySetId(
    vocabularySetId: string
  ): Promise<FlashCard[]> {
    const service = "getFlashCardsByVocabularySetId";

    // this.logger.info({
    //   message: "Getting flash cards by vocabulary set id",
    //   service,
    // });

    const flashCards =
      await this.flashCardRepository.getFlashCardsByVocabularySetId(
        vocabularySetId
      );

    if (!flashCards) {
      throw new NotFoundError({
        service,
        message: "Flash cards not found",
      });
    }

    return flashCards;
  }
}

export default VocabPracticePrompt;
