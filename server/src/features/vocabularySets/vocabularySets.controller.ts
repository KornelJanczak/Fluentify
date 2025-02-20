import {
  IVocabularySetsController,
  IVocabularySetsControllerDependencies,
  IVocabularySetsService,
} from "./vocabularySets.interfaces";
import { NextFunction, Request, Response } from "express";
import HTTP_STATUS from "http-status-codes";
import { Logger } from "winston";
import { User } from "@services/db/schema";

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

    try {
      const vocabularySetId =
        await this.vocabularySetsService.createVocabularySet({
          userId: user.id,
          description: body.description,
          title: body.title,
          flashCards: body.flashCards,
        });

      this.logger.info(
        `Create vocabulary set for user ${user.id}, vocabulary set id: ${vocabularySetId}`
      );

      return res.status(HTTP_STATUS.OK).json({ vocabularySetId });
    } catch (error) {
      return next(error);
    }
  }

  public async getAllVocabularySetsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const user: User = req.user as User;

    try {
      const vocabularySets =
        await this.vocabularySetsService.getAllVocabularySetsByUserId(user.id);

      this.logger.info(`Get vocabulary sets by user id: ${user.id}`);

      return res.status(HTTP_STATUS.OK).json(vocabularySets);
    } catch (error) {
      return next(error);
    }
  }

  public async getVocabularySetWithFlashCardsById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user: User = req.user as User;
    const { id } = req.params;

    try {
      const vocabularySet =
        await this.vocabularySetsService.getVocabularySetWithFlashCardsById(id);

      this.logger.info(
        `Get vocabulary set with flash cards by id: ${id} for user: ${user.id}`
      );

      return res.status(HTTP_STATUS.OK).json(vocabularySet);
    } catch (error) {
      return next(error);
    }
  }
}

export default VocabularySetsController;
