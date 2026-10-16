import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Articles } from "@/collections/Articles";
import { Courses } from "@/collections/Courses";
import { Paths } from "@/collections/Paths";
import { Users } from "@/collections/Users";
import { editor } from "@/lib/editor";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      // Sign-in is Supabase SSO only (no Payload password), see src/lib/payload-auth.ts.
      afterLogin: ["@/components/admin/SsoButtons#SsoButtons"],
      logout: { Button: "@/components/admin/SignOutButton#SignOutButton" },
    },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Paths, Courses, Articles, Users],
  editor,
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    // Payload lives in its own schema of the Supabase database (created by a Supabase migration).
    schemaName: "payload",
    // Schema changes always go through versioned migrations (src/migrations), never auto-push.
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
    pool: {
      // On Vercel, use the Supabase transaction pooler URL (port 6543); keep the pool small per instance.
      connectionString: process.env.DATABASE_URI,
      max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    },
  }),
  sharp,
});
