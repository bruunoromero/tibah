import type { Entity } from "./types/base";
import type { QueryData, QueryOperators } from "./types/query";

export const makeQuery = <T extends Entity>(queryData: QueryData<T>) => {
  const built: Record<string, any> = {};

  Object.entries(queryData).forEach(([key, query]) => {
    Object.entries(query as QueryOperators).forEach(([operator, value]) => {
      const op = operator as keyof QueryOperators;

      if (op === "$eq") {
        built[key] = value;
      } else if (op === "$range") {
        built[`${key}?r`] = value;
      } else {
        built[`${key}?${operator.slice(1)}`] = value;
      }
    });
  });

  return built;
};

export const toRawQuery = <T extends Entity>(
  query?: QueryData<T> | QueryData<T>[]
) => {
  return query
    ? Array.isArray(query)
      ? query.map((q) => makeQuery(q))
      : makeQuery(query)
    : undefined;
};
