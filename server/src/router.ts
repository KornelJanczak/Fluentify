import { Application } from "express";
import authRouter from "@auth/auth.router";
import chatRouter from "@chat/chat.router";
import vocabularySetRouter from "@vocabularySets/vocabularySets.router";
import flashCardsRouter from "@flashCards/flashCards.router";
import { serverAdapter } from "@services/queues/base.queue";

const BASE_PATH = "/api/v1";

export default (app: Application) => {
  // app.use("/queues", serverAdapter.getRouter());
  app.use(BASE_PATH, authRouter);
  app.use(BASE_PATH, chatRouter);
  app.use(BASE_PATH, vocabularySetRouter);
  app.use(BASE_PATH, flashCardsRouter);
};
