import { NextFunction, Request, Response } from "express";
import { type Logger } from "winston";
import { IVocabularySetRepository } from "@shared/repositories/vocabularySetRepository";

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
  logger: Logger;
}
