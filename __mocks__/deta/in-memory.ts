import { ObjectType } from "deta/dist/types/types/basic";
import Loki, { Collection } from "lokijs";
import { testContext } from "__utils__/test-context";
import { BaseClass } from "./base";

class DetaClass {
  private readonly db: Loki;
  constructor(db?: Loki) {
    this.db = db ?? testContext.db;
  }

  getOrCreateCollection<T extends ObjectType = any>(
    name: string
  ): Collection<T> {
    const collection = this.db.getCollection<T>(name);

    if (collection) return collection;

    return this.db.addCollection(name, { unique: ["key"] as any });
  }

  Base(name: string) {
    return new BaseClass(this.getOrCreateCollection(name));
  }
}

export const Deta = () => new DetaClass();
