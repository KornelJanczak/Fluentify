import { z } from "zod";

export const createFlashCardSchema = z.object({
  definition: z.string(),
  translation: z.string(),
  vocabularySetId: z.string().uuid(),
});

export const updateFlashCardSchema = z
  .object({
    definition: z.string().optional(),
    translation: z.string().optional(),
  })
  .refine(
    (data) => data.definition !== undefined || data.translation !== undefined,
    {
      message: "At least one of 'definition' or 'translation' must be provided",
      path: ["definition", "translation"],
    }
  );
