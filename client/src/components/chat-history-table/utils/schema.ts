import { z } from "zod";

export const chatSchema = z.object({
  id: z.string().uuid(),
  topic: z.string().max(255),
  usedTokens: z.number().nullable(),
  startedAt: z.string(),
  userId: z.string(),
});
