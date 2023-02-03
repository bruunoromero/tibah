import { TRPCError } from "@trpc/server";
import { container } from "tsyringe";
import { z } from "zod";
import { DETA_TOKEN } from "~/server/registry/deta.register";
import type {
  Base,
  CommonOptions,
  Deta,
  Entity,
  FetchOptions,
} from "./types/base";
import type { FetchResponse } from "./types/fetch";
import type { QueryData } from "./types/query";
import { UpdateData } from "./types/update";
import { toRawQuery } from "./utils";

export const repository = <T extends Entity>(
  base: string,
  coercer: z.ZodType<T>
) => {
  return class BaseRepository {
    private readonly base: Base;

    constructor() {
      this.base = container.resolve<Deta>(DETA_TOKEN).Base(base);
    }

    get util() {
      return this.base.util;
    }

    async fetch(
      query?: QueryData<T> | QueryData<T>[],
      options?: FetchOptions
    ): Promise<FetchResponse<T>> {
      const queryBuilt = toRawQuery(query);
      const { items, ...data } = await this.base.fetch(queryBuilt, options);

      return {
        ...data,
        items: items.map((item) => {
          return coercer.parse(item);
        }),
      };
    }

    async fetchMaybeOne(
      query?: QueryData<T> | QueryData<T>[],
      options?: FetchOptions
    ): Promise<T | null> {
      const { count, items } = await this.fetch(query, options);

      if (count !== 1) {
        return null;
      }

      return items[0];
    }

    async ensureUnique(
      query?: QueryData<T> | QueryData<T>[],
      options?: FetchOptions
    ): Promise<void> {
      const { count } = await this.fetch(query, options);

      if (count !== 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Entity should be unique",
        });
      }
    }

    async fetchOne(
      query?: QueryData<T> | QueryData<T>[],
      options?: FetchOptions
    ): Promise<T> {
      const data = await this.fetchMaybeOne(query, options);

      if (!data) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return data;
    }

    async get(key: string): Promise<T> {
      const data = await this.base.get(key);

      if (!data) throw new TRPCError({ code: "NOT_FOUND" });

      return coercer.parse(data);
    }

    async delete(key: string) {
      return this.base.delete(key);
    }

    async update(
      key: string,
      updates: UpdateData<Omit<T, "key">>,
      options?: CommonOptions
    ) {
      return this.base.update(updates, key, options);
    }

    async put(entity: T, options?: CommonOptions): Promise<T> {
      const data = await this.base.put(
        coercer.parse(entity),
        undefined,
        options
      );

      if (!data) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return coercer.parse(data);
    }

    async putMany(entities: T[], options?: CommonOptions): Promise<T[]> {
      const { processed } = await this.base.putMany(
        entities.map((entity) => coercer.parse(entity)),
        options
      );

      return processed.items.map((item) => coercer.parse(item));
    }

    async insert(entity: T, options?: CommonOptions): Promise<T> {
      const data = await this.base.insert(
        coercer.parse(entity),
        undefined,
        options
      );

      return coercer.parse(data);
    }
  };
};
