import { CoreMessage, streamText } from "ai";
import { google } from "@ai-sdk/google";
import aiCharactersInitialPrompts from "../../../../../common/AI/prompts";
import {
  AIConversationAbstract,
  AIConversationResult,
} from "../aiConversation.interfaces";

class AIConversationService implements AIConversationAbstract {
  private messages: CoreMessage[] = [];

  constructor(messages: CoreMessage[]) {
    this.messages = messages;
  }

  async startConversation(): AIConversationResult {
    const result = await this.startStreamingText();
    return result;
  }

  private async startStreamingText(): AIConversationResult {
    const systemPrompt =
      aiCharactersInitialPrompts.johnFromAmerica("my daily routine");

    const result = await streamText({
      model: google("gemini-1.5-pro"),
      system: systemPrompt,
      messages: this.messages,
    });

    return result;
  }
}

export default AIConversationService;
