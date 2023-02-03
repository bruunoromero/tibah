import "src/styles/globals.css";

import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { initFirebase } from "~/utils/firebase";

initFirebase();

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default trpc.withTRPC(MyApp);
