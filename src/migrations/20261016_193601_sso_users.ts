import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."courses" ADD COLUMN "author_id" integer;
  ALTER TABLE "payload"."_courses_v" ADD COLUMN "version_author_id" integer;
  ALTER TABLE "payload"."users" ADD COLUMN "supabase_id" varchar;
  ALTER TABLE "payload"."courses" ADD CONSTRAINT "courses_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v" ADD CONSTRAINT "_courses_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "courses_author_idx" ON "payload"."courses" USING btree ("author_id");
  CREATE INDEX "_courses_v_version_version_author_idx" ON "payload"."_courses_v" USING btree ("version_author_id");
  CREATE UNIQUE INDEX "users_supabase_id_idx" ON "payload"."users" USING btree ("supabase_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."courses" DROP CONSTRAINT "courses_author_id_users_id_fk";
  
  ALTER TABLE "payload"."_courses_v" DROP CONSTRAINT "_courses_v_version_author_id_users_id_fk";
  
  DROP INDEX "payload"."courses_author_idx";
  DROP INDEX "payload"."_courses_v_version_version_author_idx";
  DROP INDEX "payload"."users_supabase_id_idx";
  ALTER TABLE "payload"."courses" DROP COLUMN "author_id";
  ALTER TABLE "payload"."_courses_v" DROP COLUMN "version_author_id";
  ALTER TABLE "payload"."users" DROP COLUMN "supabase_id";`)
}
