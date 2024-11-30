import { Request, Response, NextFunction } from "express";
import AIConversationService from "./service";

class AIConversationController {
  async startConversationWithAI(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const messages = req.body.messages;

      const AIConversation = new AIConversationService(messages);
      const conversationResult = await AIConversation.startConversation();

      return conversationResult.pipeDataStreamToResponse(res);
    } catch (error) {
      next(error);
    }
  }
}

const aiConversationController = new AIConversationController();
export default aiConversationController;
