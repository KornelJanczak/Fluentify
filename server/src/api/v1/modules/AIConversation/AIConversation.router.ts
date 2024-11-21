import { Router } from "express";
import { startConversationWithAI } from "./AIConversation.controller";

const router = Router();

router.post("/ai-conversation", startConversationWithAI);

export default router;
