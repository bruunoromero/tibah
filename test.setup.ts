import "reflect-metadata";
import { initRegistry } from "~/server/registry";
import { vi } from "vitest";

vi.mock("deta");
vi.mock("envsafe");

initRegistry();
