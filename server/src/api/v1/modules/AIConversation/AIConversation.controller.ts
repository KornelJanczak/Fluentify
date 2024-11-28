import { Request, Response, NextFunction } from "express";
import AIConversationService from "./service";
import { StreamData } from "ai";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { customAi } from "../../../../common/AI";
import { google } from "@ai-sdk/google";

export const startConversationWithAI = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const messages = req.body.messages;

    console.log(messages);

    const data = new StreamData();

    const AIConversation = new AIConversationService(messages, data);
    const conversationResult = await AIConversation.startConversation();

    return conversationResult.pipeTextStreamToResponse(res);
    // return conversationResult.toDataStreamResponse();
  } catch (error) {
    next(error);
  }
};
