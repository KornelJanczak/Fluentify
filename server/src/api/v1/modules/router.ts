import { Router } from "express";
import AIConversationRouter from "../modules/AIConversation/router";

const router = Router();

router.use(AIConversationRouter);

export default router;
