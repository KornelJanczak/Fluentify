import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";

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

router.get("/auth/callback/google", passport.authenticate("google"));

router.get("/auth/status", (req: Request, res: Response) => {
  console.log(req.user, "STATUS USER");
  req.user;

  req.user ? res.send(req.user) : res.sendStatus(401);
});

router.get(
  "/auth/logout",
  (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      console.log("chuj");

      if (err) return next(err);

      res.send(200);
    });
  }
);

export default router;
