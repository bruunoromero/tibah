import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { getAuth } from "firebase/auth";
import { Router } from "~/server/routers";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const getAuthorization = async () => {
  try {
    const token = await getAuth().currentUser?.getIdToken();

    if (!token) return "";

    return `Bearer ${token}`;
  } catch (e) {
    return "";
  }
};

export const trpc = createTRPCNext<Router>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          url: getBaseUrl() + "/api/trpc",
          headers: async () => {
            const authorization = await getAuthorization();
            const { connection: _connection, ...headers } =
              ctx?.req?.headers ?? {};

            return {
              ...headers,
              authorization,
            };
          },
        }),
      ],
    };
  },
  ssr: true,
});
