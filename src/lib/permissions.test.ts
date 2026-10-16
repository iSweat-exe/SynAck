import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { PERMISSIONS, PRESETS, isPermission } from "@/lib/permissions";

describe("PERMISSIONS", () => {
  it("uses the resource.action format", () => {
    for (const permission of PERMISSIONS) {
      expect(permission).toMatch(/^[a-z_]+\.[a-z_]+$/);
    }
  });

  it("has no duplicates", () => {
    expect(new Set(PERMISSIONS).size).toBe(PERMISSIONS.length);
  });

  it("recognizes only declared permissions", () => {
    expect(isPermission("courses.publish")).toBe(true);
    expect(isPermission("courses.fly")).toBe(false);
    expect(isPermission(42)).toBe(false);
  });
});

describe("starting presets", () => {
  const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
  const file = readdirSync(migrationsDir).find((name) =>
    name.endsWith("_permissions_and_roles.sql"),
  );
  if (!file) throw new Error("permissions migration not found");
  const sql = readFileSync(path.join(migrationsDir, file), "utf8");

  // Rows of the seed: ('role', 'resource.action')
  const seeded: Record<string, string[]> = {};
  for (const [, role, permission] of sql.matchAll(
    /^\s*\('([a-z_]+)',\s*'([a-z_]+\.[a-z_]+)'\),?\s*$/gm,
  )) {
    (seeded[role] ??= []).push(permission);
  }

  it("match the permissions migration", () => {
    expect(Object.keys(seeded).sort()).toEqual(Object.keys(PRESETS).sort());
    for (const [role, permissions] of Object.entries(PRESETS)) {
      expect([...seeded[role]].sort()).toEqual([...permissions].sort());
    }
  });

  it("only use declared permissions", () => {
    for (const permissions of Object.values(seeded)) {
      for (const permission of permissions) {
        expect(isPermission(permission)).toBe(true);
      }
    }
  });

  it("give the administrator every permission", () => {
    expect([...seeded.administrator].sort()).toEqual([...PERMISSIONS].sort());
  });
});
