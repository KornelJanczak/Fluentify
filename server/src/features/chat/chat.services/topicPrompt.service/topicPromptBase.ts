import { Logger } from "winston";

abstract class TopicPromptBase {
  protected abstract readonly category: string;
  protected abstract readonly topics: {
    topic: string;
    additionalRules: string;
  }[];
  protected readonly topic: string;
  protected readonly logger: Logger;

  constructor(topic: string, logger: Logger) {
    this.topic = topic;
    this.logger = logger;
  }

  protected chooseAdditionalRules(): string {
    return this.topics.find(({ topic }) => topic === this.topic)
      .additionalRules;
  }
}

export default TopicPromptBase;
