import { describe, expect, it } from "vitest";

import { isSafeUrl, validateSafeUrl } from "@/lib/safe-url";

describe("isSafeUrl", () => {
  it.each([
    "https://example.com/a?b=c",
    "http://example.com",
    "mailto:team@example.com",
    "/courses/intro",
    "#chapter-2",
    "  https://example.com  ",
  ])("accepts %s", (url) => {
    expect(isSafeUrl(url)).toBe(true);
  });

  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    " javascript:alert(1)",
    "data:text/html;base64,PHNjcmlwdD4=",
    "vbscript:msgbox(1)",
    "//evil.example.com",
    "ftp://example.com",
    "",
    "not a url",
  ])("rejects %s", (url) => {
    expect(isSafeUrl(url)).toBe(false);
  });

  it("rejects non-string values", () => {
    expect(isSafeUrl(undefined)).toBe(false);
    expect(isSafeUrl(42)).toBe(false);
  });
});

describe("validateSafeUrl", () => {
  it("returns true for a safe URL and a message otherwise", () => {
    expect(validateSafeUrl("https://example.com")).toBe(true);
    expect(validateSafeUrl("javascript:alert(1)")).toEqual(
      expect.stringContaining("Only http(s)"),
    );
  });
});
