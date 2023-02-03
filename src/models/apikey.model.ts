import { z } from "zod";

export const apikey = z.object({
  key: z.string().uuid(),
  token: z.string(),
  userId: z.string(),
});

export type Apikey = z.infer<typeof apikey>;
