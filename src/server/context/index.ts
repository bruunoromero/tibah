import { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getUser } from "./auth";

export const createContext = async ({ req }: CreateNextContextOptions) => {
  const user = await getUser(req);

  return {
    user,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
