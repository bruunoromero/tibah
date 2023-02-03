import { initTRPC } from "@trpc/server";
import { OpenApiMeta } from "trpc-openapi";
import type { Context } from "./context";

export const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();
