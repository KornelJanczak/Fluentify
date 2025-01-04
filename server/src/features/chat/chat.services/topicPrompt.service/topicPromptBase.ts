import { Logger } from "winston";

abstract class TopicPromptBase {
  protected abstract readonly topic: string;
  protected abstract readonly logger: Logger;
  protected readonly category: string;
  protected topicsRules = [
    {
      category: "Chat about anything",
      topics: [
        {
          topic: "Anything",
          additonalRules: ` 
            - You can talk about anything you want
            - You can ask student about anything       
            - If student is not talking you can ask him about his day
            - You can ask student about his hobbies
            - If student start some topic let him talk about it and ask questions about it    
          `,
        },
        {
          topic: "One of my interests",
          additonalRules: "",
        },
        {
          topic: "My goals & aspirations",
          additonalRules: "",
        },
      ],
    },
  ];

  constructor(category: string) {
    this.category = category;
  }

  abstract generateTopicPrompt(): string;

  protected abstract mergeBasePromptWithTopicPrompt(): string;
}

export default TopicPromptBase;
