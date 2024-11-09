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
    const userInput = req.body.userInput;
    const data = new StreamData();

    const AIConversation = new AIConversationService(userInput, data);
    const conversationResult = await AIConversation.startConversation();

    // conversationResult.pipeTextStreamToResponse(res);
    conversationResult.pipeDataStreamToResponse(res, { data });
  } catch (error) {
    next(error);
  }
};
