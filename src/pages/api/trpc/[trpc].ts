/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */

import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "~/server/context";
import { router } from "~/server/router";

// export API handler
export default trpcNext.createNextApiHandler({
  router: router,
  createContext,
});
