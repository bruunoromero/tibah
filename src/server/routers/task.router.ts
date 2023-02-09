import { container } from "tsyringe";
import { z } from "zod";
import { createTask, task } from "~/models/task.model";
import { privateProcedure } from "../procedures";
import { TaskService } from "../services/task.service";
import { t } from "../trpc";

export const taskRouter = t.router({
  create: privateProcedure
    .meta({ openapi: { method: "POST", path: "/tasks", protect: true } })
    .input(createTask)
    .output(task)
    .mutation(({ input, ctx }) => {
      return container.resolve(TaskService).create(input, ctx.user.id);
    }),

  listAll: privateProcedure
    .meta({ openapi: { method: "GET", path: "/tasks", protect: true } })
    .input(z.void())
    .output(z.array(task))
    .query(({ ctx }) => {
      return container.resolve(TaskService).allByUser(ctx.user.id);
    }),
});
