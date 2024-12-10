import { Router } from "express";
import passport from "passport";
import authController from "./auth.controller";
import authMiddleware from "@shared/middleware/authMiddleware";

const router = Router();

const scope = [
  "email",
  "profile",
  "openid",
  "https://www.googleapis.com/auth/cloud-platform",
];

router.get("/auth/status", authController.authStatus);
router.get("/auth/logout", authMiddleware, authController.logOut);
router.get("/auth/session", authMiddleware, authController.authSession);
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope,
  })
);
router.get(
  "/auth/callback/google",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
  })
);

export default router;
