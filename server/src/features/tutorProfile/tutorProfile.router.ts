import { Router } from "express";
import { tutorProfileController } from "./tutorProfile.controller";
import authMiddleware from "@shared/middleware/authMiddleware";
import { validateZodSchema } from "@shared/middleware/validateZodMiddleware";
import { updateTutorProfileSchema } from "./tutorProfile.schema";

const router = Router();

router.get(
  "/tutorProfile",
  authMiddleware,
  tutorProfileController.getTutorProfile
);

router.put(
  "/tutorProfile",
  authMiddleware,
  validateZodSchema(updateTutorProfileSchema),
  tutorProfileController.updateTutorProfile
);

export default router;
