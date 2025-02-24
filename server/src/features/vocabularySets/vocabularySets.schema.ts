import z from "zod";

export const createVocabularySetSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  flashCards: z.array(
    z.object({
      translation: z.string().min(2),
      definition: z.string().min(2),
    })
  ),
});

export const updateVocabularySetSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  flashCards: z.array(
    z.object({
      id: z.string().min(2),
      translation: z.string().min(2),
      definition: z.string().min(2),
    })
  ),
});
