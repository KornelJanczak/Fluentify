import { Router } from "express";
import chatController from "./chat.controller";
import authMiddleware from "@shared/middleware/authMiddleware";

const router = Router();

router.post("/chat", authMiddleware, chatController.startChat);
router.post("/create-chat", authMiddleware, chatController.createChat);
router.get("/chat/:id", authMiddleware, chatController.getChat);
router.get(
  "/chat/:id/messages",
  authMiddleware,
  chatController.getMessagesByChatId
);

export default router;
