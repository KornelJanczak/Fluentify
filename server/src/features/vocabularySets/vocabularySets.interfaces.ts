import { NextFunction, Request, Response } from "express";
import { type Logger } from "winston";
import { VocabularySet, type FlashCard } from "@services/db/schema";
import {
  IVocabularySetRepository,
  VocabularySetWithFlashCardsCount,
} from "@shared/repositories/vocabularySet.repository";

export interface IVocabularySetsController {
  createVocabularySet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  getAllVocabularySetsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
}

export interface IVocabularySetsControllerDependencies {
  vocabularySetsService: IVocabularySetsService;
  logger: Logger;
}

export interface IVocabularySetsService {
  createVocabularySet(vocabularySet: ICreateVocabularySetArgs): Promise<string>;
  getAllVocabularySetsByUserId(
    userId: string
  ): Promise<VocabularySetWithFlashCardsCount[]>;
}

export interface IVocabularySetsServiceDependencies {
  vocabularySetRepository: IVocabularySetRepository;
}

export interface ICreateVocabularySetArgs {
  userId: string;
  title: string;
  description: string;
  flashCards: Omit<FlashCard, "id">[];
}
