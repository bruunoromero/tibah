import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";
import { Deta } from "__mocks__/deta/in-memory";
import { testContext } from "__utils__/test-context";
import { getCaller } from "__utils__/trpc";
import { Task } from "~/models/task.model";

const getCollection = () => Deta().getOrCreateCollection<Task>("tasks");

describe("create", () => {
  it("should fail when there's no current user", async () => {
    await expect(getCaller().task.create({ title: "abc" })).rejects.toThrow(
      TRPCError
    );
  });

  it("should create a new task for the current user", async () => {
    testContext.currentUser = { id: "1" };

    await expect(getCaller().task.create({ title: "abc" })).resolves.toEqual({
      key: expect.toBeNonEmptyString(),
      title: "abc",
      userId: "1",
    });

    expect(getCollection().find()).toIncludeAllPartialMembers([
      {
        key: expect.toBeNonEmptyString(),
        title: "abc",
      },
    ]);
  });

  it("should create a new task - with description - for the current user", async () => {
    testContext.currentUser = { id: "1" };

    await expect(
      getCaller().task.create({
        title: "abc",
      })
    ).resolves.toEqual({
      key: expect.toBeNonEmptyString(),
      title: "abc",
      userId: "1",
    });

    await expect(
      getCaller().task.create({
        title: "def",
        description: "testing description",
      })
    ).resolves.toEqual({
      key: expect.toBeNonEmptyString(),
      title: "def",
      description: "testing description",
      userId: "1",
    });

    expect(getCollection().find()).toIncludeSameMembers([
      expect.objectContaining({
        key: expect.toBeNonEmptyString(),
        title: "abc",
      }),
      expect.objectContaining({
        key: expect.toBeNonEmptyString(),
        title: "def",
        description: "testing description",
      }),
    ]);
  });
});

describe("listAll", () => {
  it("should fail when there's no current user", async () => {
    await expect(getCaller().task.listAll()).rejects.toThrow(TRPCError);
  });

  it("should return an empty array when the user does not have tasks", async () => {
    testContext.currentUser = { id: "1" };

    await expect(getCaller().task.listAll()).resolves.toBeEmptyArray();
  });

  it("should return all task of the current user", async () => {
    testContext.currentUser = { id: "1" };

    getCollection().insert([
      {
        key: v4(),
        title: "abc",
        userId: "1",
      },
      {
        key: v4(),
        title: "def",
        userId: "2",
      },
      {
        key: v4(),
        title: "ghi",
        description: "ghi desc",
        userId: "1",
      },
      {
        key: v4(),
        title: "jkl",
        userId: "3",
      },
    ]);

    await expect(getCaller().task.listAll()).resolves.toIncludeSameMembers([
      { key: expect.toBeNonEmptyString(), title: "abc", userId: "1" },
      {
        key: expect.toBeNonEmptyString(),
        title: "ghi",
        description: "ghi desc",
        userId: "1",
      },
    ]);

    testContext.currentUser = { id: "3" };

    await expect(getCaller().task.listAll()).resolves.toIncludeSameMembers([
      { key: expect.toBeNonEmptyString(), title: "jkl", userId: "3" },
    ]);
  });
});
