import {
  IVocabularySetsController,
  IVocabularySetsControllerDependencies,
  IVocabularySetsService,
} from "./vocabularySets.interfaces";
import { NextFunction, Request, Response } from "express";
import HTTP_STATUS from "http-status-codes";
import { Logger } from "winston";
import { User } from "@services/db/schema";
import { HttpError } from "@shared/errors/http.error";

class VocabularySetsController implements IVocabularySetsController {
  private readonly vocabularySetsService: IVocabularySetsService;
  private readonly logger: Logger;

  constructor({
    vocabularySetsService,
    logger,
  }: IVocabularySetsControllerDependencies) {
    this.vocabularySetsService = vocabularySetsService;
    this.logger = logger;
  }

  public async createVocabularySet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const user: User = req.user as User;
    const { body } = req;

    this.logger.info(`Create vocabulary set for user ${user.id}`);

    try {
      const vocabularySetId =
        await this.vocabularySetsService.createVocabularySet({
          userId: user.id,
          description: body.description,
          title: body.title,
          flashCards: body.flashCards,
        });

      return res.status(HTTP_STATUS.OK).json({ vocabularySetId });
    } catch (error) {
      return next(
        HttpError.InternalServerError({
          message: error.message,
          stack: error.stack,
        })
      );
    }
  }

  public async getAllVocabularySetsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const user: User = req.user as User;

    this.logger.info(`Get vocabulary sets by user id: ${user.id}`);

    try {
      const vocabularySets =
        await this.vocabularySetsService.getAllVocabularySetsByUserId(user.id);

      return res.status(HTTP_STATUS.OK).json(vocabularySets);
    } catch (error) {
      return next(
        HttpError.InternalServerError({
          message: error.message,
          stack: error.stack,
        })
      );
    }
  }
}

export default VocabularySetsController;
