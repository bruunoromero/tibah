import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";
import { Deta } from "__mocks__/deta/in-memory";
import { testContext } from "__utils__/test-context";
import { getCaller } from "__utils__/trpc";
import { Habit } from "~/models/habit.model";

const getCollection = () => Deta().getOrCreateCollection<Habit>("habits");

describe("create", () => {
  it("should fail when there's no current user", async () => {
    await expect(getCaller().habit.create({ name: "testing" })).rejects.toThrow(
      TRPCError
    );
  });

  it("should create a new habit for the current user", async () => {
    testContext.currentUser = { id: "1" };

    await expect(
      getCaller().habit.create({ name: "testing" })
    ).resolves.toMatchObject({ name: "testing", userId: "1" });

    testContext.currentUser = { id: "2" };

    await expect(
      getCaller().habit.create({ name: "testing for user 2" })
    ).resolves.toMatchObject({ name: "testing for user 2", userId: "2" });
  });

  it("should fail to create a new habit when the user already has one with that name", async () => {
    testContext.currentUser = { id: "1" };
    getCollection().insertOne({ key: v4(), name: "testing", userId: "1" });

    await expect(getCaller().habit.create({ name: "testing" })).rejects.toThrow(
      TRPCError
    );
  });
});

describe("listAll", () => {
  it("should fail when there's no current user", async () => {
    await expect(getCaller().habit.listAll()).rejects.toThrowError(TRPCError);
  });

  it("should return all habits from a user", async () => {
    testContext.currentUser = { id: "1" };
    const key1 = v4();
    const key2 = v4();
    getCollection().insertOne({ key: key1, name: "testing", userId: "1" });
    getCollection().insertOne({ key: key2, name: "testing 2", userId: "1" });
    getCollection().insertOne({ key: v4(), name: "testing", userId: "2" });
    getCollection().insertOne({ key: v4(), name: "testing 3", userId: "3" });

    const habits = await getCaller().habit.listAll();

    expect(habits.length).toBe(2);
    expect(habits).toIncludeSameMembers([
      { key: key1, name: "testing", userId: "1" },
      { key: key2, name: "testing 2", userId: "1" },
    ]);
  });

  it("should return empty when the user does not has habits", async () => {
    testContext.currentUser = { id: "1" };
    getCollection().insertOne({ key: v4(), name: "testing", userId: "2" });
    getCollection().insertOne({ key: v4(), name: "testing 3", userId: "3" });

    const habits = await getCaller().habit.listAll();

    expect(habits).toEqual([]);
  });
});
