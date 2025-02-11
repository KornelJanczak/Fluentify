import z from "zod";

export const createVocabularySetSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  flashCards: z.array(
    z.object({
      title: z.string().min(2),
      description: z.string().min(2),
    })
  ),
});
