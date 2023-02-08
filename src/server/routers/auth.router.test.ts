import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";
import { Deta } from "__mocks__/deta/in-memory";
import { testContext } from "__utils__/test-context";
import { getCaller } from "__utils__/trpc";
import { Apikey } from "~/models/apikey.model";

const getCollection = () => Deta().getOrCreateCollection<Apikey>("apikeys");

describe("apikey", () => {
  describe("create", () => {
    it("should fail when user is not authenticated", async () => {
      await expect(getCaller().auth.apikey.create()).rejects.toThrowError(
        TRPCError
      );
    });

    it("should create a new apikey when the user does not have one already", async () => {
      testContext.currentUser = { id: "1" };

      const { key, token, userId } = await getCaller().auth.apikey.create();

      expect(userId).toBe("1");
      expect(getCollection().find().length).toBe(1);
      expect(getCollection().findOne()).toMatchObject({ key, token, userId });
    });

    it("should fail to create a new apikey when the user does have one already", async () => {
      testContext.currentUser = { id: "1" };
      getCollection().insertOne({ key: v4(), token: "abc", userId: "1" });

      await expect(getCaller().auth.apikey.create()).rejects.toThrow(TRPCError);
    });
  });

  describe("get", () => {
    it("should fail when user is not authenticated", async () => {
      await expect(getCaller().auth.apikey.get()).rejects.toThrow(TRPCError);
    });

    it("should return null when the current user does not have an apikey", async () => {
      testContext.currentUser = { id: "1" };

      await expect(getCaller().auth.apikey.get()).resolves.toBeNull();
    });

    it("should return null when the current user does not have an apikey", async () => {
      const key = v4();
      getCollection().insertOne({ key, userId: "1", token: "1234" });
      testContext.currentUser = { id: "1" };

      await expect(getCaller().auth.apikey.get()).resolves.toEqual({
        key,
        userId: "1",
        token: "1234",
      });
    });
  });
});
