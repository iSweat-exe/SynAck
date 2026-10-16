import { describe, expect, it } from "vitest";

import { can, parsePermissions } from "@/lib/cms-permissions";

describe("can", () => {
  it("denies when there is no user", () => {
    expect(can(null, "cms.access")).toBe(false);
    expect(can(undefined, "cms.access")).toBe(false);
  });

  it("denies when the user carries no permission list", () => {
    expect(can({ id: 1 }, "cms.access")).toBe(false);
    expect(can({ permissions: undefined }, "cms.access")).toBe(false);
  });

  it("allows only the permissions that are present", () => {
    const user = { permissions: ["cms.access", "courses.create"] };
    expect(can(user, "cms.access")).toBe(true);
    expect(can(user, "courses.create")).toBe(true);
    expect(can(user, "courses.publish")).toBe(false);
  });
});

describe("parsePermissions", () => {
  it("keeps only known permissions", () => {
    expect(parsePermissions(["cms.access", "made.up", 3, null])).toEqual([
      "cms.access",
    ]);
  });

  it("returns an empty list for anything that is not an array", () => {
    expect(parsePermissions(null)).toEqual([]);
    expect(parsePermissions("cms.access")).toEqual([]);
    expect(parsePermissions({})).toEqual([]);
  });
});
