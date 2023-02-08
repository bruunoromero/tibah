import "jest-extended";
import "jest-extended/all";
import "expect-more-jest";
import "reflect-metadata";
import Loki from "lokijs";
import { initRegistry } from "~/server/registry";
import { testContext } from "__utils__/test-context";

declare global {
  var db: Loki;
}

jest.mock("deta");
jest.mock("envsafe");
jest.mock("next-firebase-auth");

beforeEach(() => {
  jest.clearAllMocks();
  testContext.resetDb();
  testContext.resetCurrentUser();
});

initRegistry();
