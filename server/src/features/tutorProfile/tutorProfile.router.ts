import { Router } from "express";
import tutorProfileContainer from "./tutorProfile.container";
import authMiddleware from "@shared/middleware/authMiddleware";
import { validateZodSchema } from "@shared/middleware/validateZodMiddleware";
import { updateTutorProfileSchema } from "./tutorProfile.schema";
import { ITutorProfileController } from "./tutorProfile.interfaces";

const tutorProfileController =
  tutorProfileContainer.resolve<ITutorProfileController>(
    "tutorProfileController"
  );
const router = Router();

router.get(
  "/tutorProfile",
  authMiddleware,
  tutorProfileController.getTutorProfile.bind(tutorProfileController)
);

router.put(
  "/tutorProfile",
  authMiddleware,
  validateZodSchema(updateTutorProfileSchema),
  tutorProfileController.updateTutorProfile.bind(tutorProfileController)
);

export default router;
