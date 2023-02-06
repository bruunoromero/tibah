import "reflect-metadata";
import Loki from "lokijs";
import { initRegistry } from "~/server/registry";
import { expect, vi } from "vitest";

declare global {
  var db: Loki;
}

vi.mock("deta");
vi.mock("envsafe");

initRegistry();
