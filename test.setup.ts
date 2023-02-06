import "reflect-metadata";
import Loki from "lokijs";
import { initRegistry } from "~/server/registry";
import { resetDb } from "__utils__/deta/in-memory";
import { vi } from "vitest";

declare global {
  var db: Loki;
}

vi.mock("deta");
vi.mock("envsafe");

resetDb();

initRegistry();
