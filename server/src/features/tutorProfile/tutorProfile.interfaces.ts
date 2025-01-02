import { Request, Response } from "express";
import { ITutorProfileRepository } from "@shared/repositories/tutorProfileRepository";

export interface ITutorProfileController {
  getTutorProfile: (req: Request, res: Response) => void;
  updateTutorProfile: (req: Request, res: Response) => void;
}

export interface ITutorProfileControllerDependencies {
  tutorProfileRepository: ITutorProfileRepository;
}
