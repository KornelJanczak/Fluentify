import { Router } from "express";
import vocabularySetsContainer from "./vocabularySets.container";
import authMiddleware from "@shared/middleware/authMiddleware";
import { validateZodSchema } from "@shared/middleware/validateZodMiddleware";
import { IVocabularySetsController } from "./vocabularySets.interfaces";
import { createVocabularySetSchema } from "./vocabularySets.schema";

const BASE_PATH = "/vocabulary-set";

const router = Router();
const vocabularySetController =
  vocabularySetsContainer.resolve<IVocabularySetsController>(
    "vocabularySetsController"
  );

router.get(
  BASE_PATH,
  authMiddleware,
  vocabularySetController.getAllVocabularySetsByUserId.bind(
    vocabularySetController
  )
);

router.post(
  BASE_PATH,
  authMiddleware,
  validateZodSchema(createVocabularySetSchema),
  vocabularySetController.createVocabularySet.bind(vocabularySetController)
);

export default router;
