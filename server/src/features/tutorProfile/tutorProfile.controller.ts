import { ITutorProfileController } from "./tutorProfile.interfaces";
import { Request, Response } from "express";
import { tutorProfileRepository } from "@shared/repositories/tutorProfileRepository";
import { User } from "@shared/services/db/schema";
import HTTP_STATUS from "http-status-codes";

class TutorProfileController implements ITutorProfileController {
  async getTutorProfile(req: Request, res: Response) {
    const user: User = req.user as User;
    const tutorProfile = await tutorProfileRepository.getTutorProfileByUserId(
      user.id
    );

    return res.status(HTTP_STATUS.OK).json(tutorProfile);
  }

  async updateTutorProfile(req: Request, res: Response) {
    const user: User = req.user as User;
    const updatedProfile =
      await tutorProfileRepository.updateTutorProfileByUserId(user.id, {
        userId: user.id,
        ...req.body,
      });

    return res.status(HTTP_STATUS.OK).json(updatedProfile);
  }
}

export const tutorProfileController: ITutorProfileController =
  new TutorProfileController();
