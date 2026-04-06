import { describe, expect, it } from "vitest";
import { isEnabledEnvFlag } from "../src/lib/env";

describe("isEnabledEnvFlag", () => {
  it("treats undefined and common falsey values as disabled", () => {
    expect(isEnabledEnvFlag(undefined)).toBe(false);
    expect(isEnabledEnvFlag("")).toBe(false);
    expect(isEnabledEnvFlag("0")).toBe(false);
    expect(isEnabledEnvFlag("false")).toBe(false);
    expect(isEnabledEnvFlag("none")).toBe(false);
    expect(isEnabledEnvFlag(" False ")).toBe(false);
  });

  it("treats other values as enabled", () => {
    expect(isEnabledEnvFlag("1")).toBe(true);
    expect(isEnabledEnvFlag("true")).toBe(true);
    expect(isEnabledEnvFlag("yes")).toBe(true);
    expect(isEnabledEnvFlag("on")).toBe(true);
  });
});
