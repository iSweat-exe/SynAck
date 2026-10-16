import { describe, expect, it } from "vitest";

import { safeRedirectPath } from "@/lib/safe-redirect";

describe("safeRedirectPath", () => {
  it.each(["/account", "/courses/intro?chapter=2", "/", "/a/b#c"])(
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
    expect(safeRedirectPath(path)).toBe("/account");
  });

  it("falls back when the value is missing", () => {
    expect(safeRedirectPath(null)).toBe("/account");
    expect(safeRedirectPath(undefined, "/")).toBe("/");
  });
});
