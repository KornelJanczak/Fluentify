import TopicPromptBase from "./topicPromptBase";
import VocabPracticePrompt from "./vocabPracticePrompt";
import AnyTopicPrompt from "./anyTopicPrompt";
import { IFlashCardRepository } from "@shared/repositories/flashCardRepository";

class TopicPromptFactory {
  private readonly flashCardRepository: IFlashCardRepository;
  constructor({
    flashCardRepository,
  }: {
    flashCardRepository: IFlashCardRepository;
  }) {
    this.flashCardRepository = flashCardRepository;
  }

  //   private readonly category: string;
  //   private readonly topic: string;

  createPrompt(category: string, topic: string): TopicPromptBase {
    switch (category) {
      case "Vocabulary practice":
        return new VocabPracticePrompt({
          topic,
          flashCardRepository: this.flashCardRepository,
        });
      case "Chat about anything":
        return new AnyTopicPrompt({ topic });
      default:
        throw new Error("Invalid category");
    }
  }
}
