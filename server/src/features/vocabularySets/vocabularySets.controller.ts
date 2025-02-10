import { IVocabularySetRepository } from "@shared/repositories/vocabularySet.repository";
import {
  IVocabularySetsController,
  IVocabularySetsControllerDependencies,
  IVocabularySetsService,
} from "./vocabularySets.interfaces";
import { NextFunction, Request, Response } from "express";
import HTTP_STATUS from "http-status-codes";
import NotFoundError from "@shared/errors/notFound.error";
import { Logger } from "winston";
import { User } from "@services/db/schema";

class VocabularySetsController implements IVocabularySetsController {
  private readonly vocabularySetRepository: IVocabularySetRepository;
  private readonly vocabularySetsService: IVocabularySetsService;
  private readonly fileName = "vocabularySet.controller";
  private readonly logger: Logger;

  constructor({
    vocabularySetRepository,
    vocabularySetsService,
    logger,
  }: IVocabularySetsControllerDependencies) {
    this.vocabularySetRepository = vocabularySetRepository;
    this.vocabularySetsService = vocabularySetsService;
    this.logger = logger;
  }

  async createVocabularySet(req: Request, res: Response, next: NextFunction) {
    const service = "createVocabularySet";
    const user: User = req.user as User;
    const { body } = req;

    this.logger.info({
      message: "Creating vocabulary set...",
      fileName: this.fileName,
      service,
    });

    await this.vocabularySetsService.createVocabularySet({
      userId: user.id,
      description: body.description,
      title: body.title,
      flashCards: body.flashCards,
    });

    // const createdVocabularySet =
    //   await this.vocabularySetRepository.createNewVocabularySet(
    //     newVocabularySet
    //   );

    // if (!createdVocabularySet) {
    //   return next(
    //     new NotFoundError({
    //       message: "Vocabulary set not created",
    //       fileName: this.fileName,
    //       service: "createVocabularySet",
    //     })
    //   );
    // }

    // this.logger.info({
    //   message: "Vocabulary set has been created!",
    //   fileName: this.fileName,
    //   service,
    // });

    // return res.status(HTTP_STATUS.OK).json(createdVocabularySet);
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
      return next(
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
