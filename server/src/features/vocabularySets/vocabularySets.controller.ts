import { IVocabularySetRepository } from "@shared/repositories/vocabularySetRepository";
import {
  IVocabularySetsController,
  IVocabularySetsControllerDependencies,
} from "./vocabularySets.interfaces";
import { NextFunction, Request, Response } from "express";
import HTTP_STATUS from "http-status-codes";
import NotFoundError from "@shared/errors/notFoundError";
import { Logger } from "winston";
import { User } from "@shared/services/db/schema";

class VocabularySetsController implements IVocabularySetsController {
  private readonly vocabularySetRepository: IVocabularySetRepository;
  private readonly fileName = "VocabularySetController";
  private readonly logger: Logger;

  constructor({
    vocabularySetRepository,
    logger,
  }: IVocabularySetsControllerDependencies) {
    this.vocabularySetRepository = vocabularySetRepository;
    this.logger = logger;
  }

  async createVocabularySet(req: Request, res: Response, next: NextFunction) {
    this.logger.info({
      message: "Creating vocabulary set...",
      fileName: this.fileName,
      service: "createVocabularySet",
    });

    const { body } = req;

    const user: User = req.user as User;
    const newItem = { ...body, userId: user.id };

    const createdVocabularySet = await this.vocabularySetRepository.create(
      newItem
    );

    if (!createdVocabularySet) {
      next(
        new NotFoundError({
          message: "Vocabulary set not created",
          fileName: this.fileName,
          service: "createVocabularySet",
        })
      );
    }

    return res.status(HTTP_STATUS.OK).json(createdVocabularySet);
  }

  async getAllVocabularySetsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    this.logger.info({
      message: "Getting all vocabulary sets...",
      fileName: this.fileName,
      service: "getAllVocabularySets",
    });

    const user: User = req.user as User;

    const vocabularySets = await this.vocabularySetRepository.getAllByUserId(
      user.id
    );

    if (!vocabularySets) {
      next(
        new NotFoundError({
          message: "Vocabulary sets not found for this user",
          fileName: this.fileName,
          service: "getAllVocabularySets",
        })
      );
    }

    return res.status(HTTP_STATUS.OK).json(vocabularySets);
  }
}

export default VocabularySetsController;
