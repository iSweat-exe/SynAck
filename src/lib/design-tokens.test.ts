import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { ALL_SWATCHES } from "@/lib/design-tokens";

const css = readFileSync(
  path.resolve(__dirname, "../app/(frontend)/globals.css"),
  "utf8",
);

describe("design tokens", () => {
  it.each(ALL_SWATCHES)("$token is $hex in globals.css", ({ token, hex }) => {
    const match = css.match(
      new RegExp(`^\\s*${token}:\\s*(#[0-9a-f]{6});`, "m"),
    );
    expect(match?.[1]).toBe(hex);
  });

  it("declares every palette color once", () => {
    const names = ALL_SWATCHES.map(({ token }) => token);
    expect(new Set(names).size).toBe(names.length);
  });
});
