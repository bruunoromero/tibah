import { beforeEach, describe, expect, expectTypeOf, it } from "vitest";
import { BaseClass } from "./base";
import { Deta, resetDb } from "./in-memory";

let base: BaseClass;

beforeEach(() => {
  resetDb();
  base = Deta().Base("users");
});

const luke = { key: "1234", name: "luke", age: 22 };
const leia = { key: "5678", name: "leia", age: 22 };
const han = { key: "9012", name: "han", age: 28 };
const yoda = { key: "3456", name: "yoda", age: 77 };

const getCollection = () => globalThis.db.getCollection("users");

const seedDb = () => {
  const users = getCollection();

  users.insert({ ...luke });
  users.insert({ ...leia });
  users.insert({ ...han });
  users.insert({ ...yoda });
};

describe("Base", () => {
  describe("fetch", () => {
    it("should return empty when db is empty", async () => {
      const res = await base.fetch();

      expect(res).toEqual({ count: 0, last: undefined, items: [] });
    });

    it("should return all items when no query is provided", async () => {
      seedDb();

      const res = await base.fetch();

      expect(res).toEqual(
        expect.objectContaining({
          count: 4,
          items: expect.arrayContaining([luke, leia, han, yoda]),
        })
      );
    });

    it("should filter using eq", async () => {
      seedDb();

      const res = await base.fetch({ name: "luke" });

      expect(res).toEqual(
        expect.objectContaining({
          count: 1,
          items: expect.arrayContaining([luke]),
        })
      );
    });

    it("should filter using not eq", async () => {
      seedDb();

      const res = await base.fetch({ "name?ne": "luke" });

      expect(res).toEqual(
        expect.objectContaining({
          count: 3,
          items: expect.arrayContaining([leia, han, yoda]),
        })
      );
    });

    it("should filter using gt", async () => {
      seedDb();

      const res = await base.fetch({ "age?gt": 22 });

      expect(res).toEqual(
        expect.objectContaining({
          count: 2,
          items: expect.arrayContaining([han, yoda]),
        })
      );
    });

    it("should filter using lt", async () => {
      seedDb();

      const res = await base.fetch({ "age?lt": 27 });

      expect(res).toEqual(
        expect.objectContaining({
          count: 2,
          items: expect.arrayContaining([luke, leia]),
        })
      );
    });

    it("should filter using gte", async () => {
      seedDb();

      const res = await base.fetch({ "age?gte": 22 });

      expect(res).toEqual(
        expect.objectContaining({
          count: 4,
          items: expect.arrayContaining([luke, leia, han, yoda]),
        })
      );
    });

    it("should filter using lte", async () => {
      seedDb();

      const res = await base.fetch({ "age?lte": 28 });

      expect(res).toEqual(
        expect.objectContaining({
          count: 3,
          items: expect.arrayContaining([luke, leia, han]),
        })
      );
    });

    it("should filter using r", async () => {
      seedDb();

      const res = await base.fetch({ "age?r": [28, 77] });

      expect(res).toEqual(
        expect.objectContaining({
          count: 2,
          items: expect.arrayContaining([han, yoda]),
        })
      );
    });

    it("should filter using contains", async () => {
      seedDb();

      const res = await base.fetch({ "name?contains": "yo" });

      expect(res).toEqual(
        expect.objectContaining({
          count: 1,
          items: expect.arrayContaining([yoda]),
        })
      );
    });

    it("should filter using not_contains", async () => {
      seedDb();

      const res = await base.fetch({ "name?not_contains": "da" });

      expect(res).toEqual(
        expect.objectContaining({
          count: 3,
          items: expect.arrayContaining([luke, leia, han]),
        })
      );
    });

    it("should filter using pfx", async () => {
      seedDb();

      const res = await base.fetch({ "name?pfx": "l" });

      expect(res).toEqual(
        expect.objectContaining({
          count: 2,
          items: expect.arrayContaining([luke, leia]),
        })
      );
    });

    it("should query using dot notation", async () => {
      const users = globalThis.db.getCollection("users");

      users.insert({ key: "1234", data: { age: 22 } });
      users.insert({ key: "5678", data: { age: 27 } });

      const res = await base.fetch({ "data.age": 27 });

      expect(res).toEqual(
        expect.objectContaining({
          count: 1,
          items: expect.arrayContaining([{ key: "5678", data: { age: 27 } }]),
        })
      );
    });

    it("should query using or operator", async () => {
      const users = globalThis.db.getCollection("users");

      users.insert({
        key: "1234",
        data: { profile: { age: 22, name: "luke" } },
      });
      users.insert({
        key: "5678",
        data: { profile: { age: 27, name: "chewbacca" } },
      });
      users.insert({
        key: "9012",
        data: { profile: { age: 77, name: "yoda" } },
      });

      const res = await base.fetch([
        { "data.profile.age": 27 },
        { key: "9012" },
      ]);

      expect(res).toEqual(
        expect.objectContaining({
          count: 2,
          items: expect.arrayContaining([
            { key: "5678", data: { profile: { age: 27, name: "chewbacca" } } },
            { key: "9012", data: { profile: { age: 77, name: "yoda" } } },
          ]),
        })
      );
    });
  });

  describe("insert", () => {
    it("should be able to insert a new instance without a key", async () => {
      const user = await base.insert({ name: "luke" });

      expect(user.name).toEqual("luke");
      expect(user.key).toBeTypeOf("string");
      expect(getCollection().find()).toMatchObject([{ name: "luke" }]);
    });

    it("should be able to insert a new instance with a key", async () => {
      const user = await base.insert({ key: "1234", name: "luke" });

      expect(user).toEqual({ name: "luke", key: "1234" });
      expect(getCollection().find()).toMatchObject([
        { name: "luke", key: "1234" },
      ]);
    });

    it("should be able to insert a new array instance", async () => {
      const user = await base.insert([1, 2, 3]);

      expect(user.value).toEqual([1, 2, 3]);
      expect(user.key).toBeTypeOf("string");
      expect(getCollection().find()).toMatchObject([{ value: [1, 2, 3] }]);
    });

    it("should be able to insert a new string instance", async () => {
      const user = await base.insert("luke");

      expect(user.value).toEqual("luke");
      expect(user.key).toBeTypeOf("string");
      expect(getCollection().find()).toMatchObject([{ value: "luke" }]);
    });

    it("should be able to insert a new number instance", async () => {
      const user = await base.insert(22);

      expect(user.value).toEqual(22);
      expect(user.key).toBeTypeOf("string");
      expect(getCollection().find()).toMatchObject([{ value: 22 }]);
    });

    it("should be able to insert a new boolean instance", async () => {
      const user = await base.insert(false);

      expect(user.value).toEqual(false);
      expect(user.key).toBeTypeOf("string");
      expect(getCollection().find()).toMatchObject([{ value: false }]);
    });

    it("should fail to insert an entity with a key that already exists", async () => {
      getCollection().insertOne({ key: "1234", name: "luke" });

      await expect(
        base.insert({ key: "1234", name: "leia" })
      ).rejects.toThrow();
    });
  });

  describe("put", () => {
    it("should be able to put a new instance without a key", async () => {
      const user = await base.put({ name: "luke" });

      expect(user!.name).toEqual("luke");
      expect(user!.key).toBeTypeOf("string");
      expect(getCollection().find()).toMatchObject([{ name: "luke" }]);
    });

    it("should be able to put a new instance with a key", async () => {
      const user = await base.put({ key: "1234", name: "luke" });

      expect(user).toEqual({ name: "luke", key: "1234" });
      expect(getCollection().find()).toMatchObject([
        { name: "luke", key: "1234" },
      ]);
    });

    it("should be able to put a new array instance", async () => {
      const user = await base.put([1, 2, 3]);

      expect(user!.value).toEqual([1, 2, 3]);
      expect(user!.key).toBeTypeOf("string");
      expect(getCollection().find()).toMatchObject([{ value: [1, 2, 3] }]);
    });

    it("should be able to put a new string instance", async () => {
      const user = await base.put("luke");

      expect(user!.value).toEqual("luke");
      expect(user!.key).toBeTypeOf("string");
      expect(getCollection().find()).toMatchObject([{ value: "luke" }]);
    });

    it("should be able to put a new number instance", async () => {
      const user = await base.put(22);

      expect(user!.value).toEqual(22);
      expect(user!.key).toBeTypeOf("string");
      expect(getCollection().find()).toMatchObject([{ value: 22 }]);
    });

    it("should be able to put a new boolean instance", async () => {
      const user = await base.put(false);

      expect(user!.value).toEqual(false);
      expect(user!.key).toBeTypeOf("string");
      expect(getCollection().find()).toMatchObject([{ value: false }]);
    });

    it("should overwrite an entity with a key that already exists", async () => {
      getCollection().insertOne({ key: "1234", name: "luke", age: 22 });

      await expect(base.put({ key: "1234", name: "leia" })).resolves.toEqual({
        key: "1234",
        name: "leia",
      });

      expect(getCollection().find()).toMatchObject([
        { key: "1234", name: "leia" },
      ]);
    });
  });

  describe("get", () => {
    it("should be able to get a entity from db", async () => {
      getCollection().insertOne({ key: "1234", name: "luke" });

      await expect(base.get("1234")).resolves.toEqual({
        key: "1234",
        name: "luke",
      });
    });

    it("should return null if there's no entity with that key", async () => {
      await expect(base.get("1234")).resolves.toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete an entity from database", async () => {
      getCollection().insertOne({ key: "1234", name: "luke" });

      expect(getCollection().find()).toMatchObject([{ name: "luke" }]);

      await base.delete("1234");

      expect(getCollection().find()).toEqual([]);
    });

    it("should not fail if entity doesn't exists", async () => {
      expect(getCollection().find()).toEqual([]);

      await base.delete("1234");

      expect(getCollection().find()).toEqual([]);
    });
  });

  describe("putMany", () => {
    it("should be able to put all instances to the database", async () => {
      const users = await base.putMany([
        { name: "luke" },
        "leia",
        false,
        [1, 2, 3],
      ]);

      expect(users.processed.items.length).toEqual(4);
      expect(users.processed.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "luke" }),
          expect.objectContaining({ value: "leia" }),
          expect.objectContaining({ value: false }),
          expect.objectContaining({ value: [1, 2, 3] }),
        ])
      );

      expect(getCollection().find()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "luke" }),
          expect.objectContaining({ value: "leia" }),
          expect.objectContaining({ value: false }),
          expect.objectContaining({ value: [1, 2, 3] }),
        ])
      );
    });
  });

  describe("update", () => {
    it("should be able to update from changes", async () => {
      getCollection().insertOne({
        key: "1234",
        name: "luke",
        data: { profile: { age: 22 } },
      });

      await expect(
        base.update({ name: "han", "data.profile.age": 28 }, "1234")
      ).resolves.toBeNull();

      expect(getCollection().find()).toMatchObject([
        { key: "1234", name: "han", data: { profile: { age: 28 } } },
      ]);
    });

    it("should not fail if entity not found in database", async () => {
      await expect(
        base.update({ name: "han", "data.profile.age": 28 }, "1234")
      ).resolves.toBeNull();

      expect(getCollection().find()).toEqual([]);
    });
  });
});
