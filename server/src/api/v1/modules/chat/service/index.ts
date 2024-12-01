import { CoreMessage, streamText } from "ai";
import { google } from "@ai-sdk/google";
import aiCharactersInitialPrompts from "../../../../../common/AI/prompts";
import { ChatServiceAbstract, ChatResult } from "../chat.interfaces";

class ChatService implements ChatServiceAbstract {
  private messages: CoreMessage[] = [];

  constructor(messages: CoreMessage[]) {
    this.messages = messages;
  }

  async execute(): ChatResult {
    const result = await this.startStreamingText();
    return result;
  }

  private async startStreamingText(): ChatResult {
    const systemPrompt =
      aiCharactersInitialPrompts.johnFromAmerica("my daily routine");

    const result = await streamText({
      model: google("gemini-1.5-pro"),
      system: systemPrompt,
      messages: this.messages,
    });

    console.log(result);

    return result;
  }
}

export default ChatService;
