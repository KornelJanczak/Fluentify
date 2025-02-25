import { NextFunction, Request, Response } from "express";
import { type Logger } from "winston";
import { VocabularySet, type FlashCard } from "@services/db/schema";
import {
  IVocabularySetRepository,
  VocabularySetWithFlashCards,
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
  getVocabularySetWithFlashCardsById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  updateVocabularySet(
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
    userId: string,
    page: string
  ): Promise<VocabularySetWithFlashCardsCount[]>;
  getVocabularySetWithFlashCardsById(
    id: string
  ): Promise<VocabularySetWithFlashCards>;
  updateVocabularySet(
    id: string,
    vocabularySet: VocabularySetWithFlashCards
  ): Promise<string>;
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
