import { Base, Deta } from "deta";

export type Base = ReturnType<typeof Base>;
export type Deta = ReturnType<typeof Deta>;

export type Entity = { key: string; [x: string]: any };

export interface CommonOptions {
  expireIn?: number;
  expireAt?: Date | number;
}
export interface FetchOptions {
  limit?: number;
  last?: string;
}
