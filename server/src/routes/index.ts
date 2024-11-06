import jwtVerifer from "../common/middleware/authMiddleware";
import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("halo");

  res.status(200).send({ message: "Server Running..." });
});

router.get(
  "/protected",
  //@ts-ignore
  jwtVerifer,
  (req: Request, res: Response, next: NextFunction) => {
    console.log("token is valid!");

    console.log(req.headers.authorization);

    res.status(200).send({ message: "Server Running..." });
  }
);

export default router;
