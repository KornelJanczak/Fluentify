import { NextFunction, Request, Response } from "express";
import { type Logger } from "winston";
import { VocabularySet, type FlashCard } from "@services/db/schema";
import { type IVocabularySetRepository } from "@shared/repositories/vocabularySet.repository";

export interface IVocabularySetsController {
  createVocabularySet(req: Request, res: Response, next: NextFunction): void;
  getAllVocabularySetsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
}

export interface IVocabularySetsControllerDependencies {
  vocabularySetRepository: IVocabularySetRepository;
  vocabularySetsService: IVocabularySetsService;
  logger: Logger;
}

export interface IVocabularySetsService {
  createVocabularySet(vocabularySet: ICreateVocabularySetArgs)
}

export interface IVocabularySetsServiceDependencies {}



export interface ICreateVocabularySetArgs {
  userId: string;
  title: string;
  description: string;
  flashCards: Omit<FlashCard, "id">[];
}
