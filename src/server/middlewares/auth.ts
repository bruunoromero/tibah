import { TRPCError } from "@trpc/server";
import { t } from "../trpc";

export const isAuthed = t.middleware(({ next, ctx }) => {
  const { user } = ctx;

  if (!user) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
