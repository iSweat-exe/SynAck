import { describe, expect, it } from "vitest";

import { safeRedirectPath } from "@/lib/safe-redirect";

describe("safeRedirectPath", () => {
  it.each(["/compte", "/cours/intro?chapitre=2", "/", "/a/b#c"])(
    "keeps the relative path %s",
    (path) => {
      expect(safeRedirectPath(path)).toBe(path);
    },
  );

  it.each([
    "https://evil.example.com",
    "//evil.example.com",
    "/\\evil.example.com",
    "javascript:alert(1)",
    "evil.example.com",
    "/\t/evil.example.com",
    "/\n/evil.example.com",
    "",
  ])("falls back for %j", (path) => {
    expect(safeRedirectPath(path)).toBe("/compte");
  });

  it("falls back when the value is missing", () => {
    expect(safeRedirectPath(null)).toBe("/compte");
    expect(safeRedirectPath(undefined, "/")).toBe("/");
  });
});
