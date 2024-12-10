import { Application } from "express";
import authMiddleware from "@shared/middleware/authMiddleware";
import authRouter from "@auth/auth.router";
import chatRouter from "@chat/chat.router";

const BASE_PATH = "/api/v1";

export default (app: Application) => {
  const routes = () => {
    app.use(BASE_PATH, authMiddleware, authRouter);
    app.use(BASE_PATH, authMiddleware, chatRouter);
  };
  routes();
};
