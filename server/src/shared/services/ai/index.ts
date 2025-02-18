import { createOpenAI } from "@ai-sdk/openai";
import { config } from "@root/config";

export const customAi = createOpenAI({
  apiKey: config.OPENAI_API_KEY,
});
