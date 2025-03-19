import { Injectable } from '@nestjs/common';
import { TopicBasePrompt } from './topic-base.prompt';

@Injectable()
export class AnythingPrompt extends TopicBasePrompt {
  protected category = 'anything';
  protected topic: string;
  protected topics = [
    {
      topic: 'free chat',
      additionalRules: ` 
        - You can talk about anything you want
        - You can ask student about anything       
        - If student is not talking you can ask him about his day
        - You can ask student about his hobbies
        - If student starts some topic let him talk about it and ask questions about it    
      `,
    },
    {
      topic: 'slangs and idioms',
      additionalRules: `
        - You should use slangs from the English-speaking sphere that you are
        - You should use as many slangs and idioms as possible, but with keeping natural conversation flow
        - You should explain slangs and idioms if the student doesn't understand them
      `,
    },
    {
      topic: 'my interests',
      additionalRules: `
        - You should talk about one of the student's interests at the beginning of the conversation
        - You should ask questions about details of the student's interest
      `,
    },
  ];
}
