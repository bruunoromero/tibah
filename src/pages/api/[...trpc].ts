import { NextApiRequest, NextApiResponse } from "next";
import { createOpenApiNextHandler } from "trpc-openapi";
import { router } from "~/server/router";

const trpcHandler = createOpenApiNextHandler({ router: router });

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return trpcHandler(req, res);
};

export default handler;
