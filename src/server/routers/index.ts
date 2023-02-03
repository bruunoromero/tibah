import { t } from "../trpc";
import { authRouter } from "./auth.router";
import { habitRouter } from "./habit.router";

export const router = t.router({
  auth: authRouter,
  habit: habitRouter,
});

export type Router = typeof router;
