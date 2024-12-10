import * as z from "zod";

export const messageSchema = {
  message: z.array(z.string()),
};
