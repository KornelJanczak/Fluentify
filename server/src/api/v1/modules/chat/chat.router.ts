import { Router } from "express";
import chatController from "./chat.controller";
import authMiddleware from "../../../../common/middleware/authMiddleware";

const router = Router();

router.post("/chat", authMiddleware, chatController.startChat);
router.post("/create-chat", authMiddleware, chatController.createChat);
router.get("/chat/:id", authMiddleware, chatController.getChat);

export default router;
