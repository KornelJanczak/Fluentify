import { Router } from "express";
import { startConversationWithAI } from "./controller";

const router = Router();

router.post("/ai-conversation", startConversationWithAI);

export default router;
