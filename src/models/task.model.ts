import { z } from "zod";

export const task = z.object({
  key: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  userId: z.string(),
});
export type Task = z.infer<typeof task>;

export const createTask = task.pick({ title: true, description: true });

export type CreateTask = z.infer<typeof createTask>;
