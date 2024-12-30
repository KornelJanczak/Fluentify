import { Request, Response } from "express";

export interface ITutorProfileController {
  getTutorProfile: (req: Request, res: Response) => void;
  updateTutorProfile: (req: Request, res: Response) => void;
}
