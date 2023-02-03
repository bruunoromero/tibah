import { z } from "zod";

export const user = z.object({
  id: z.string(),
});

export type User = z.infer<typeof user>;
