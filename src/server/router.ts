import { z } from "zod";
import { t } from "./trpc";

export const router = t.router({
  greeting: t.procedure
    .meta({ openapi: { method: "GET", path: "/greeting" } })
    .input(
      z.object({
        name: z.string(),
      })
    )
    .output(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        text: `hello ${input?.name ?? "world"}`,
      };
    }),
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type Router = typeof router;
