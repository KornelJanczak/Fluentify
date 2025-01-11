import { ITopicPromptBaseDependencies } from "@chat/chat.interfaces";

abstract class TopicPromptBase {
  protected abstract readonly category: string;
  protected abstract readonly topics: {
    topic: string;
    additionalRules: string;
  }[];
  protected readonly topic: string;

  constructor({ topic }: ITopicPromptBaseDependencies) {
    this.topic = topic;
  }

  getTopicPrompt() {
    return this.chooseAdditionalRules();
  }

  protected chooseAdditionalRules(): string {
    return this.topics.find(({ topic }) => topic === this.topic)
      .additionalRules;
  }
}

export default TopicPromptBase;
