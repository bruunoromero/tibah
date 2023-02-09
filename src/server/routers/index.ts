import { t } from "../trpc";
import { authRouter } from "./auth.router";
import { habitRouter } from "./habit.router";
import { taskRouter } from "./task.router";

export const router = t.router({
  auth: authRouter,
  habit: habitRouter,
  task: taskRouter,
});

export type Router = typeof router;
