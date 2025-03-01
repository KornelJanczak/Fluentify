import { Router } from "express";
import chatContainer from "./chat.container";
import authMiddleware from "@shared/middleware/auth.middleware";
import { validateZodSchema } from "@shared/middleware/validateZod.middleware";
import { createChatSchema, startChatSchema } from "./chat.schema";
import { IChatController } from "@chat/chat.interfaces/controller.interfaces";

const chatController = chatContainer.resolve<IChatController>("chatController");
const router = Router();

router.get(
  "/chat/:id",
  authMiddleware,
  chatController.getChatById.bind(chatController)
);

router.post(
  "/chat",
  authMiddleware,
  validateZodSchema(startChatSchema),
  chatController.startChat.bind(chatController)
);

router.post(
  "/create-chat",
  authMiddleware,
  validateZodSchema(createChatSchema),
  chatController.createChat.bind(chatController)
);

router.get(
  "/chats",
  authMiddleware,
  chatController.getChatsByUserId.bind(chatController)
);

router.get(
  "/chat/:id/messages",
  authMiddleware,
  chatController.getChatWithMessagesByChatId.bind(chatController)
);

router.delete(
  "/chat/:id",
  authMiddleware,
  chatController.deleteChatById.bind(chatController)
);

export default router;
