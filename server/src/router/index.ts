import { Router } from "express";
import V1Router from "../api/v1/modules/router";

const router = Router();

router.use("/v1", V1Router);

export default router;
