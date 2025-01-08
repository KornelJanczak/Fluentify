import { IFlashCardRepository } from "@shared/repositories/flashCardRepository";
import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";

export interface IFlashCardsController {
  createFlashCard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  getAllFlashCardsByVocabularySetId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  updateFlashCard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  deleteFlashCard(req: Request, res: Response): Promise<Response>;
}

export interface IFlashCardsControllerDependencies {
  flashCardRepository: IFlashCardRepository;
  logger: Logger;
}
