import z from "zod";

export const startChatSchema = z.object({
  messages: z.array(z.object({ content: z.string(), role: z.string() })),
  chatId: z.string(),
});

export const createChatSchema = z.object({
  title: z.string(),
});
