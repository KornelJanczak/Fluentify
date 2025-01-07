import { scopePerRequest } from "awilix-express";
import { Application } from "express";
import chatContainer from "@chat/chat.container";
import authContainer from "@auth/auth.container";
import vocabularySetContainer from "@root/features/vocabularySets/vocabularySets.container";

export default (app: Application) => {
  const loadContainer = () => {
    app.use(scopePerRequest(chatContainer));
    app.use(scopePerRequest(authContainer));
    app.use(scopePerRequest(vocabularySetContainer));
  };
  loadContainer();
};
