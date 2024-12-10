import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const customAi = createGoogleGenerativeAI({
  apiKey: process.env.OPENAI_API_KEY,
});
