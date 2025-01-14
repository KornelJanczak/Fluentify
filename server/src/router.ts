import { Application } from "express";
import authRouter from "@auth/auth.router";
import chatRouter from "@chat/chat.router";
import vovabularySetRouter from "@vocabularySets/vocabularySets.router";
import flashCardsRouter from "@flashCards/flashCards.router";

const BASE_PATH = "/api/v1";

export default (app: Application) => {
  const routes = () => {
    app.use(BASE_PATH, authRouter);
    app.use(BASE_PATH, chatRouter);
    app.use(BASE_PATH, vovabularySetRouter);
    app.use(BASE_PATH, flashCardsRouter);
  };
  routes();
};
