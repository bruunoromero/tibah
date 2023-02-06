import { beforeEach, describe, expect, it } from "vitest";
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

const seedDb = () => {
  const users = globalThis.db.getCollection("users");

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
    it("should be able to insert a new instance withou a key", async () => {
      expect(1 + 1).toBe(2);
    });
  });
});
