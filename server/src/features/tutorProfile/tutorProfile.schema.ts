import z from "zod";

export const updateTutorProfileSchema = z.object({
  name: z.string(),
  ssmlGender: z.string(),
  languageCode: z.string(),
});
