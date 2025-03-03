import { z } from "zod";

export const chatSchema = z.object({
  id: z.string().uuid(),
  topic: z.string().max(255),
  usedTokens: z.number().int(),
  startedAt: z.string(),
  userId: z.string(),
});
