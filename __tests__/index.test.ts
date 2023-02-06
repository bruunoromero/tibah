import "reflect-metadata";
import { container } from "tsyringe";
import { describe, expect, it } from "vitest";
import { DETA_TOKEN } from "~/server/registry/deta.register";
import { Deta } from "~/server/repositories/core/types/base";

describe("sum", () => {
  it("should 1 + 1 = 2", async () => {
    const users = container.resolve<Deta>(DETA_TOKEN).Base("users");

    await users.insert({ key: "1234", name: "bruno" });
    const user = await users.get("1234");
    expect(user).toEqual(expect.objectContaining({ key: "1234" }));
  });

  it("should 1 + 1 = 2", async () => {
    const users = container.resolve<Deta>(DETA_TOKEN).Base("users");

    const user = await users.fetch({ key: "1234" });
    expect(user).toEqual(
      expect.objectContaining({
        items: [expect.objectContaining({ key: "1234" })],
      })
    );
  });
});
