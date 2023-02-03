import { z } from "zod";

export const habit = z.object({
  key: z.string().uuid(),
  name: z.string(),
  userId: z.string(),
});

export const createHabit = habit.pick({ name: true });

export type Habit = z.infer<typeof habit>;

export type CreateHabit = z.infer<typeof createHabit>;
