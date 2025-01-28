import { Router } from "express";
import flashCardsContainer from "./flashCards.container";
import authMiddleware from "@shared/middleware/auth.middleware";
import { validateZodSchema } from "@shared/middleware/validateZod.middleware";
import { IFlashCardsController } from "./flashCards.interfaces";
import {
  createFlashCardSchema,
  updateFlashCardSchema,
} from "./flashCards.schema";

const BASE_PATH = "/flash-card";

const router = Router();
const flashCardsController = flashCardsContainer.resolve<IFlashCardsController>(
  "flashCardsController"
);

router.get(
  `${BASE_PATH}/:id`,
  authMiddleware,
  flashCardsController.getAllFlashCardsByVocabularySetId.bind(
    flashCardsController
  )
);

router.post(
  BASE_PATH,
  authMiddleware,
  validateZodSchema(createFlashCardSchema),
  flashCardsController.createFlashCard.bind(flashCardsController)
);

router.put(
  `${BASE_PATH}/:id`,
  authMiddleware,
  validateZodSchema(updateFlashCardSchema),
  flashCardsController.updateFlashCard.bind(flashCardsController)
);

router.delete(
  `${BASE_PATH}/:id`,
  authMiddleware,
  flashCardsController.deleteFlashCard.bind(flashCardsController)
);

export default router;
