import { Entity } from "./base";

type QueryPathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ? `${K}.${QueryPathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
      : `${K}.${QueryPathImpl<T[K], keyof T[K]>}`
    : K
  : never;

type QueryPath<T> = QueryPathImpl<T, keyof T>;

export type BaseValueType =
  | string
  | number
  | boolean
  | object
  | BaseValueType[];

export type QueryOperators = {
  /** Equal to */
  $eq?: BaseValueType;
  /** Not equal to */
  $ne?: BaseValueType;
  /** Less Than */
  $lt?: number;
  /** Greater than */
  $gt?: number;
  /** Less than or equal  */
  $lte?: number;
  /** Greater than or equal  */
  $gte?: number;
  /** Prefix */
  $pfx?: string;
  /** Range */
  $range?: number[];
  /** Contains */
  $contains?: string;
  /** Not contains */
  $not_contains?: string;
};

export type QueryData<T extends Entity> = Partial<{
  [TKey in QueryPath<T>]: QueryOperators;
}>;
