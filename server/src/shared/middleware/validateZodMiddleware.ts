import { NextFunction, Request, Response } from "express";
import { z, ZodError, ZodEffects, ZodObject } from "zod";

export const validateZodSchema = (
  schema: z.ZodObject<any> | ZodEffects<ZodObject<any>>
) => {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error("Zod error");
      }
    }
  };
};
