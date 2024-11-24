import { Router } from "express";
import passport from "passport";
import { authStatusController, logOutController } from "./auth.controller";
import authMiddleware from "../../../../common/middleware/authMiddleware";

const router = Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "email",
      "profile",
      "openid",
      "https://www.googleapis.com/auth/cloud-platform",
    ],
  })
);

router.get(
  "/auth/callback/google",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
  })
);

router.get("/auth/status", authMiddleware, authStatusController);

router.get("/auth/logout", authMiddleware, logOutController);

export default router;