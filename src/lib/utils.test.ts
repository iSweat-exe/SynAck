import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("px-2", "px-4", "font-bold")).toBe("px-4 font-bold");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});
