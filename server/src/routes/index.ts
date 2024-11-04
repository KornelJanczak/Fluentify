import { Router, Request, Response, NextFunction } from "express";
import { checkJwt } from "../middleware/authMiddleware";
import asyncHandler from "express-async-handler";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("halo");

  res.status(200).send({ message: "Server Running..." });
});

router.get(
  "/abc",
  checkJwt,
  (req: Request, res: Response, next: NextFunction) => {
    console.log("halo");

    res.status(200).send({ message: "Server Running..." });
  }
);

router.get(
  "/private-route",
  checkJwt,
  asyncHandler(async (req, res, next) => {
    res.status(200).send({ message: "This is a private route" });
  })
);

export default router;
