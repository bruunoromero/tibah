import Loki, { Collection, LokiMemoryAdapter } from "lokijs";
import { BaseClass } from "./base";

class DetaClass {
  private readonly db: Loki;
  constructor() {
    this.db = globalThis.db;
  }

  private getOrCreateCollection(name: string): Collection<any> {
    const collection = this.db.getCollection(name);

    if (collection) return collection;

    return this.db.addCollection(name, { unique: ["key"] });
  }

  Base(name: string): BaseClass {
    return new BaseClass(this.getOrCreateCollection(name));
  }
}

globalThis.db = new Loki("deta.test.db", {
  adapter: new LokiMemoryAdapter(),
});

export const resetDb = () => {
  for (const collection of globalThis.db.collections) {
    globalThis.db.getCollection(collection.name).clear({ removeIndices: true });
  }
};

export const Deta = () => new DetaClass();
