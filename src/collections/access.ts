import type { Access, CollectionBeforeChangeHook, FieldAccess } from "payload";
import { APIError } from "payload";

import { can } from "@/lib/cms-permissions";
import type { Permission } from "@/lib/permissions";

// Access rules of the back office. They read the permissions that the Supabase auth strategy attached to
// `req.user` (re-read from Postgres on every request). Deny by default: no permission, no access.

// Visitors read published documents only; accounts with `cms.access` can read drafts too.
export const publishedOrEditor: Access = ({ req }) => {
  if (can(req.user, "cms.access")) return true;
  return { _status: { equals: "published" } };
};

export const requirePermission =
  (permission: Permission): Access =>
  ({ req }) =>
    can(req.user, permission);

// Anyone holding `permission`, or the author of the document when only `ownPermission` is held.
export const authorOrPermission =
  (permission: Permission, ownPermission: Permission): Access =>
  ({ req }) => {
    if (can(req.user, permission)) return true;
    if (req.user && can(req.user, ownPermission)) {
      return { author: { equals: req.user.id } };
    }
    return false;
  };

// Server-side tools (the content importer, run by someone with database access) mark their requests as
// trusted through the Local API `context`. The REST and GraphQL APIs never let a client set it.
function isTrustedImport(req: { context?: Record<string, unknown> }) {
  return req.context?.trustedImport === true;
}

// Publishing is a separate permission from editing: a draft can be saved without it.
export const publishRequires =
  (permission: Permission): CollectionBeforeChangeHook =>
  ({ data, req }) => {
    if (isTrustedImport(req)) return data;
    if (data._status === "published" && !can(req.user, permission)) {
      throw new APIError("You are not allowed to publish.", 403);
    }
    return data;
  };

// A new document belongs to its creator. Only someone with full edit rights can name another author.
export const authorIsCreator =
  (editPermission: Permission): CollectionBeforeChangeHook =>
  ({ data, req, operation }) => {
    if (operation !== "create" || !req.user) return data;
    if (!data.author || !can(req.user, editPermission)) {
      data.author = req.user.id;
    }
    return data;
  };

// Reassigning a document is reserved to full edit rights.
export const authorFieldAccess =
  (editPermission: Permission): FieldAccess =>
  ({ req }) =>
    can(req.user, editPermission);
