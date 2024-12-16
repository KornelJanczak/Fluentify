import { Router } from "express";
import chatController from "./chat.controller";
import authMiddleware from "@shared/middleware/authMiddleware";
import { validateZodSchema } from "@shared/middleware/validateZodMiddleware";
import { createChatSchema, startChatSchema } from "./chat.schema";

const router = Router();

router.post(
  "/chat",
  authMiddleware,
  validateZodSchema(startChatSchema),
  chatController.startChat
);

router.post(
  "/create-chat",
  authMiddleware,
  validateZodSchema(createChatSchema),
  chatController.createChat
);

router.get("/chat/:id", authMiddleware, chatController.getChat);
router.get(
  "/chat/:id/messages",
  authMiddleware,
  chatController.getMessagesByChatId
);

export default router;
