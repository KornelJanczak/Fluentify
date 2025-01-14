import TopicPromptBase from "../chat.services/topicPrompt.service/topicPromptBase";


export interface ITopicPromptBaseDependencies {
  // logger: Logger;
  topic: string;
}

export interface IVocabPraticePromptDependencies
  extends ITopicPromptBaseDependencies {
  // flashCardRepository: IFlashCardRepository;
}

export interface ITopicPromptFactory {
  createTopicPrompt: (category: string, topic: string) => TopicPromptBase;
}

export interface ITopicPromptFactoryDependencies {
  category: string;
  topic: string;
}
