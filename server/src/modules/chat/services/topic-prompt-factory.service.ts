import { Injectable } from '@nestjs/common';
import { AnythingPrompt } from '../prompts/anything.prompt';
import { VocabPractisePrompt } from '../prompts/vocab-practise.prompt';
import { TopicBasePrompt } from '../prompts/topic-base.prompt';
import { ServiceError } from 'src/common/service-error';

@Injectable()
export class TopicPromptFactoryService {
  public createTopicPrompt(category: string, topic: string): TopicBasePrompt {
    const promptMap: { [key: string]: new (topic: string) => TopicBasePrompt } =
      {
        vocabulary: VocabPractisePrompt,
        anything: AnythingPrompt,
      };

    const PromptClass = promptMap[category];

    if (!PromptClass) throw ServiceError.NotFoundError('Invalid category');

    return new PromptClass(topic);
  }
}
