import { Deta } from "deta";
import { env } from "../env";

export const DETA_TOKEN = Symbol("deta");

export const detaFactory = () => Deta(env.DETA__PROJECT_KEY);
