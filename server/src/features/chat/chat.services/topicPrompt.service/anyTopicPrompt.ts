import { Logger } from "winston";
import TopicPromptBase from "./topicPromptBase";

class AnyTopicPrompt extends TopicPromptBase {
  protected readonly category = "Chat about anything";
  protected readonly topic: string;
  protected readonly topics = [
    {
      topic: "Anything",
      additionalRules: ` 
          - You can talk about anything you want
          - You can ask student about anything       
          - If student is not talking you can ask him about his day
          - You can ask student about his hobbies
          - If student start some topic let him talk about it and ask questions about it    
        `,
    },
    {
      topic: "Chat with lots slangs and idioms",
      additionalRules: `
        - You should use slangs from English speaking sphere that you are
        - You should use as many slangs and idioms as possible, but with keeping natural conversation flow
        - You should explain slangs and idioms if student doesn't understand them
      `,
    },
    {
      topic: "One of my interests",
      additionalRules: `
        - You should talk about one of student interests at the beggining of the conversation
        - You should asking question about details of student interest
      `,
    },
  ];

  constructor(topic: string, logger: Logger) {
    super(topic, logger);
  }
}

export default AnyTopicPrompt;
