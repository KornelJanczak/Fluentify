import {
  ITutorProfileController,
  ITutorProfileControllerDependencies,
} from "./tutorProfile.interfaces";
import { Request, Response } from "express";
import { User } from "@shared/services/db/schema";
import HTTP_STATUS from "http-status-codes";
import { ITutorProfileRepository } from "@shared/repositories/tutorProfileRepository";

class TutorProfileController implements ITutorProfileController {
  private tutorProfileRepository: ITutorProfileRepository;

  constructor({ tutorProfileRepository }: ITutorProfileControllerDependencies) {
    this.tutorProfileRepository = tutorProfileRepository;
  }

  async getTutorProfile(req: Request, res: Response) {
    const user: User = req.user as User;
    const tutorProfile =
      await this.tutorProfileRepository.getTutorProfileByUserId(user.id);

    return res.status(HTTP_STATUS.OK).json(tutorProfile);
  }

  async updateTutorProfile(req: Request, res: Response) {
    const user: User = req.user as User;
    const updatedProfile =
      await this.tutorProfileRepository.updateTutorProfileByUserId(user.id, {
        userId: user.id,
        ...req.body,
      });

    return res.status(HTTP_STATUS.OK).json(updatedProfile);
  }
}

export default TutorProfileController;
