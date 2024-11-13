import { Router } from "express";

const router: Router = Router();

router.get("/auth/kinde_callback", (req, res) => {
  console.log(req);

  res.send("Hello World");
});

export default router;
