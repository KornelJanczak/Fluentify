// import {
//   IFlashCardsController,
//   IFlashCardsControllerDependencies,
// } from "./flashCards.interfaces";
// import { Request, Response, NextFunction } from "express";
// import HTTP_STATUS from "http-status-codes";
// import NotFoundError from "@shared/errors/notFound.error";
// import { Logger } from "winston";
// import { User } from "@services/db/schema";
// import { IFlashCardRepository } from "@shared/repositories/flashCard.repository";

// class FlashCardsController implements IFlashCardsController {
//   private readonly flashCardRepository: IFlashCardRepository;
//   private readonly fileName = "FlashCardsController";
//   private readonly logger: Logger;

//   constructor({
//     flashCardRepository,
//     logger,
//   }: IFlashCardsControllerDependencies) {
//     this.flashCardRepository = flashCardRepository;
//     this.logger = logger;
//   }

//   public async createFlashCard(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     this.logger.info({
//       message: "Creating flash card...",
//       fileName: this.fileName,
//       service: "createFlashCard",
//     });

//     const { body } = req;
//     const user: User = req.user as User;
//     const newItem = { ...body, userId: user.id };

//     const createdFlashCard = await this.flashCardRepository.create(newItem);

//     if (!createdFlashCard) {
//       next(
//         new NotFoundError({
//           message: "Flash card not created",
//           fileName: this.fileName,
//           service: "createFlashCard",
//         })
//       );
//     }

//     return res.status(HTTP_STATUS.OK).json(createdFlashCard);
//   }

//   public async getAllFlashCardsByVocabularySetId(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     this.logger.info({
//       message: "Getting all flash cards by vocabulary set ID...",
//       fileName: this.fileName,
//       service: "getAllFlashCardsByVocabularySetId",
//     });

//     const { vocabularySetId } = req.params;

//     const flashCards =
//       await this.flashCardRepository.getFlashCardsByVocabularySetId(
//         vocabularySetId
//       );

//     if (!flashCards) {
//       next(
//         new NotFoundError({
//           message: "Flash cards not found for this vocabulary set",
//           fileName: this.fileName,
//           service: "getAllFlashCardsByVocabularySetId",
//         })
//       );
//     }

//     return res.status(HTTP_STATUS.OK).json(flashCards);
//   }

//   public async updateFlashCard(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     this.logger.info({
//       message: "Updating flash card...",
//       fileName: this.fileName,
//       service: "updateFlashCard",
//     });

//     const { body } = req;
//     const { flashCardId } = req.params;
//     const user: User = req.user as User;

//     const updatedFlashCard = await this.flashCardRepository.updateFlashCardById(
//       { ...body, id: flashCardId, userId: user.id }
//     );

//     if (!updatedFlashCard) {
//       next(
//         new NotFoundError({
//           message: "Flash card not updated",
//           fileName: this.fileName,
//           service: "updateFlashCard",
//         })
//       );
//     }

//     return res.status(HTTP_STATUS.OK).json(updatedFlashCard);
//   }

//   public async deleteFlashCard(req: Request, res: Response) {
//     this.logger.info({
//       message: "Deleting flash card...",
//       fileName: this.fileName,
//       service: "deleteFlashCard",
//     });

//     const { flashCardId } = req.params;

//     await this.flashCardRepository.deleteFlashCardById(flashCardId);

//     return res
//       .status(HTTP_STATUS.OK)
//       .json({ message: "Flash card has been deleted" });
//   }
// }

// export default FlashCardsController;
