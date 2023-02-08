import { Context } from "~/server/context";
import { router } from "~/server/routers";
import { testContext } from "./test-context";

export const createTestContext = (): Context => {
  return {
    user: testContext.currentUser,
  };
};

export const getCaller = () => router.createCaller(createTestContext());
