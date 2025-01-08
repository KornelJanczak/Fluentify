import { scopePerRequest } from "awilix-express";
import { type Application } from "express";
import chatContainer from "@chat/chat.container";
import authContainer from "@auth/auth.container";
import vocabularySetContainer from "@vocabularySets/vocabularySets.container";
import flashCardsContainer from "@flashCards/flashCards.container";

export default (app: Application) => {
  const loadContainer = () => {
    app.use(scopePerRequest(chatContainer));
    app.use(scopePerRequest(authContainer));
    app.use(scopePerRequest(vocabularySetContainer));
    app.use(scopePerRequest(flashCardsContainer));
  };
  loadContainer();
};
