import { Request, Response, NextFunction } from "express";
import AIConversationService from "./service";
import { StreamData } from "ai";

export const startConversationWithAI = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userInput = req.body.userInput;
    const data = new StreamData();
    data.append("initialized call");

    const AIConversation = new AIConversationService(userInput, data);
    const conversationResult = await AIConversation.startConversation();

    conversationResult.pipeDataStreamToResponse(res, { data });
    res.status(200).json({ message: "Conversations retrieved successfully" });
  } catch (error) {
    next(error);
  }
};
