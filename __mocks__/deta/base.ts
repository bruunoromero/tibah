import ObjectPath from "object-path";
import {
  FetchOptions,
  InsertOptions,
  PutManyOptions,
  PutOptions,
  UpdateOptions,
} from "deta/dist/types/types/base/request";
import {
  DeleteResponse,
  FetchResponse,
  GetResponse,
  InsertResponse,
  PutManyResponse,
  PutResponse,
  UpdateResponse,
} from "deta/dist/types/types/base/response";
import {
  CompositeType,
  DetaType,
  ObjectType,
} from "deta/dist/types/types/basic";
import { Collection } from "lokijs";
import { uid } from "rand-token";
import { Base } from "deta";

const isObject = (data: DetaType): data is ObjectType =>
  typeof data === "object" && !Array.isArray(data);

const toUnix = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};

const toExpires = ({ expireAt, expireIn }: PutOptions = {}):
  | number
  | undefined => {
  if (expireAt) {
    if (typeof expireAt === "number") return expireAt;
    return toUnix(expireAt);
  }

  if (expireIn) {
    return toUnix(new Date()) + expireIn;
  }
};

const withExpires = (data: ObjectType, expires?: number) => {
  if (!expires) return data;

  return {
    ...data,
    __expires: expires,
  };
};

const getKey = (data: DetaType, key?: string) => {
  if (key) return key;

  if (isObject(data) && typeof data.key === "string") return data.key;
};

export const toEntity = (
  data: DetaType,
  key?: string,
  options?: PutOptions
) => {
  const theKey = key ?? uid(8);
  const expires = toExpires(options);

  if (isObject(data)) {
    return withExpires({ ...data, key: theKey }, expires);
  }

  return withExpires({
    value: data,
    key: theKey,
  });
};

const toLokiQuery = (
  query?: CompositeType
): LokiQuery<ObjectType> | undefined => {
  if (!query) return;

  if (Array.isArray(query)) {
    return { $or: query.map((query) => toLokiQuery(query as ObjectType)) };
  }

  const theQuery: LokiQuery<ObjectType> = {};

  Object.entries(query).forEach(([path, value]) => {
    const parts = path.split("?");
    if (parts.length > 2) {
      throw new Error();
    }

    const [field, modifier = "eq"] = parts;

    switch (modifier) {
      case "eq":
        theQuery[field] = { $eq: value };
        break;
      case "ne":
        theQuery[field] = { $ne: value };
        break;
      case "lt":
        theQuery[field] = { $lt: value };
        break;
      case "gt":
        theQuery[field] = { $gt: value };
        break;
      case "lte":
        theQuery[field] = { $lte: value };
        break;
      case "gte":
        theQuery[field] = { $gte: value };
        break;
      case "r":
        theQuery[field] = { $between: value };
        break;
      case "contains":
        theQuery[field] = { $contains: value };
        break;
      case "not_contains":
        theQuery[field] = { $containsNone: value };
        break;
      case "pfx":
        theQuery[field] = {
          $where: (data: string) => data.startsWith(value as string),
        };
        break;
      default:
        throw new Error(`operation ${modifier} not supported`);
    }
  });

  return theQuery;
};

const fromLoki = ({ $loki, meta, ...data }: ObjectType) => {
  return data;
};

export class BaseClass {
  constructor(private base: Collection<ObjectType>) {}

  private async _insert(
    data: DetaType,
    key?: string,
    options?: InsertOptions
  ): Promise<InsertResponse> {
    const theKey = getKey(data, key);

    if (theKey && (await this._get(theKey))) throw new Error();

    const entity = this.base.insertOne(toEntity(data, theKey, options));

    if (!entity) throw new Error();

    return entity;
  }

  private async _get(key: string): Promise<GetResponse> {
    const entity = this.base.by("key", key);

    if (!entity) return null;

    return entity;
  }

  async insert(
    data: DetaType,
    key?: string,
    options?: InsertOptions
  ): Promise<InsertResponse> {
    const lokiData = await this._insert(data, key, options);

    return fromLoki(lokiData);
  }

  // TODO: adds support for `last`
  private async _fetch(
    query?: CompositeType,
    options?: FetchOptions
  ): Promise<FetchResponse> {
    const theQuery = toLokiQuery(query);
    const { limit } = Object.assign({}, { limit: 1000 }, options);

    const items = this.base
      .chain()
      .find(theQuery)
      .where((data) => {
        if (data.__expires) {
          return toUnix(new Date()) >= data.__expires;
        }

        return true;
      })
      .limit(limit)
      .data();

    const last = items[items.length - 1] ?? {};

    return {
      items,
      count: items.length,
      last: last.key as string | undefined,
    };
  }

  async put(
    data: DetaType,
    key?: string,
    options?: PutOptions
  ): Promise<PutResponse> {
    const theKey = getKey(data, key);

    if (theKey) {
      await this.delete(theKey);
    }

    return this.insert(data, key, options);
  }

  async putMany(
    items: DetaType[],
    options?: PutManyOptions
  ): Promise<PutManyResponse> {
    const entities = await Promise.all(
      items.map((item) => this.put(item, undefined, options))
    );

    return {
      processed: {
        items: entities,
      },
    };
  }

  async get(key: string): Promise<GetResponse> {
    const entity = await this._get(key);

    if (!entity) return null;

    return fromLoki(entity);
  }

  async delete(key: string): Promise<DeleteResponse> {
    const entity = await this._get(key);

    if (!entity) return null;

    this.base.remove(entity);

    return null;
  }

  // TODO: adds support for actions
  async update(
    updates: ObjectType,
    key: string,
    options?: UpdateOptions
  ): Promise<UpdateResponse> {
    const entity = await this._get(key);
    const expires = toExpires(options);
    const newUpdates = withExpires(updates, expires);

    if (!entity) return null;

    Object.entries(newUpdates).forEach(([path, value]) => {
      ObjectPath.set(entity, path, value);
    });

    this.base.update(entity);

    return null;
  }

  async fetch(
    query?: CompositeType,
    options?: FetchOptions
  ): Promise<FetchResponse> {
    const { items, count, last } = await this._fetch(query, options);

    return {
      items: items.map((item) => fromLoki(item)),
      count,
      last,
    };
  }
}
