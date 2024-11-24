import {
  CoreMessage,
  streamText,
  StreamTextResult,
  CoreTool,
  StreamData,
  tool,
} from "ai";
import { openai } from "@ai-sdk/openai";
import dotenv from "dotenv";
import * as readline from "node:readline/promises";
import { customAi } from "../../../../../common/AI";
import { google } from "@ai-sdk/google";
import aiCharactersInitialPrompts from "../../../../../common/AI/prompts";
dotenv.config();

type AIConversationResult = Promise<
  StreamTextResult<Record<string, CoreTool<any, any>>>
>;

interface AIConversationAbstract {
  startConversation(): AIConversationResult;
}

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class AIConversationService implements AIConversationAbstract {
  private userInput: string = "";
  private data: StreamData;
  private messages: CoreMessage[] = [];

  constructor(userInput: string, streamData: StreamData) {
    this.userInput = userInput;
    this.data = streamData;
  }

  async startConversation(): AIConversationResult {
    const result = await this.startStreamingText();
    return result;
  }

  private async startStreamingText(): AIConversationResult {
    this.messages.push({ role: "user", content: this.userInput });

    const streamingData = this.data;

    const systemPrompt = aiCharactersInitialPrompts.johnFromAmerica("my daily routine")

    const result = await streamText({
      model: google("gemini-1.5-pro"),
      system: systemPrompt,
      prompt: this.userInput,
      onFinish() {
        streamingData.append({ id: "1" });
        streamingData.close();
      },
    });

    return result;
  }
}

export default AIConversationService;
