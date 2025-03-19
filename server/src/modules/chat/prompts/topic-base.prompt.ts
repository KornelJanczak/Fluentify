export abstract class TopicBasePrompt {
  protected abstract category: string;
  protected abstract topics: {
    topic: string;
    additionalRules: string;
  }[];

  constructor(protected topic: string) {}

  public getTopicPrompt() {
    return this.chooseAdditionalRules();
  }

  protected chooseAdditionalRules(): string {
    return this.topics.find(({ topic }) => topic === this.topic)
      .additionalRules;
  }
}
