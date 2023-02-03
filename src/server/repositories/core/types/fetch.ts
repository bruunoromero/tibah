import { Entity } from "./base";

export interface FetchResponse<T extends Entity> {
  items: T[];
  count: number;
  last?: string;
}
