import HTTP_STATUS from "http-status-codes";
import type {
  IVocabularySetsController,
  IVocabularySetsControllerDependencies,
  IVocabularySetsService,
} from "./vocabularySets.interfaces";
import type { NextFunction, Request, Response } from "express";
import type { Logger } from "winston";
import type { User } from "@services/db/schema";

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
    const { page, searchInput } = req.params;

    try {
      const vocabularySets =
        await this.vocabularySetsService.getAllVocabularySetsByUserId(
          user.id,
          page,
          searchInput
        );

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

  public async updateVocabularySet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { body } = req;
    const { id } = req.params;

    try {
      const vocabularySetId =
        await this.vocabularySetsService.updateVocabularySet(id, body);

      this.logger.info(`Update vocabulary set by id: ${id}`);

      return res.status(HTTP_STATUS.OK).json({ vocabularySetId });
    } catch (error) {
      return next(error);
    }
  }

  public async deleteVocabularySet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const user: User = req.user as User;
    const { id } = req.params;

    try {
      await this.vocabularySetsService.deleteVocabularySet(id);

      this.logger.info(`Delete vocabulary set by id: ${id} by user ${user.id}`);

      return res
        .status(HTTP_STATUS.OK)
        .json({ message: "Vocabulary set has been deleted" });
    } catch (error) {
      return next(error);
    }
  }
}

export default VocabularySetsController;
