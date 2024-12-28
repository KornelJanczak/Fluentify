import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const customAi = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
