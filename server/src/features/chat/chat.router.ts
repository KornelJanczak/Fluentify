import { Router } from "express";
import chatContainer from "./chat.container";
import authMiddleware from "@shared/middleware/authMiddleware";
import { validateZodSchema } from "@shared/middleware/validateZodMiddleware";
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
  "/chat/:id/messages",
  authMiddleware,
  chatController.getMessagesByChatId.bind(chatController)
);

export default router;
