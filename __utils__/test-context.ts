import Loki, { LokiMemoryAdapter } from "lokijs";
import { User } from "~/models/user.model";

export class TestContext {
  readonly db: Loki;
  currentUser: User | null;

  constructor() {
    this.currentUser = null;
    this.db = new Loki("deta.test.db", {
      adapter: new LokiMemoryAdapter(),
    });
  }

  resetDb() {
    for (const collection of this.db.collections) {
      this.db.getCollection(collection.name).clear({ removeIndices: true });
    }
  }

  resetCurrentUser() {
    this.currentUser = null;
  }
}

export const testContext = new TestContext();
