import { Router } from "express";
import AIConversationRouter from "./AIConversation/AIConversation.router";
import authRouter from "./auth/auth.router";

const router = Router();

router.use(authRouter);
router.use(AIConversationRouter);

export default router;
