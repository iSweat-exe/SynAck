import type { Permission } from "@/lib/permissions";
import { isPermission } from "@/lib/permissions";

// Permissions of a back-office user, read from the database on every request by the Supabase auth
// strategy (src/lib/payload-auth.ts) and attached to `req.user`. Never stored in Payload.
export type WithPermissions = { permissions?: readonly string[] };

type MaybeUser =
  (WithPermissions & { id?: string | number }) | null | undefined;

// Deny by default: no user, or a permission that is not in the list, means no.
export function can(user: MaybeUser, permission: Permission): boolean {
  if (!user || !Array.isArray(user.permissions)) return false;
  return user.permissions.includes(permission);
}

// Keeps only the strings of the closed list, so a malformed answer can never grant anything.
export function parsePermissions(value: unknown): Permission[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isPermission);
}
