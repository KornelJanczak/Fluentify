import { Router } from "express";
import passport from "passport";
import { authStatusController, logOutController } from "./controller";
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
  passport.authenticate("google"),
  (req, res) => {
    // console.log(req.session);
    // console.log(req.user);
    res.redirect("http://localhost:3000");
  }
);

router.get("/auth/status", authStatusController);

router.get("/auth/logout", authMiddleware, logOutController);

export default router;
