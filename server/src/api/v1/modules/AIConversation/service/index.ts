import {
  CoreMessage,
  streamText,
  StreamTextResult,
  CoreTool,
  StreamData,
} from "ai";
import { openai } from "@ai-sdk/openai";
import dotenv from "dotenv";
import * as readline from "node:readline/promises";
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
  private messages: CoreMessage[] = [];
  private userInput: string = "";
  private data: StreamData;

  constructor(userInput: string, streamData: StreamData) {
    this.userInput = userInput;
    this.data = streamData;
  }

  async startConversation(): AIConversationResult {
    while (true) {
      const userInput = await terminal.question(`You: ${this.userInput}`);

      this.messages.push({ role: "user", content: userInput });

      const result = await this.startStreamingText();

      let fullResponse = "";
      process.stdout.write("\nAssistant: ");
      for await (const delta of result.textStream) {
        fullResponse += delta;
        process.stdout.write(delta);
      }
      process.stdout.write("\n\n");

      this.messages.push({ role: "assistant", content: fullResponse });

      return result;
    }
  }

  private async startStreamingText(): AIConversationResult {
    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      prompt: "You are the English teacher.",
      messages: this.messages,
      onFinish() {
        this.data.append("call completed");
        this.data.close();
      },
    });

    return result;
  }
}

export default AIConversationService;
