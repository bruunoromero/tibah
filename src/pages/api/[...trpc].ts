import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { createOpenApiNextHandler } from "trpc-openapi";
import { createContext } from "~/server/context";
import { router } from "~/server/routers";
import { initRegistry } from "~/server/registry";
import { initFirebase } from "~/utils/firebase";

initFirebase();
initRegistry();

const trpcHandler = createOpenApiNextHandler({ router, createContext });

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return trpcHandler(req, res);
};

export default handler;
