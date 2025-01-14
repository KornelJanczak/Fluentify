import TopicPromptBase from "./topicPromptBase";
import VocabPracticePrompt from "./vocabPracticePrompt";
import AnyTopicPrompt from "./anyTopicPrompt";
import { ITopicPromptFactory } from "@chat/chat.interfaces/topicPrompt.service.interfaces";

class TopicPromptFactory implements ITopicPromptFactory {
  createTopicPrompt(category: string, topic: string): TopicPromptBase {
    switch (category) {
      case "Vocabulary practice":
        return new VocabPracticePrompt({
          topic,
        });
      case "Chat about anything":
        return new AnyTopicPrompt({ topic });
      default:
        throw new Error("Invalid category");
    }
  }
}

export default TopicPromptFactory;
