import z from "zod";

export const createVocabularySetSchema = z.object({
  title: z.string(),
  description: z.string(),
  flashCards: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
});
