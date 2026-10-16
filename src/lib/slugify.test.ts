import { describe, expect, it } from "vitest";

import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it.each([
    ["Introduction à la programmation !", "introduction-a-la-programmation"],
    ["  Variables & types  ", "variables-types"],
    ["Le cœur de TCP", "le-coeur-de-tcp"],
    ["HTTP/2: SYN-ACK", "http-2-syn-ack"],
    ["--déjà--vu--", "deja-vu"],
    ["", ""],
    ["!!!", ""],
  ])("turns %j into %j", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it("limits the length without leaving a trailing dash", () => {
    const slug = slugify("a".repeat(99) + " b");
    expect(slug.length).toBeLessThanOrEqual(100);
    expect(slug.endsWith("-")).toBe(false);
  });
});
