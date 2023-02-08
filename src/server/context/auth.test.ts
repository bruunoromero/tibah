import {
  getUserFromCookies as fbGetUserFromAuth,
  verifyIdToken,
} from "next-firebase-auth";
import { v4 } from "uuid";
import { Deta } from "__mocks__/deta/in-memory";
import { testContext } from "__utils__/test-context";
import { Apikey } from "~/models/apikey.model";
import {
  getUser,
  getUserFromApiKey,
  getUserFromAuthorization,
  getUserFromCookies,
} from "./auth";

let req: any;

const okToken = "Bearer 1234";
const errToken = "basic 1234";
const apiKey = "5678";

beforeEach(() => {
  req = {
    headers: {},
  };
});

const getCollection = () => Deta().getOrCreateCollection<Apikey>("apikeys");

describe("getUserFromAuthorization ", () => {
  it("should get the user from the token", async () => {
    testContext.currentUser = { id: "1" };

    await expect(getUserFromAuthorization(okToken)).resolves.toEqual({
      id: "1",
    });
    expect(verifyIdToken).toHaveBeenCalledWith("1234");
  });

  it("should fail to authentication when grant type is different of bearer", async () => {
    testContext.currentUser = { id: "1" };

    await expect(getUserFromAuthorization(errToken)).resolves.toBeNull();
    expect(verifyIdToken).not.toHaveBeenCalled();
  });

  it("should return null if it cannot decode id token", async () => {
    await expect(getUserFromAuthorization(okToken)).resolves.toBeNull();
    expect(verifyIdToken).toHaveBeenCalledWith("1234");
  });
});

describe("getUserFromCookies", () => {
  it("should call getUserFromCookies from next-firebase-auth and return current user", async () => {
    testContext.currentUser = { id: "1" };

    await expect(getUserFromCookies(req)).resolves.toEqual({ id: "1" });
    expect(fbGetUserFromAuth).toHaveBeenCalledWith({ req });
  });

  it("should return null when theres no user", async () => {
    await expect(getUserFromCookies(req)).resolves.toBeNull();
    expect(fbGetUserFromAuth).toHaveBeenCalledWith({ req });
  });
});

describe("getUserFromApiKey", () => {
  it("should return null when there's no user associated with that apiKey", async () => {
    await expect(getUserFromApiKey(apiKey)).resolves.toBeNull();
  });

  it("should return the user associated with that apiKey", async () => {
    getCollection().insertOne({ key: v4(), userId: "1", token: apiKey });

    await expect(getUserFromApiKey(apiKey)).resolves.toEqual({ id: "1" });
  });
});

describe("getUser", () => {
  it("should get user from authorization, when header is sent", async () => {
    req = {
      headers: {
        authorization: okToken,
      },
    };
    testContext.currentUser = { id: "1" };

    await expect(getUser(req)).resolves.toEqual({
      id: "1",
    });
    expect(verifyIdToken).toHaveBeenCalledWith("1234");
    expect(fbGetUserFromAuth).not.toBeCalled();
  });

  it("should return null from authorization when an invalid token is sent", async () => {
    req = {
      headers: {
        authorization: errToken,
      },
    };

    testContext.currentUser = { id: "1" };

    await expect(getUser(req)).resolves.toBeNull();
    expect(verifyIdToken).not.toBeCalled();
    expect(fbGetUserFromAuth).not.toBeCalled();
  });

  it("should get user from apikey when header is sent", async () => {
    req = {
      headers: {
        ["x-api-key"]: apiKey,
      },
    };

    getCollection().insertOne({ key: v4(), userId: "1", token: apiKey });

    await expect(getUser(req)).resolves.toEqual({
      id: "1",
    });
    expect(verifyIdToken).not.toBeCalled();
    expect(fbGetUserFromAuth).not.toBeCalled();
  });

  it("should return null from apikey when there's no user if that apikey", async () => {
    req = {
      headers: {
        ["x-api-key"]: apiKey,
      },
    };

    await expect(getUser(req)).resolves.toBeNull();
    expect(verifyIdToken).not.toBeCalled();
    expect(fbGetUserFromAuth).not.toBeCalled();
  });

  it("should get the user from cookies", async () => {
    testContext.currentUser = { id: "1" };

    await expect(getUser(req)).resolves.toEqual({ id: "1" });
    expect(verifyIdToken).not.toBeCalled();
    expect(fbGetUserFromAuth).toHaveBeenCalledWith({ req });
  });

  it("should return null when there's not user on cookie", async () => {
    await expect(getUser(req)).resolves.toBeNull();
    expect(verifyIdToken).not.toBeCalled();
    expect(fbGetUserFromAuth).toHaveBeenCalledWith({ req });
  });
});
