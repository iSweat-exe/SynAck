import type { CollectionConfig } from "payload";

// Back-office users (editors and administrators). Learners sign in through Supabase Auth, not here.
// Role-based access is wired to the database permissions in P1.4.
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "User", plural: "Users" },
  admin: { useAsTitle: "email", group: "System" },
  auth: true,
  fields: [{ name: "name", type: "text" }],
};
