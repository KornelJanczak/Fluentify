import TopicPromptBase from "./topicPromptBase";
import { Logger } from "winston";

class VocabPracticePrompt extends TopicPromptBase {
  protected category = "Vocabulary practice";
  protected topic: string;
  protected topics = [];

  constructor(topic: string, logger: Logger) {
    super(topic, logger);
  }
}

export default VocabPracticePrompt;
