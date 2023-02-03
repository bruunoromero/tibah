import "reflect-metadata";
import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "~/server/context";
import { router } from "~/server/routers";
import { initRegistry } from "~/server/registry";
import { initFirebase } from "~/utils/firebase";

initFirebase();
initRegistry();

// export API handler
export default trpcNext.createNextApiHandler({
  router,
  createContext,
});
