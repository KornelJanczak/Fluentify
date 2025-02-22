import { NextFunction, Request, Response } from "express";
import { z, ZodError, ZodEffects, ZodObject } from "zod";

export const validateZodSchema = (
  schema: z.ZodObject<any> | ZodEffects<ZodObject<any>>
) => {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      console.log("req.body", req.body);

      schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log("error", error);
        throw new Error("Zod error");
      }
    }
  };
};
