import type { CollectionConfig } from "payload";

import { requirePermission } from "@/collections/access";
import { can } from "@/lib/cms-permissions";
import { supabaseStrategy } from "@/lib/payload-auth";

// Back-office users (editors and administrators). There is no Payload password: the only sign-in is
// Supabase Auth (GitHub, Discord), the same accounts as the app. A Payload user is created on the first
// sign-in of an account that holds `cms.access`; the permissions themselves live in Postgres (P1.4).
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "User", plural: "Users" },
  admin: {
    useAsTitle: "email",
    group: "System",
    hidden: ({ user }) => !can(user, "users.manage"),
  },
  auth: {
    // Keep the e-mail and password columns so the schema does not depend on the auth setup.
    disableLocalStrategy: { enableFields: true, optionalPassword: true },
    strategies: [supabaseStrategy],
  },
  access: {
    admin: ({ req }) => can(req.user, "cms.access"),
    // Users are created by the auth strategy (Local API), never through the REST API.
    create: () => false,
    read: ({ req }) => {
      if (can(req.user, "users.manage")) return true;
      return req.user ? { id: { equals: req.user.id } } : false;
    },
    update: requirePermission("users.manage"),
    delete: requirePermission("users.manage"),
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "supabaseId",
      type: "text",
      unique: true,
      index: true,
      admin: { readOnly: true, description: "Supabase Auth user id." },
      access: { update: () => false },
    },
  ],
};
