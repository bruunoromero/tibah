import { container } from "tsyringe";
import { z } from "zod";
import { createHabit, habit } from "~/models/habit.model";
import { privateProcedure } from "../procedures";
import { HabitService } from "../services/habit.service";
import { t } from "../trpc";

export const habitRouter = t.router({
  listAll: privateProcedure
    .meta({ openapi: { method: "GET", path: "/habits", protect: true } })
    .input(z.void())
    .output(z.array(habit))
    .query(({ ctx }) => {
      return container.resolve(HabitService).allByUser(ctx.user.id);
    }),
  create: privateProcedure
    .meta({ openapi: { method: "POST", path: "/habits", protect: true } })
    .input(createHabit)
    .output(habit)
    .mutation(({ input, ctx }) => {
      return container.resolve(HabitService).create(input, ctx.user.id);
    }),
});
