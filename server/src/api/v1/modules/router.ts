import { Router } from "express";
import AIConversationRouter from "../modules/AIConversation/router";
import authRouter from "../modules/auth/router";

const router = Router();

router.use(authRouter);
router.use(AIConversationRouter);

export default router;
