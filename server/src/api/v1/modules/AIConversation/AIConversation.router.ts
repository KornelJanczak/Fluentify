import { Router } from "express";
import aiConversationController from "./aiConversation.controller";

const router = Router();

router.post(
  "/ai-conversation",
  aiConversationController.startConversationWithAI
);

export default router;
