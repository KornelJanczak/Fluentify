import { NextFunction, Router, Response } from "express";
import passport from "passport";
import authMiddleware from "@shared/middleware/auth.middleware";
import { IAuthController } from "./auth.interfaces";
import { scope } from "./strategies/google-strategy";
import authContainer from "./auth.container";
import { config } from "@root/config";

const authController = authContainer.resolve<IAuthController>("authController");
const router = Router();

router.get(
  "/auth/status",
  authMiddleware,
  authController.authStatus.bind(authController)
);

router.get(
  "/auth/session",
  authMiddleware,
  authController.authSession.bind(authController)
);

router.get(
  "/auth/logout",
  authMiddleware,
  authController.logOut.bind(authController)
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope,
  })
);

router.get(
  "/auth/callback/google",
  passport.authenticate("google", {
    successRedirect: config.CLIENT_URL,
  })
);

export default router;
