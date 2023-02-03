import { container } from "tsyringe";
import { z } from "zod";
import { apikey } from "~/models/apikey.model";
import { privateProcedure } from "../procedures";
import { ApikeyService } from "../services/apikey.service";
import { t } from "../trpc";

export const authRouter = t.router({
  apikey: t.router({
    create: privateProcedure
      .input(z.void())
      .output(apikey)
      .mutation(({ ctx }) => {
        return container.resolve(ApikeyService).create(ctx.user.id);
      }),

    get: privateProcedure
      .input(z.void())
      .output(apikey.nullish())
      .query(({ ctx }) => {
        return container.resolve(ApikeyService).maybeGetByUser(ctx.user.id);
      }),
  }),
});
