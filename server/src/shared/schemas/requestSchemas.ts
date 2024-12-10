import z from "zod";

export const AIConversationRequestSchema = z.object({
  content: z.string(),
});
