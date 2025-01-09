import z from "zod";

export const startChatSchema = z.object({
  messages: z.array(z.object({ content: z.string(), role: z.string() })),
  chatId: z.string(),
  chatCategory: z.string(),
  chatTopic: z.string(),
  vocabularySetId: z.string().uuid().optional(),
});

export const createChatSchema = z.object({
  title: z.string(),
});
